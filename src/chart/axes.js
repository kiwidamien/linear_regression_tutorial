import React from 'react';


import {select} from 'd3-selection';
import {axisLeft, axisBottom} from 'd3-axis';

function renderAxis(axisObject, shiftLeft_px, shiftDown_px) {
  return (
    <g
      ref={(element) => select(element).call(axisObject)}
      transform={`translate(${shiftLeft_px}, ${shiftDown_px})`}
      className={'histogram--axis'}
    />
  );
}

function renderLabel(label, shiftLeft_px, shiftDown_px, rotationAngle) {
  return (
    <g>
      <text
        transform={`translate(${shiftLeft_px}, ${shiftDown_px}) rotate(${rotationAngle})`}
        className='axis-label'
      >{label}</text>
    </g>
  );
}

const defaultProps = {
  height: 400,
  tickSize: 4,
  tickPadding: 4,
  numTicks: 5
};

const makeAxis = (axisFunction, scale, props) => {
  return axisFunction(scale)
          .tickSize(props.tickSize || defaultProps.tickSize)
          .tickPadding([props.tickPadding || defaultProps.tickPadding])
          .ticks([props.numTicks || defaultProps.numTicks]);
}

const renderAxes = (props) => {
  const {xScale, yScale, margins, width, height} = props;

  const xAxis = makeAxis(axisBottom, xScale, {...props, numTicks: props.numTicksX});

  const yAxis = makeAxis(axisLeft, yScale, {...props, numTicks: props.numTicksY});

  return (
    <g>
      {renderAxis(yAxis, xScale(xScale.domain()[0]), 0)}
      {renderAxis(xAxis, 0, yScale(yScale.domain()[0]))}
      {props.xlabel && renderLabel(props.xlabel, width/2, height, 0)}
      {props.ylabel && renderLabel(props.ylabel, 15, height/2, -90)}
    </g>
  );
}

export default renderAxes;
