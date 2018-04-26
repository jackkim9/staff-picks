/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Link } from 'react-router';
import { stub } from 'sinon';

import BookPage from '../../src/app/components/BookPage/BookPage';
import Book from '../../src/app/components/Book/Book';
import appConfig from '../../appConfig';
import Actions from '../../src/app/actions/BookActions';

const params = {
  id: '9780062422644-allegedly',
  isJsEnabled: true,
};

const currentPicks = {
  date: '2018-01-01',
  picks: [
    {
      tags: [
        'Biographies & memoirs',
        'Culturally diverse',
        'Historical',
        'Middle grade',
        'True stories',
      ],
      reviews: [
        {
          text: 'A fun, fast read that gives deeper insight into the background and motivation of the groundbreaking icon.',
          reviewerName: 'Best Books for Kids Committee',
          reviewerLocation: {
            prefLabel: 'NYPL',
          },
        },
      ],
      book: {
        author: 'Doreen Rappaport',
        catalogUrl: 'https://browse.nypl.org/iii/encore/record/C__Rb21308428__S42%20Is%20Not%20Just%20a%20Number%3A%20The%20Odyssey%20of%20Jackie%20Robinson%2C%20American%20Hero__Orightresult__U__X4?lang=eng&suite=def',
        imageUrl: 'https://images.btol.com/ContentCafe/Jacket.aspx?UserID=ContentCafeClient&Password=Client&Return=T&Type=L&Value=9780763676247',
        title: '42 Is Not Just a Number: The Odyssey of Jackie Robinson, American Hero',
        isbn: '9780763676247',
      },
      slug: '9780763676247-42-is-not-just-a-number-the-odyssey-of-jackie-robinson-american-hero',
      ageGroup: 'Children',
    },
    {
      tags: [
        'Drama',
        'NYC stories',
        'On the dark side',
        'Realistic',
      ],
      reviews: [
        {
          text: 'When she was seven, Mary murdered a baby. Allegedly. Now 15 and pregnant, she has to prove her innocence to get out of a detention center. What really happened that night?',
          reviewerName: 'Best Books for Teens Committee',
          reviewerLocation: {
            prefLabel: 'NYPL',
          },
        },
      ],
      book: {
        author: 'Tiffany D. Jackson',
        catalogUrl: 'https://browse.nypl.org/iii/encore/record/C__Rb21129588__Sallegedly%20jackson__Orightresult__U__X2?lang=eng&suite=def',
        imageUrl: 'https://images.btol.com/ContentCafe/Jacket.aspx?UserID=ContentCafeClient&Password=Client&Return=T&Type=L&Value=9780062422644',
        title: 'Allegedly',
        ebookUrl: 'https://browse.nypl.org/iii/encore/record/C__Rb21255489__Sallegedly%20jackson__P0%2C1__Orightresult__U__X2?lang=eng&suite=def',
        isbn: '9780062422644',
        overdriveId: '2697826',
      },
      slug: '9780062422644-allegedly',
      ageGroup: 'YA',
    },
  ],
  slug: 'staff-picks/2018-01-01',
  title: '2018 Winter Staff Picks',
  type: 'staff-picks',
};

const contextObject = { context: { router: { push: stub(), createHref: stub() } } };

describe('BookPage Component', () => {
  let component;
  Actions.updateCurrentAudience = stub();

  describe('Default component without data', () => {
    it('should not render the Book component if the pick object prop is not defined', () => {
      component = mount(<BookPage />, contextObject);
      expect(component.find('.book-item').length).to.equal(0);
    });
  });

  describe('Component with data and JavaScript enabled', () => {
    before(() => {
      component = mount(<BookPage params={params} />, contextObject);
      component.setState({ currentPicks });
    });

    it('should render the top level grid', () => {
      expect(component.hasClass('nypl-row')).to.equal(true);
      expect(component.hasClass('book-page')).to.equal(true);
    });

    it('should render a left sidebar', () => {
      const sidebar = component.find('.sidebar');

      expect(sidebar.length).to.equal(1);
    });

    it('should render a nav with a link', () => {
      const nav = component.find('nav');
      const link = component.find(Link);

      expect(nav.length).to.equal(1);
      expect(link.length).to.equal(1);
      expect(link.prop('to')).to.equal(`${appConfig.baseUrl}staff-picks/2018-01-01`);
      expect(link.text()).to.equal('NYPL Left Wedge SVG IconReturn to Staff Picks');
    });

    it('should render the book list section with a header', () => {
      const bookList = component.find('.booklist-section');
      const heading = bookList.find('h2');

      expect(bookList.length).to.equal(1);
      expect(heading.text()).to.equal('Winter 2018 Picks for Young Adult');
    });

    it('should render a Book component', () => {
      const book = component.find(Book);

      expect(book.length).to.equal(1);
    });
  });
});
