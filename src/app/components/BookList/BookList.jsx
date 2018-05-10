import React from 'react';
import PropTypes from 'prop-types';

import About from '../About/About';
import Book from '../Book/Book';
import ListTitle from '../ListTitle/ListTitle';

const BookList = ({
  isJsEnabled,
  picks,
  displayInfo,
  displayType,
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
        <ListTitle displayInfo={displayInfo} displayType={displayType} picksCount={picksCount} />
      </div>

      {
        !!picks.length && (
          <ul className="booklist nypl-row">
            {renderBookItems(picks)}
          </ul>
        )
      }

      <About displayType={displayType} />
    </div>
  );
};

BookList.propTypes = {
  picks: PropTypes.array,
  isJsEnabled: PropTypes.bool,
  displayInfo: PropTypes.object,
  displayType: PropTypes.string,
  picksCount: PropTypes.number,
};

BookList.defaultProps = {
  picks: [],
  picksCount: 0,
  displayInfo: {},
};

export default BookList;
