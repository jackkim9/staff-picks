import React from 'react';
import PropTypes from 'prop-types';
import { EReaderIcon, BookIcon } from '@nypl/dgx-svg-icons';
import { isEmpty as _isEmpty, isString as _isString } from 'underscore';
import { Lazy } from 'react-lazy';

import config from '../../../../appConfig';
import utils from '../../utils/utils';

const Book = ({ pick, isJsEnabled, displayType }) => {
  const isStringEmpty = string => (!_isString(string) || _isEmpty(string.trim()));

  const getBookObject = obj => (obj.book || {});

  const getReviewsArray = obj => (obj.reviews || []);

  const getTagArray = picks => (picks.tags && picks.tags.length ? pick.tags : []);

  const getTagClasses = arrayOfTags => (!_isEmpty(arrayOfTags) ? arrayOfTags.join(' ') : '');

  if (_isEmpty(pick)) {
    return null;
  }

  const book = getBookObject(pick);
  const gaEvent = (type, listType) => {
    utils.trackPicks(`${config.niceLabelMap[listType]} Request`, `${type} - ${book.title}`);
  };

  const renderBookCoverImage = (imageUrl) => {
    const defaultImageUrl = `${config.baseUrl}/src/client/images/book-place-holder.png`;
    const fullImgSrc = isStringEmpty(imageUrl) ? defaultImageUrl : imageUrl;

    return (
      // Uses lazy load to load the images based on the view
      <Lazy component="div" className="book-item-image-box" cushion={2000} ltIE9>
        <img alt="" src={fullImgSrc} />
      </Lazy>
    );
  };

  const renderTitle = (title, slug) => (
    !isStringEmpty(title) ?
      (<h3 className="book-item-title" id={`book-${slug}`}>{title}</h3>) :
      null
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

  const renderCatalogLinks = (catalogUrl, ebookUrl, listType) => {
    const catalogLink = !isStringEmpty(catalogUrl) ? (
      <a
        href={catalogUrl}
        className="catalog-url"
        onClick={() => gaEvent('Book', listType)}
        aria-label={`Request Book: ${book.title}`}
      >
        <BookIcon width="32px" height="32px" ariaHidden />
        <span aria-label={`Request Book: ${book.title}`}>{config.requestUrlsText.catalog}</span>
      </a>) : null;

    const ebookLink = !isStringEmpty(ebookUrl) ? (
      <a
        href={ebookUrl}
        className="ebook-url"
        onClick={() => gaEvent('E-Book', listType)}
        aria-label={`Request E-Book: ${book.title}`}
      >
        <EReaderIcon ariaHidden />
        <span aria-label={`Request E-Book: ${book.title}`}>{config.requestUrlsText.ebook}</span>
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
          <p className="book-item-picked-by">Staff Pick by {reviewerName}{location}</p>
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
      tags.map((tag, i) => <li key={i}>{tag}{i !== (tags.length - 1) ? ',' : ''}</li>) : null;
    const hiddenClass = jsEnabled ? 'js' : 'no-js';
    const htmlHidden = jsEnabled;
    const tagsWrapperMarkup = <ul>{tagsMarkup}</ul>;

    return (tagsWrapperMarkup) ?
      (<div className={`book-item-tags ${hiddenClass}`} hidden={htmlHidden}>
        <span>Tags: </span>
          {tagsWrapperMarkup}
      </div>) : null;
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
      tabIndex="-1"
      id={pick.slug}
    >
      {renderBookCoverImage(book.imageUrl)}
      {renderTitle(book.title, pick.slug)}
      {renderAuthor(book.author)}
      {renderIllustrator(book.illustrator)}
      {renderTranslator(book.translator)}
      {renderCatalogLinks(book.catalogUrl, book.ebookUrl, displayType)}
      {renderDescription(reviewsArray)}
      {renderTags(fullTagsArray, isJsEnabled)}
    </li>
  );
};

Book.propTypes = {
  pick: PropTypes.object,
  isJsEnabled: PropTypes.bool,
  displayType: PropTypes.string,
};

export default Book;
