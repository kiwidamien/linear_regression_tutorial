import React, {Component} from 'react';
import Sidebar from 'components/sidebar';
import renderScatter from 'scatter/scatter';
import datasets from 'datasets/datasets';
import 'css/linearRegression.css';

const scatterPlotProps = {
  width: 1050,
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
   domainInterval: {min: 20, max: 110},
   rangeInterval: {min: 0, max: 150},
   numTicksX: 10
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
      w2Param: {min:-0.05, max:0.05, step: 0.0005, name: 'Quad coeff (w2)'},
      datasetCollection: datasets,
      useQuadraticModel: false,
      datasetName: 'linearSet'
    };
  }

  changeDataset(newDatasetName) {
    const newPoints = this.state.datasetCollection[newDatasetName];
    const updateState = {
      scatterPlot: {...this.state.scatterPlot}
    };
    updateState.scatterPlot.pointLocations = newPoints;
    updateState.datasetName = newDatasetName;
    this.setState(updateState);
  }

  onGradientChange(newGradient) {
    this.setState({w1: newGradient});
  }

  onTemp0Change(newTemp0) {
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

      const PropsW2 = {
        ...this.state.w2Param, value: this.state.w2,
        onValueChange: x => this.onQuadCoeffChange(x)
      }

      return Sidebar({
        w1: PropsW1,
        temp0: PropsTemp0,
        w2: PropsW2,
        showW2: this.state.useQuadraticModel,
        onClickLinear: () => this.changeDataset('linearSet'),
        onClickLinearNoise: () => this.changeDataset('linearNoise'),
        onClickQuadratic: () => this.changeDataset('quadratic'),
        onClickShowW2: () => this.setState({useQuadraticModel: !this.state.useQuadraticModel}),
        datasetName: this.state.datasetName
      });
  }

  renderRmsVsGradient() {
    const currentRMSError = this.rmsError(this.state.w2, this.state.w1, this.state.temp0);

    const scatterProps = {
      width: 340,
      height: 350,
      plotFunction: x => this.rmsError(this.state.w2, x, this.state.temp0),
      xlabel: 'w1',
      ylabel: 'RMS error',
      title: `Error with temp0 held at ${round(this.state.temp0)}`,
      pointLocations: [{x: this.state.w1, y: currentRMSError}],
      domainInterval: {...this.state.w1Param},
      rangeInterval: {min:0, max: 60},
      nPoints: 250
    }

    return renderScatter(scatterProps);
  }

  renderRmsVsTemp0() {
    const currentRMSError = this.rmsError(this.state.w2, this.state.w1, this.state.temp0);

    const scatterProps = {
      width: 340,
      height: 350,
      plotFunction: x => this.rmsError(this.state.w2, this.state.w1, x),
      xlabel: 'temp0',
      ylabel: 'RMS error',
      title: `Error with w1 held at ${round(this.state.w1)}`,
      pointLocations: [{x: this.state.temp0, y: currentRMSError}],
      domainInterval: {...this.state.temp0Param},
      rangeInterval: {min:0, max: 60},
      nPoints: 250
    }

    return renderScatter(scatterProps);
  }

  renderRmsVsW2() {
    const currentRMSError = this.rmsError(this.state.w2, this.state.w1, this.state.temp0);

    const scatterProps = {
      width: 340,
      height: 350,
      plotFunction: x => this.rmsError(x, this.state.w1, this.state.temp0),
      xlabel: 'w2',
      ylabel: 'RMS error',
      title: `Error`,
      pointLocations: [{x: this.state.w2, y: currentRMSError}],
      domainInterval: {...this.state.w2Param},
      rangeInterval: {min:0, max: 260},
      nPoints: 250
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
      const {w2, w1, temp0} = this.state;
      const plotFunction = (x) => w2*x*x + w1*(x - temp0);

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
            {renderScatter({...this.state.scatterPlot, plotFunction})}
            <div className='errorGraphs'>
              {this.state.useQuadraticModel && this.renderRmsVsW2()}
              {this.renderRmsVsGradient()}
              {this.renderRmsVsTemp0()}
            </div>
          </div>
        </div>
      );
  }
}

export default LinearRegression;
