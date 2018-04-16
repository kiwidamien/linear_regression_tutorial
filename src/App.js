import React, { Component } from 'react';
import renderScatter from 'scatter/scatter';
import LinearRegression from 'LinearRegression';
import 'App.css';

const scatterPlotProps = {
  width: 300,
  height: 300,
  plotFunction: x => x,
  xlabel: 'Temperature (F)',
  ylabel: 'Counts (100s people)',
  pointLocations: [
    {x: 0, y: 0}, {x: 5, y: 7}, {x: 8, y: 10}, {x:9, y:5}, {x: 8.5, y:7}
  ]
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <LinearRegression />
      </div>
    );
  }
}

export default App;
