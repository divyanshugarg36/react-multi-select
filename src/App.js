import React from 'react';
import { MultiSelect } from './multiSelect';

const DATA = ['A', 'B', 'C']

function App() {
  return (
    <div className="App">
      <MultiSelect
        data={DATA}
        defaultData={[DATA[0], DATA[1]]}
        element={() => 'Hello'}
        selectedElement={() => 'Hello1'}
        searchKey="label"
        maxValues={1}
        showCross
        onChange={(data) => { console.log(data); }}
      />
    </div>
  );
}

export default App;
