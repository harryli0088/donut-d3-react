import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3";

import "./styles.css";

export default class Donut extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //data: [ {value: number, title: string}, ... ]

    colorScale: PropTypes.func,
    onArcMouseOverCallback: PropTypes.func,
    onArcMouseOutCallback: PropTypes.func,
    onArcClickCallback: PropTypes.func,
    maxDiameter: PropTypes.number,
    outerToInnerRadiiRatio: PropTypes.number,
    showKey: PropTypes.bool,
    keyTextOffsetX: PropTypes.number,
    keyTextOffsetY: PropTypes.number,
    keyFontSize: PropTypes.number,
    keyRowSeparation: PropTypes.number,
    keyRectSize: PropTypes.number,
  }

  static defaultProps = {
    colorScale: d3.scaleOrdinal(d3.schemeCategory10),
    onArcMouseOverCallback: function(e, d) {},
    onArcMouseOutCallback:  function(e, d) {},
    onArcClickCallback:  function(e, d) {},
    maxDiameter: 500,
    outerToInnerRadiiRatio: 2,
    showKey: true,
    keyTextOffsetX: 20,
    keyTextOffsetY: 14,
    keyFontSize: 16,
    keyRowSeparation: 20,
    keyRectSize: 16,
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      value: "",
      title: "",
      percentage: "",
    };

    this.donut = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }

  resize = () => {
    if(this.donut.current) {
      this.setState({
        width: this.donut.current.clientWidth, //responsive chart width
      });
    }
  }

  mouseoverArc = (e, d, total) => {
    this.setState({
      value: d.data.value,
      title: d.data.title,
      percentage: roundPercentage(d.data.value/total)+"%"
    });

    this.props.onArcMouseOverCallback(e, d)
  }

  mouseoutArc = e => {
    this.setState({value: "", title: "", percentage: ""});

    this.props.onArcMouseOutCallback(e)
  }


  renderArc = (d, i, radius, total) => {
    return (
      <Arc key={i}
        outerRadius={radius}
        innerRadius={radius / this.props.outerToInnerRadiiRatio}
        d={d}
        total={total}
        mouseover={this.mouseoverArc}
        mouseout={this.mouseoutArc}
        onclick={this.props.onArcClickCallback}
        fill={this.props.colorScale(i)}
      />
    );
  }

  renderKey(d, i, total) {
    return (
      <g key={i} transform={"translate(0,"+(i*this.props.keyRowSeparation)+")"}>
        <rect className="key" fill={this.props.colorScale(i)} x="0" y="0" width={this.props.keyRectSize} height={this.props.keyRectSize}></rect>
        <text transform={"translate("+this.props.keyTextOffsetX+","+this.props.keyTextOffsetY+")"} fontSize={this.props.keyFontSize}>
        {d.data.title} | {d.data.value} | {roundPercentage(d.data.value/total)+"%"}
        </text>
      </g>
    );
  }


  render() {
    const {data, maxDiameter, showKey, keyRowSeparation} = this.props;

    let diameter = Math.min(this.state.width, maxDiameter);

    let x = this.state.width / 2;
    let y = diameter / 2;

    let pie = d3.pie().value(d => d.value);
    let total = data.reduce((a, b) => a + b.value, 0);

    return (
      <div ref={this.donut}>
        <svg className="donut" width={this.state.width} height={diameter}>
          <g transform={`translate(${x}, ${y})`}>
            {pie(data).map((d, i) => this.renderArc(d, i, diameter/2, total))}

            <g>
              <text textAnchor="middle" transform="translate(0,-40)" style={{fontSize:diameter/25+"px"}}>{this.state.title}</text>
              <text textAnchor="middle" transform="translate(0,20)" style={{fontSize:diameter/12+"px"}}>{this.state.percentage}</text>
              <text textAnchor="middle" transform="translate(0,80)" style={{fontSize:diameter/12+"px"}}>{this.state.value}</text>
            </g>
          </g>
        </svg>

        {
          showKey ?
          (
            <svg width={this.state.width} height={data.length*keyRowSeparation}>
              {pie(this.props.data).map((d, i) => this.renderKey(d, i, total))}
            </svg>
          ) :
          null
        }
      </div>
    );
  }
}


class Arc extends Component {
  render() {
    const {d, fill, total, innerRadius , outerRadius} = this.props;

    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    return (
      <path className="arc" d={arc(d)} fill={fill} onClick={e => this.props.onclick(e, d)} onMouseOver={e => this.props.mouseover(e, d, this.props.total)} onMouseOut={e => this.props.mouseout(e)}>
        <title>{d.data.title} - {d.value} - {roundPercentage(d.value/total)}%</title>
      </path>
    );
  }
}


function roundPercentage(number) {
  return Math.round(10000*number)/100;
}
