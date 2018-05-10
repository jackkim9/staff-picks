import React from 'react';
import PropTypes from 'prop-types';

const ListTitle = (props) => {
  const { displayDate = {}, displayAge } = props.displayInfo;
  const booksfound = `${props.picksCount} Book${props.picksCount === 1 ? '' : 's'} Found`;
  const idPrefix = props.idPrefix ? `${props.idPrefix}-` : '';

  if (!displayDate.year) {
    return null;
  }

  if (props.displayType !== 'staff-picks') {
    return (
      <h2 id={`${idPrefix}list-title`} tabIndex="0">
        {displayDate.year} Picks
        <span className="pick-count">{booksfound}</span>
      </h2>
    );
  }

  if (!displayDate.month || !displayDate.year || !displayAge) {
    return null;
  }

  return (
    <h2 id={`${idPrefix}list-title`} tabIndex="0">
      {displayDate.month} {displayDate.year} Picks for {displayAge}
      <span className="pick-count">{booksfound}</span>
    </h2>
  );
};

ListTitle.propTypes = {
  displayInfo: PropTypes.object,
  displayType: PropTypes.string,
  picksCount: PropTypes.number,
  idPrefix: PropTypes.string,
};

ListTitle.defaultProps = {
  displayInfo: {},
  displayType: '',
  picksCount: 0,
  idPrefix: '',
};

export default ListTitle;
