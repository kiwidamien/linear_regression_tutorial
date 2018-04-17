import React from 'react';
import Slider from 'widgets/slider';
import Button from 'widgets/button';

const renderSidebar = (props) => {
  const {w1, temp0, w2, showW2, onClickLinear, onClickLinearNoise, onClickQuadratic, onClickShowW2} = props;

  return (
    <div className='Sidebar'>
      {Slider(w1)}
      {Slider(temp0)}
      {showW2 && Slider(w2)}

      <div className='NumericSlider'>
        <input type="checkbox" id="quadraticModel" checked={showW2} onClick={onClickShowW2}/>
        <label for="quadraticModel">Use quadratic model?</label>
      </div>

      <Button className='selected' label='Linear data' onClick={onClickLinear}/>
      <Button label='Linear + noise data' onClick={onClickLinearNoise}/>
      <Button label='Quadratic data'onClick={onClickQuadratic}/>
    </div>
  );
}
export default renderSidebar;
