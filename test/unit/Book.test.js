/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Book from '../../src/app/components/Book/Book';

const pickObject = {
  tags: [
    'Offbeat',
    'Seriously good writing',
  ],
  ageGroup: 'Adult',
  reviews: [
    {
      reviewerName: 'Benjamin Sapadin',
      reviewerLocation: {
        prefLabel: 'Morris Park',
      },
      text: 'A fun, genre-bending read. An aging, competitive backgammon player is diagnosed with a ' +
        'life-threatening tumor and, upon it\'s removal, becomes convinced that he has psychic powers. ' +
        'The real star of this novel though is the game of backgammon, which I\'ve never had any ' +
        'interest in until I read this book. I still have no idea how to play the game, but Lethem makes it seem like a heck of a good time.',
    },
  ],
  book: {
    author: 'Jonathan Lethem',
    catalogUrl: 'http://browse.nypl.org/iii/encore/record/C__Rb21052853__Sa%20gambler%27s%20anatomy__Orightresult__U__X7?lang=eng&suite=def',
    ebookUrl: 'http://browse.nypl.org/iii/encore/record/C__Rb21109294__Sa%20gambler%27s%20anatomy__P0%2C2__Orightresult__U__X7?lang=eng&suite=def',
    imageUrl: 'http://imagesb.btol.com/ContentCafe/Jacket.aspx?UserID=ContentCafeClient&Password=Client&Return=T&Type=L&Value=9780385539906',
    isbn: '9780385539913',
    overdriveId: '2678726',
    title: 'A Gambler\'s Anatomy',
    illustrator: 'I am an illustrator',
    translator: 'I am a translator',
  },
  slug: '9780385539913-a-gamblers-anatomy',
};

describe('Book Component', () => {
  let component;

  describe('Default component without data', () => {
    it('should not render the Book component if the pick object prop is not defined', () => {
      component = shallow(<Book />);
      expect(component.find('.book-item').length).to.equal(0);
    });

    it('should not render the Book component if the pick object prop is empty', () => {
      component = shallow(<Book pick={{}} />);
    });
  });

  describe('Component with data and JavaScript enabled', () => {
    before(() => {
      component = shallow(<Book pick={pickObject} isJsEnabled />);
    });

    it('should render the pick list item with proper tag classes', () => {
      const pickListElement = component.find('.book-item');
      expect(pickListElement.length).to.equal(1);
      expect(pickListElement.find('li').length).to.equal(1);
      expect(pickListElement.hasClass('offbeat')).to.equal(true);
      expect(pickListElement.hasClass('seriously-good-writing')).to.equal(true);
      expect(pickListElement.prop('id')).to.equal('9780385539913-a-gamblers-anatomy');
      expect(pickListElement.prop('tabIndex')).to.equal('0');
    });

    it('should render the pick title <h3> element with text', () => {
      const title = component.find('.book-item-title');
      expect(title.length).to.equal(1);
      expect(title.find('h3').length).to.equal(1);
      expect(title.find('h3').text()).to.equal(pickObject.book.title);
    });

    it('should render the pick author <p> element with text', () => {
      const author = component.find('.book-item-author');
      expect(author.length).to.equal(1);
      expect(author.find('p').length).to.equal(1);
      expect(author.find('p').text()).to.equal(`By ${pickObject.book.author}`);
    });

    it('should render the pick image <img /> element with empty ALT text', () => {
      const imageBox = component.find('.book-item-image-box');
      const bookCoverImage = imageBox.find('img');

      expect(imageBox.length).to.equal(1);
      expect(bookCoverImage.length).to.equal(1);
      expect(bookCoverImage.prop('src')).to.equal(pickObject.book.imageUrl);
      expect(bookCoverImage.prop('alt')).to.equal('');
    });

    it('should render the pick description <p> element with text', () => {
      const description = component.find('.book-item-description');
      expect(description.length).to.equal(1);
      expect(description.text()).to.equal(pickObject.reviews[0].text);
    });

    it('should render the pick reviewer', () => {
      const reviewer = component.find('.book-item-picked-by');
      const reviewerText = `Staff Pick by ${pickObject.reviews[0].reviewerName}, ` +
        `${pickObject.reviews[0].reviewerLocation.prefLabel}`;

      expect(reviewer.length).to.equal(1);
      expect(reviewer.text()).to.equal(reviewerText);
    });

    it('should render the catalog link <a> tag element with proper href value', () => {
      const linksWrapper = component.find('.book-item-catalog-links');
      expect(linksWrapper.length).to.equal(1);
      expect(linksWrapper.find('.catalog-url').length).to.equal(1);
      expect(linksWrapper.find('.catalog-url').text()).to.contain('Request Book');
      expect(linksWrapper.find('.catalog-url').prop('href')).to.equal(pickObject.book.catalogUrl);
    });

    it('should render the ebook link <a> tag element with proper href value', () => {
      const linksWrapper = component.find('.book-item-catalog-links');
      expect(linksWrapper.length).to.equal(1);
      expect(linksWrapper.find('.ebook-url').length).to.equal(1);
      expect(linksWrapper.find('.ebook-url').text()).to.contain('Request E-Book');
      expect(linksWrapper.find('.ebook-url').prop('href')).to.equal(pickObject.book.ebookUrl);
    });

    it('should render the pick translator <p> element with text', () => {
      const text = component.find('.book-item-translator');
      expect(text.length).to.equal(1);
      expect(text.find('p').length).to.equal(1);
      expect(text.find('p').text()).to.equal(`Translated by ${pickObject.book.translator}`);
    });

    it('should render the pick illustrator <p> element with text', () => {
      const text = component.find('.book-item-illustrator');
      expect(text.length).to.equal(1);
      expect(text.find('p').length).to.equal(1);
      expect(text.find('p').text()).to.equal(`Illustrated by ${pickObject.book.illustrator}`);
    });

    it('should assign a .withTranslatorIllustrator class if both translator and illustrator exist', () => {
      const bookWrapper = component.find('.book-item');
      expect(bookWrapper.hasClass('withTranslatorIllustrator')).to.equal(true);
    });

    it('should render the pick tags in a <p> tag nested with <span> elements', () => {
      const tags = component.find('.book-item-tags');
      expect(tags.length).to.equal(1);
      expect(tags.find('span').length).to.equal(3);
      expect(tags.childAt(1).text()).to.equal('Offbeat, ');
      expect(tags.childAt(2).text()).to.equal('Seriously good writing');
    });

    it('should render the pick tags with a visuallyHidden class when JavaScript is enabled', () => {
      const tags = component.find('.book-item-tags');
      expect(tags.length).to.equal(1);
      expect(tags.hasClass('visuallyHidden')).to.equal(true);
    });
  });

  describe('Component with data and JavaScript disabled', () => {
    before(() => {
      component = shallow(<Book pick={pickObject} isJsEnabled={false} />);
    });

    it('should render the pick tags in a <p> tag and contain should not visuallyHidden class', () => {
      const tags = component.find('.book-item-tags');
      expect(tags.length).to.equal(1);
      expect(tags.hasClass('visuallyHidden')).to.equal(false);
    });
  });
});
