import React, { Component } from 'react'

import Donut from 'donut-d3-react'

let data = [
  {"title":"A","value":4},
  {"title":"B","value":7},
  {"title":"C","value":6},
  {"title":"D","value":8},
  {"title":"E","value":1},
  {"title":"F","value":5}
];


export default class App extends Component {
  render () {
    return (
      <Donut
        data={data} //data: [ {value: number, title: string}, ... ]

        //optional props
        //colorScale defaults to d3.scaleOrdinal(d3.schemeCategory10)
        onArcMouseOverHandler={function(e, d) {}}
        onArcMouseOutHandler={function(e, d) {}}
        onArcClickHandler={function(e, d) {}}
        maxDiameter={500}
        outerToInnerRadiiRatio={2}
        showKey={true}
        keyTextOffsetX={20}
        keyTextOffsetY={14}
        keyFontSize={16}
        keyRowSeparation={20}
        keyRectSize={16}
      />
    )
  }
}
