import React, {Component} from 'react';
import Sidebar from 'components/sidebar';
import renderScatter from 'scatter/scatter';
import 'css/linearRegression.css';

const scatterPlotProps = {
  width: 650,
  height: 300,
  plotFunction: x => x,
  xlabel: 'Temperature (F)',
  ylabel: 'Counts (100s people)',
  title: 'Park visitors vs Temperature',
  pointLocations:
    [
     {'x': 44.0, 'y': 26.400000000000002},
     {'x': 60.0, 'y': 61.600000000000009},
     {'x': 61.0, 'y': 63.800000000000004},
     {'x': 62.0, 'y': 66.0},
     {'x': 63.0, 'y': 68.200000000000003},
     {'x': 70.0, 'y': 83.600000000000009},
     {'x': 75.0, 'y': 94.600000000000009},
     {'x': 82.5, 'y': 111.10000000000001},
     {'x': 90.0, 'y': 127.60000000000001},
     {'x': 86.0, 'y': 118.80000000000001},
     {'x': 96.0, 'y': 140.80000000000001}
   ],
   domainInterval: {min: 20, max: 100},
   rangeInterval: {min: 0, max: 150}

}

const round = (number, decimal_places = 3) => {
  const factor = Math.pow(10, decimal_places);
  return Math.round(number * factor) / factor;
}

class LinearRegression extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scatterPlot: scatterPlotProps,
      w1: 0.0,
      w1Param: {min: -1, max: 3, step: 0.01, name: 'Gradient (w1)'},
      temp0: 0.0,
      temp0Param: {min: -20, max: 80, step: 0.1, name: 'Temp0'},
      w2: 0.0,
      w2Param: {min:-3, max:5, step: 0.01, name: 'Quad coeff (w2)'},
      useQuadraticModel: false
    };
  }

  onGradientChange(newGradient) {
    this.setState({w1: newGradient});
  }

  onTemp0Change(newTemp0) {
    console.log('called');
    this.setState({temp0: newTemp0});
  }

  onQuadCoeffChange(newQuadCoeff) {
    this.setState({w2: newQuadCoeff});
  }

  predict(temp, w2, w1, temp0) {
    return w2 * temp * temp + w1*(temp - temp0);
  }

  rmsError(w2,w1,temp0) {
      let squaredError = 0.0;
      const points = this.state.scatterPlot.pointLocations;

      points.forEach( point => {
        const error = this.predict(point.x, w2, w1, temp0) - point.y;
        squaredError += error*error;
      });
      const mean_squared_error = squaredError / points.length;
      return Math.sqrt(mean_squared_error);
  }

  meanError(w2, w1, temp0) {
    let error = 0;
    const points = this.state.scatterPlot.pointLocations;
    points.forEach( point => {
      error += this.predict(point.x, w2, w1, temp0) - point.y;
    });
    return error / points.length;
  }

  renderSidebar() {
      const PropsW1 = {
        ...this.state.w1Param, value: this.state.w1,
        onValueChange: x => this.onGradientChange(x)
      };

      const PropsTemp0 = {
        ...this.state.temp0Param, value: this.state.temp0,
        onValueChange: x => this.onTemp0Change(x)
      };

      return Sidebar({w1: PropsW1, temp0: PropsTemp0});
  }

  renderRmsVsGradient() {
    const currentRMSError = this.rmsError(0, this.state.w1, this.state.temp0);

    const scatterProps = {
      width: 300,
      height: 250,
      plotFunction: x => this.rmsError(this.state.w2, x, this.state.temp0),
      xlabel: 'w1',
      ylabel: 'RMS error',
      title: `Error with temp0 held at ${round(this.state.temp0)}`,
      pointLocations: [{x: this.state.w1, y: currentRMSError}],
      domainInterval: {...this.state.w1Param},
      rangeInterval: {min:0, max: 60}
    }

    return renderScatter(scatterProps);
  }

  renderRmsVsTemp0() {
    const currentRMSError = this.rmsError(0, this.state.w1, this.state.temp0);

    const scatterProps = {
      width: 300,
      height: 250,
      plotFunction: x => this.rmsError(this.state.w2, this.state.w1, x),
      xlabel: 'temp0',
      ylabel: 'RMS error',
      title: `Error with w1 held at ${round(this.state.w1)}`,
      pointLocations: [{x: this.state.temp0, y: currentRMSError}],
      domainInterval: {...this.state.temp0Param},
      rangeInterval: {min:0, max: 60}
    }

    return renderScatter(scatterProps);
  }

  renderMessage(text) {
    return (
      <div className='messageBox'>
        {text}
      </div>
    );
  }

  render() {
      const plotFunction = (x) => this.state.w1*(x - this.state.temp0);
      const {w2, w1, temp0} = this.state;
      const error = this.meanError(w2, w1, temp0)
      const rms = this.rmsError(w2,w1, temp0);

      const errorMsg = `Mean error = ${round(error)} people.`
      const rmsMsg = `Root mean squared error = ${round(rms)}`;
      return (
        <div className='linearRegression'>
          <div className='realSidebar'>
            {this.renderSidebar()}
            {this.renderMessage(errorMsg)}
            {this.renderMessage(rmsMsg)}
          </div>
          <div className='graphArea'>
            {renderScatter({...scatterPlotProps, plotFunction})}
            <div className='errorGraphs'>
              {this.renderRmsVsGradient()}
              {this.renderRmsVsTemp0()}
            </div>
          </div>
        </div>
      );
  }
}

export default LinearRegression;
