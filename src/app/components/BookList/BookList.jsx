import React from 'react';
import PropTypes from 'prop-types';

import About from '../About/About';
import Book from '../Book/Book';

const BookList = ({
  isJsEnabled,
  picks,
  displayType,
}) => {
  const renderBookItems = currentBooks => (
    currentBooks.length ?
      currentBooks.map(book => <Book key={book.slug} pick={book} isJsEnabled={isJsEnabled} />)
      : null
  );

  return (
    <div className="booklist-section nypl-column-three-quarters">
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
  displayType: PropTypes.string,
};

BookList.defaultProps = {
  picks: [],
};

export default BookList;
