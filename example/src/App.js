import React, { Component } from 'react'

import Donut from 'donut-d3-react'

var data = [
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
      <div>
        <Donut data={data}/>
      </div>
    )
  }
}
