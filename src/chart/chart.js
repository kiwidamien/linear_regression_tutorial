import React from 'react';

import {scaleLinear} from 'd3-scale';
import {d3Selection} from 'd3-selection';
import {max, min} from 'd3-array';
import {axisLeft, axisBottom} from 'd3-axis';

function renderAxis(axisObject, shiftLeft_px, shiftDown_px) {
  return (
    <g
      ref={(element) => d3Selection.select(element).call(axisObject)}
      transform={`translate(${shiftLeft_px}, ${shiftDown_px})`}
      className={'histogram--axis'}
    />
  );
}

const defaultProps = {
  width: 600,
  height: 400,
  tickSize: 4,
  tickPadding: 4,
  numTicks: 5
};

const makeAxis = (axisFuncion, scale, props) => {
  return axisFunction(scale)
          .tickSize(props.tickSize || defaultProps.tickSize)
          .tickPadding([props.tickPadding || defaultProps.tickPadding])
          .ticks([props.numTicks || defaultProps.numTicks]);
}

const renderAxes = (props) => {
  const {xScale, yScale} = props;

  const margins = {
    top: 10,
    bottom: 18,
    left: 25,
    right:10
  };

  const xAxis = makeAxis(axisBottom, xScale, {...props, numTicks: numTicksX});

  const yAxis = makeAxis(axisLeft, yScale, {...props, numTicks: numTicksY});

  return (
    <g>
      {renderAxis(xAxis, margins.left, margins.top)}
      {renderAxis(yAxis, margins.left, props.height || defaultProps.height + margins.top)}
    </g>
  )
}
