import React from 'react';
import { MultiSelect } from './multiSelect';

// const DATA = [
//   { name: 'Fish', values: 'gish' },
//   { name: 'Apple', values: 'apple' },
//   { name: 'Ball', values: 'ball' },
//   { name: 'Ellephant', values: 'ellephant' },
//   { name: 'Cat', values: 'cat' },
//   { name: 'Balled', values: 'balled' },
//   { name: 'Dog', values: 'dog' },
// ];

const DATA = [
  'Fish',
  'Apple',
  'Ball',
  'Ellephant',
  'Cat',
  'Balled',
  'Dog',
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.testSelect = React.createRef();
  }
  componentDidMount() {
    // const multi = this.testSelect.current.getApi();
    // console.log(multi);
    // setTimeout(() => {
    //   multi.clear();
    // }, 2000)
  }

  render() {
    return (
      <div className="App" >
        <MultiSelect
          refApi={this.testSelect}
          data={DATA}
          // defaultData={[DATA[0], DATA[1]]}
          // element={(str) => `${str.name}.`}
          // selectedElement={(str) => `${str.name}.`}
          // searchKey="values"
          // maxValues={1}
          showCross
          onChange={(data) => { console.log(data); }}
        />
      </div>
    );
  }
}

export default App;
