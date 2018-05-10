import React from 'react';
import PropTypes from 'prop-types';
import { gaUtils } from 'dgx-react-ga';

const SimpleButton = (props) => {
  const onClick = () => {
    gaUtils.trackGeneralEvent(props.gaCategory, props.gaAction, props.gaLabel);
    props.onClick();
  };

  return (
    <button
      id={props.id}
      className={props.className}
      href={props.target}
      onClick={onClick}
      style={props.style}
    >
      {props.label}
    </button>
  );
};

SimpleButton.propTypes = {
  gaCategory: PropTypes.string,
  gaAction: PropTypes.string,
  gaLabel: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  lang: PropTypes.string,
  target: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

SimpleButton.defaultProps = {
  id: 'SimpleButton',
  className: 'SimpleButton',
  label: 'Button',
  lang: 'en',
  target: '#',
};

export default SimpleButton;
