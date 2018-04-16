import React from 'react';
import Slider from 'widgets/slider';

const renderSidebar = (props) => {
  const {w1, temp0} = props;

  return (
    <div className='Sidebar'>
      {Slider(w1)}
      {Slider(temp0)}
    </div>
  );
}
export default renderSidebar;
