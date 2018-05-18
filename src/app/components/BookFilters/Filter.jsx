import React from 'react';
import PropTypes from 'prop-types';
import {
  DotsIcon,
  XIcon,
} from '@nypl/dgx-svg-icons';
import { isEmpty as _isEmpty } from 'underscore';
import utils from '../../utils/utils';

const ANIMATION_TIMEOUT = 300;

class Filter extends React.Component {
  constructor(props) {
    super(props);

    const active = this.props.active;
    this.state = {
      icon: active ? <XIcon /> : null,
      activeClass: active ? 'active' : '',
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      filter,
      focusId,
      active,
      disabled,
    } = nextProps;

    // If the focusId, the id of the filter that was JUST selected/deselected, matches the filter,
    // then load the animation SVG and remove it shortly after. Also focus on it whether it was
    // selected or deselected for accessibility. We then want to add the appropriate SVG based
    // on whether it is active or not.
    if (filter.id === focusId && active && disabled) {
      // Intermediate transition state:
      this.setState({
        icon: <DotsIcon />,
        activeClass: 'transition',
      });

      // Back to either active or inactive:
      let timeout;

      this.props.clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.setState({
          icon: active ? <XIcon /> : null,
          activeClass: active ? 'active' : '',
        });

        this.props.setDisabled(false);
      }, ANIMATION_TIMEOUT);
    } else {
      // We want to set the icon back to its icon.
      this.setState({
        icon: active ? <XIcon /> : null,
        activeClass: active ? 'active' : '',
      });
    }
  }

  onClick() {
    const {
      filter,
      active,
    } = this.props;
    const selectLabel = active ? 'Unselect' : 'Select';
    this.props.onClick(filter.id, !active);

    utils.trackPicks('Filters', `${selectLabel} - ${filter.id}`);
  }

  render() {
    const {
      icon,
      activeClass,
    } = this.state;
    const { filter } = this.props;

    if (_isEmpty(filter)) {
      return null;
    }

    const arialLabel = activeClass === 'active' ? `${filter.label} tag applied` : filter.label;

    return (
      <li className="filter-item">
        <button
          className={`nypl-primary-button ${activeClass}`}
          onClick={this.onClick}
          aria-label={arialLabel}
          disabled={this.props.disabled}
        >
          {icon}<span>{filter.label}</span>
        </button>
      </li>
    );
  }
}

Filter.propTypes = {
  filter: PropTypes.object,
  onClick: PropTypes.func,
  setDisabled: PropTypes.func,
  focusId: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  clearTimeout: PropTypes.func,
};

Filter.defaultProps = {
  clearTimeout: () => {},
  setDisabled: () => {},
};

export default Filter;
