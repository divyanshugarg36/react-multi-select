import React from 'react';
import { MultiSelect } from './multiSelect';

const DATA = [
  'Apple',
  'Ball',
  'Cat',
  'Dog',
  'Elephant',
  'Fish'
]

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
          ref1={this.testSelect}
          data={DATA}
          defaultData={[DATA[0], DATA[1]]}
          element={() => 'Hello'}
          selectedElement={() => 'Hello1'}
          // searchKey="label"
          // maxValues={1}
          showCross
          onChange={(data) => { console.log(data); }}
        />
      </div>
    );
  }
}

export default App;
