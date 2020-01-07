import React from 'react';
import axios from 'axios';
import { MultiSelect } from './multiSelect';
import { GlobeLabel } from './globeLabel';

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

  getData = () => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(({ data }) => {
        this.setState({ countries: data, defaultCountries: [data[10], data[55]] });
        console.log('Data Added');
        console.log(data);
      });
  }

  sub = (e) => {
    e.preventDefault();
    const multi = this.testSelect.current;
    console.log(multi);
  }

  render() {
    const { countries, defaultCountries } = this.state;
    return (
      <div className="App">
        <form onSubmit={this.sub}>
          <div className="flex">
            <MultiSelect
              refApi={this.testSelect}
              data={countries}
              defaultData={defaultCountries}
              searchKey="name"
              minValues={2}
              showCross
              onChange={(data) => { console.log('Data onChange', data); }}
              required
            />
            <MultiSelect
              refApi={this.testSelect}
              data={countries}
              defaultData={defaultCountries}
              selectedElement={({ name, flag }) => <GlobeLabel label={name} image={flag} />}
              element={({ name, flag }) => <GlobeLabel label={name} image={flag} margin />}
              searchKey="name"
              required
            />
          </div>
          <div className="flex">
            <button type="submit">Submit</button>
            {countries.length === 0
              && <button type="button" onClick={this.getData}>Add Data</button>}
          </div>
        </form>
      </div>
    );
  }
}
