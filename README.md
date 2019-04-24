# donut-d3-react
> responsive donut vis using d3 and react

![Demo](/example/donut-d3-react.gif)

## Development
```bash
npm install
npm start #live reload when you make a change

#open another terminal / tab
cd example
npm install
npm start #live reload when you make a change
```

## Install

```bash
npm install --save harryli0088/donut-d3-react
```

## Usage

```jsx
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

```

## License

MIT © [harryli0088](https://github.com/harryli0088)
