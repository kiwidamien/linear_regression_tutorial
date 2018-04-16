import React from 'react';
import renderAxes from '../chart/axes';
import {scaleLinear} from 'd3-scale';
import {max, min} from 'd3-array';
import {line} from 'd3-shape';
import {scatterStyle} from '../css/scatter.css';

function plotFunction(fPlot, domainInterval, xScale, yScale, nPoints=50){
  const step = (domainInterval.max - domainInterval.min) / (nPoints - 1);
  const xPoints = Array(nPoints).fill(0).map( (value,index) => domainInterval.min + index*step )
  const lineElement = line().x(x => xScale(x)).y(x => yScale(fPlot(x)));
  return (
    <path
      className='fitline'
      d={lineElement(xPoints)}
    />
  );
}

function plotErrorBars(fPlot, xScale, yScale, pointLocations) {
  const lineElementGenerator = line().x(pt => xScale(pt.x)).y( pt => yScale(pt.y));

  const lineElements = pointLocations.map( (loc, index) => {
    const points = [{x: loc.x, y:loc.y}, {x: loc.x, y: fPlot(loc.x)}];
    const className = (points[0].y > points[1].y) ? 'error-predict-low' : 'error-predict-high';
    return <path className={className} d={lineElementGenerator(points)} key={index}/>
  });

  return lineElements;
}

function renderScatter(props){
  const {width, height, pointLocations} = props;

  const margins = {
    top: 10,
    bottom: 22,
    left: 25,
    right:10
  };

  const plotWidth = width - margins.left - margins.right;
  const plotHeight= height - margins.top - margins.bottom;

  const domainInterval = props.domainInterval || {
    'min': min(pointLocations.map((loc) => loc.x)),
    'max': max(pointLocations.map((loc) => loc.x))
  };

  const rangeInterval = props.rangeInterval || {
    'min': min(pointLocations.map((loc) => loc.y)),
    'max': max(pointLocations.map((loc) => loc.y))
  };

  const xScale = scaleLinear().domain([domainInterval.min, domainInterval.max])
                  .range([margins.left,plotWidth])

  const yScale = scaleLinear().domain([rangeInterval.min, rangeInterval.max])
                  .range([height-margins.bottom-margins.top, margins.top])

  const points = pointLocations.map((location, index) => {
    return (
      <circle
          cx={xScale(location.x)}
          cy={yScale(location.y)}
          r={props.radius || 5}
          key={index}
      />
    )
  });

  return (
    <svg width={props.width} height={props.height}>
      {renderAxes({...props, xScale, yScale, margins, height})}
      <g>{
        props.plotFunction &&
        plotFunction(props.plotFunction, domainInterval, xScale, yScale, props.nPoints || 50)
      }</g>
      <g>{
        props.plotFunction &&
        plotErrorBars(props.plotFunction, xScale, yScale, pointLocations)
      }</g>
      <g>{points}</g>
      <g>
        <text className='scatter-title'
              transform={`translate(${width/2}, 20)`}
        > {props.title} </text>
      </g>
    </svg>
  );
}

export default renderScatter;
