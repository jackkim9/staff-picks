import React from 'react';
import PropTypes from 'prop-types';

import About from '../About/About';
import Book from '../Book/Book';
import ListTitle from '../ListTitle/ListTitle';

const BookList = ({
  isJsEnabled,
  picks,
  type,
  displayInfo,
  picksCount,
}) => {
  const renderBookItems = currentBooks => (
    currentBooks.length ?
      currentBooks.map(book => <Book key={book.slug} pick={book} isJsEnabled={isJsEnabled} />)
      : null
  );

  return (
    <div className="booklist-section nypl-column-three-quarters">
      <div className="list-title-container">
        <ListTitle displayInfo={displayInfo} picksCount={picksCount} />
      </div>

      {
        !!picks.length && (
          <ul className="booklist nypl-row">
            {renderBookItems(picks)}
          </ul>
        )
      }

      <About type={type} />
    </div>
  );
};

BookList.propTypes = {
  picks: PropTypes.array,
  isJsEnabled: PropTypes.bool,
  type: PropTypes.string,
  displayInfo: PropTypes.object,
  picksCount: PropTypes.number,
};

BookList.defaultProps = {
  picks: [],
  picksCount: 0,
  displayInfo: {},
};

export default BookList;
