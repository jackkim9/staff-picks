import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { EReaderIcon, BookIcon } from '@nypl/dgx-svg-icons';
import { isEmpty as _isEmpty, isString as _isString } from 'underscore';
import config from '../../../../appConfig';
import utils from '../../utils/utils';
import { Lazy } from 'react-lazy';

const Book = ({ pick, isJsEnabled }) => {
  const isStringEmpty = string => (!_isString(string) || _isEmpty(string.trim()));

  const getBookObject = obj => (obj.book || {});

  const getReviewsArray = obj => (obj.reviews || []);

  const getTagArray = picks => (picks.tags && picks.tags.length ? pick.tags : []);

  const getTagClasses = arrayOfTags => (!_isEmpty(arrayOfTags) ? arrayOfTags.join(' ') : '');

  if (_isEmpty(pick)) {
    return null;
  }

  const book = getBookObject(pick);
  const gaEvent = (type) => {
    utils.trackPicks('Request', `${type} - ${book.title}`);
  };

  const renderBookCoverImage = (imageUrl) => {
    const defaultImageUrl = `${config.baseUrl}src/client/images/book-place-holder.png`;
    const fullImgSrc = isStringEmpty(imageUrl) ? defaultImageUrl : imageUrl;

    return (
      // Uses lazy load to load the images based on the view
      <Lazy component="div" className="book-item-image-box" cushion={2000} ltIE9>
        <img className="on-load" alt="" src={fullImgSrc} />
      </Lazy>
    );
  };

  const renderTitle = title => (
    !isStringEmpty(title) ? <h3 className="book-item-title">{title}</h3> : null
  );

  const renderAuthor = author => (
    !isStringEmpty(author) ? <p className="book-item-author">By {author}</p> : null
  );

  const renderIllustrator = illustrator => (
    !isStringEmpty(illustrator) ?
      <p className="book-item-illustrator">Illustrated by {illustrator}</p> : null
  );

  const renderTranslator = translator => (
    !isStringEmpty(translator) ?
      <p className="book-item-translator">Translated by {translator}</p> : null
  );

  const renderCatalogLinks = (catalogUrl, ebookUrl) => {
    const catalogLink = !isStringEmpty(catalogUrl) ? (
      <a
        href={catalogUrl}
        className="catalog-url"
        onClick={() => gaEvent('Book')}
        aria-label={`Request Book: ${book.title}`}
      >
        <BookIcon width="32px" height="32px" ariaHidden />
        <span>{config.requestUrlsText.catalog}</span>
      </a>) : null;

    const ebookLink = !isStringEmpty(ebookUrl) ? (
      <a
        href={ebookUrl}
        className="ebook-url"
        onClick={() => gaEvent('E-Book')}
        aria-label={`Request E-Book: ${book.title}`}
      >
        <EReaderIcon ariaHidden />
        <span>{config.requestUrlsText.ebook}</span>
      </a>) : null;

    return (catalogLink || ebookLink) ?
      <div className="book-item-catalog-links">
        {catalogLink}
        {ebookLink}
      </div> : null;
  };

  const renderDescription = (reviewsArray) => {
    if (!_isEmpty(reviewsArray) && reviewsArray[0].text && reviewsArray[0].text.trim() !== '') {
      const review = reviewsArray[0];
      const text = review.text;
      let reviewerName = '';
      let reviewerNameDOM;
      let location = '';
      if (review.reviewerName) {
        reviewerName = review.reviewerName.trim();
        location = review.reviewerLocation ? `, ${review.reviewerLocation.prefLabel}` : '';
        reviewerNameDOM = (
          <p className="book-item-picked-by">Staff Pick By: {reviewerName}{location}</p>
        );
      }

      return (
        <div>
          <p className="book-item-description">{text}</p>
          {reviewerNameDOM}
        </div>
      );
    }
    return null;
  };

  const renderTags = (tags, jsEnabled) => {
    const tagsMarkup = !_isEmpty(tags) ?
      tags.map((tag, i) => <span key={i}>{tag}{i !== (tags.length - 1) ? ', ' : ''}</span>) : null;
    const hiddenClass = jsEnabled ? 'visuallyHidden js' : 'no-js';

    return (tagsMarkup) ?
      (<p className={`book-item-tags ${hiddenClass}`}><span>Tags: </span>{tagsMarkup}</p>)
      : null;
  };

  const reviewsArray = getReviewsArray(pick);
  const tagsArray = utils.getPickTags(pick);
  const fullTagsArray = getTagArray(pick);
  const hasIllustratorTranslatorClass = !isStringEmpty(book.translator)
    && !isStringEmpty(book.illustrator) ? 'withTranslatorIllustrator' : '';

  return (
    <li
      className={`book-item ${getTagClasses(tagsArray)} ${hasIllustratorTranslatorClass}`}
      key={!isStringEmpty(book.title) ? book.title : null}
    >
      {renderBookCoverImage(book.imageUrl)}
      {renderTitle(book.title)}
      {renderAuthor(book.author)}
      {renderIllustrator(book.illustrator)}
      {renderTranslator(book.translator)}
      {renderCatalogLinks(book.catalogUrl, book.ebookUrl)}
      {renderDescription(reviewsArray)}
      {renderTags(fullTagsArray, isJsEnabled)}
    </li>
  );
};

Book.propTypes = {
  pick: PropTypes.object,
  isJsEnabled: PropTypes.bool,
};

export default Book;
