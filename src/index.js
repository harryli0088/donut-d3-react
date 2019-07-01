import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3";

import "./styles.css";

const KEY_TEXT_OFFSET = 20;

export default class Donut extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //data: [{value: number, title: string}]
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      value: "",
      title: "",
      percentage: "",
    };

    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    this.resize = this.resize.bind(this);
    this.renderSlice = this.renderSlice.bind(this);
    this.mouseoverSlice = this.mouseoverSlice.bind(this);
    this.mouseoutSlice = this.mouseoutSlice.bind(this);

    this.pie = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }

  resize() {
    if(this.pie.current) {
      this.setState({
        width: this.pie.current.clientWidth, //responsive chart width
      });
    }
  }

  mouseoverSlice(d, total) {
    this.setState({
      value: d.data.value,
      title: d.data.title,
      percentage: clampPercentage(d.data.value/total)
    });
  }

  mouseoutSlice() {
    this.setState({value: "", title: "", percentage: ""});
  }


  renderSlice(d, i, radius, total) {
    return (
      <Slice key={i}
        outerRadius={radius}
        innerRadius={radius/2}
        d={d}
        total={total}
        mouseover={this.mouseoverSlice}
        mouseout={this.mouseoutSlice}
        fill={this.colorScale(i)}
      />
    );
  }

  renderKey(d, i, total) {
    return (
      <g key={i} transform={"translate(0,"+(i*KEY_TEXT_OFFSET)+")"}>
        <rect className="key" fill={this.colorScale(i)} x="0" y="0" width="16" height="16"></rect>
        <text transform={"translate("+KEY_TEXT_OFFSET+",14)"}>{d.data.title} | {clampNumber(d.data.value)} | {clampPercentage(d.data.value/total)}</text>
      </g>
    );
  }


  render() {
    let diameter = Math.min(this.state.width, 500);

    let x = this.state.width / 2;
    let y = diameter / 2;

    let pie = d3.pie().value(d => d.value);
    let total = this.props.data.reduce((a, b) => a + b.value, 0);

    return (
      <div ref={this.pie}>
        <svg className="pie" width={this.state.width} height={diameter}>
          <g transform={`translate(${x}, ${y})`}>
            {/* Render a slice for each data point */}
            {pie(this.props.data).map((d, i) => this.renderSlice(d, i, diameter/2, total))}

            <g>
              <text textAnchor="middle" transform="translate(0,-40)" style={{fontSize:diameter/25+"px"}}>{this.state.title}</text>
              <text textAnchor="middle" transform="translate(0,20)" style={{fontSize:diameter/12+"px"}}>{this.state.percentage}</text>
              <text textAnchor="middle" transform="translate(0,80)" style={{fontSize:diameter/12+"px"}}>{typeof this.state.value==="string" ? "" : clampNumber(this.state.value)}</text>
            </g>
          </g>
        </svg>

        <svg width={this.state.width} height={this.props.data.length*KEY_TEXT_OFFSET}>
          {pie(this.props.data).map((d, i) => this.renderKey(d, i, total))}
        </svg>
      </div>
    );
  }
}


class Slice extends Component {
  render() {
    let {d, fill, innerRadius , outerRadius} = this.props;

    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    return (
      <path className="arc" d={arc(d)} fill={fill} onMouseOver={() => this.props.mouseover(d, this.props.total)} onMouseOut={() => this.props.mouseout()}/>
    );
  }
}


function clampNumber(number) {
  return Math.round(100 * number) / 100;
}

function clampPercentage(number) {
  return Math.round(10000 * number) / 100 + "%";
}
