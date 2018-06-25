import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../utils/utils';

const ListTitle = (props) => {
  const { displayDate = {}, displayAge } = props.displayInfo;
  const booksCount = utils.makePlural('Book', props.picksCount, true);
  const booksFound = `${booksCount} Found`;
  const idPrefix = props.idPrefix ? `${props.idPrefix}-` : '';

  // General check to see if the year is available.
  if (!displayDate.year) {
    return null;
  }

  const isStaffPicks = (props.displayType === 'staff-picks');
  const ageGroup = utils.makePlural(displayAge);
  const content = isStaffPicks ?
    `${displayDate.month} ${displayDate.year} Picks for ${ageGroup}` :
    `${displayDate.year} Picks`;

  // If it's staff picks and we don't have the following data then return null;
  if (isStaffPicks && (!displayDate.month || !displayDate.year || !displayAge)) {
    return null;
  }

  return (
    <h2 id={`${idPrefix}list-title`} tabIndex="0">
      {content}
      <span className="pick-count">{booksFound}</span>
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
