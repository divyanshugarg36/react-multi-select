import React from 'react';
import axios from 'axios';
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
    this.state = { countries: [] };
    this.testSelect = React.createRef();
  }

  componentDidMount() {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then((response) => {
        this.setState({ countries: response.data });
      });
  }

  sub = (e) => {
    e.preventDefault();
    const multi = this.testSelect.current;
    console.log(multi);
  }

  render() {
    const { countries } = this.state;
    return (
      <div className="App">
        <form onSubmit={this.sub}>
          <MultiSelect
            refApi={this.testSelect}
            data={countries}
            // defaultData={[DATA[0], DATA[1]]}
            // element={(str) => `${str.name}.`}
            // selectedElement={(str) => `${str.name}.`}
            searchKey="name"
            minValues={2}
            // maxValues={1}
            showCross
            // onChange={(data) => { console.log(data); }}
            required
          />
          <button type="submit">Hello</button>
        </form>
      </div>
    );
  }
}
