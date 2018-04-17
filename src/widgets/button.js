import React from 'react';
import 'css/button.css';

const Button = (props) => {
  const {label, onClick} = props;
  return (
    <div className='button' onClick={() => onClick()}>
      {label}
    </div>
  )
}

export default Button;
