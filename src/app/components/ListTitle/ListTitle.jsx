import React from 'react';
import PropTypes from 'prop-types';

const ListTitle = (props) => {
  const { displayDate = {}, displayAge } = props.displayInfo;
  const booksfound = `${props.picksCount} Book${props.picksCount === 1 ? '' : 's'} Found`;
  const idPrefix = props.idPrefix ? `${props.idPrefix}-` : '';

  // General check to see if the year is available.
  if (!displayDate.year) {
    return null;
  }

  const isStaffPicks = (props.displayType === 'staff-picks');
  const content = isStaffPicks ?
    `${displayDate.month} ${displayDate.year} Picks for ${displayAge}` :
    `${displayDate.year} Picks`;

  // If it's staff picks and we don't have the following data then return null;
  if (isStaffPicks && (!displayDate.month || !displayDate.year || !displayAge)) {
    return null;
  }

  return (
    <h2 id={`${idPrefix}list-title`} tabIndex="0">
      {content}
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
