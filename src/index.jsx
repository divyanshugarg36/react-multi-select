import React from 'react';
import { MultiSelect } from './multiSelect';

const DATA = [
  { name: 'Fish', values: 'gish' },
  { name: 'Apple', values: 'apple' },
  { name: 'Ball', values: 'ball' },
  { name: 'Ellephant', values: 'ellephant' },
  { name: 'Cat', values: 'cat' },
  { name: 'Balled', values: 'balled' },
  { name: 'Dog', values: 'dog' },
];

// const DATA = [
//   'Fish',
//   'Apple',
//   'Ball',
//   'Ellephant',
//   'Cat',
//   'Balled',
//   'Dog',
// ];

export class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.testSelect = React.createRef();
  }

  componentDidMount() {
    const multi = this.testSelect.current;
    setInterval(() => {
      console.log(multi);
    }, 1000);
  }

  sub = (e) => {
    e.preventDefault();
    console.log('submitted');
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.sub}>
          <MultiSelect
            refApi={this.testSelect}
            data={DATA}
            defaultData={[DATA[0], DATA[1]]}
            // element={(str) => `${str.name}.`}
            // selectedElement={(str) => `${str.name}.`}
            // searchKey="values"
            minValues={2}
            // maxValues={1}
            showCross
            onChange={(data) => { console.log(data); }}
            required
          />
          <button type="submit">Hello</button>
        </form>
      </div>
    );
  }
}