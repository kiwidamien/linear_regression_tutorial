import React from 'react';
import 'css/slider.css';

const Slider = (props) => {
  const {value, name} = props;

  const min = props.min || 0;
  const max = props.max || 100;
  const step = props.step || 1;

  const onInputChange = (event) => { props.onValueChange && props.onValueChange(event.target.value); }

  return (
    <div className='NumericSlider'>
      <div>{name}</div>
      <div className='SliderControls'>
        <input className='Slider' type="range" min={min} max={max} value={value} step={step} onChange={onInputChange}/>
        <input className='TextInput' value={value} onChange={onInputChange}/>
      </div>
    </div>
  );
}

export default Slider;
