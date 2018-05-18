/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import TopHeading from '../../src/app/components/TopHeading/TopHeading';
import ListTitle from '../../src/app/components/ListTitle/ListTitle';

describe('TopHeading', () => {
  describe('Default rendering', () => {
    let component;

    before(() => {
      component = mount(<TopHeading />);
    });

    it('should be wrapped in .top-headings and .nypl-row classes', () => {
      const sidebarWrapper = component.find('div').at(0);
      expect(sidebarWrapper.hasClass('top-headings')).to.equal(true);
      expect(sidebarWrapper.hasClass('nypl-row')).to.equal(true);
    });

    it('should render a breadcrumb link', () => {
      const breadcrumbLink = component.find('a').at(0);
      expect(breadcrumbLink).to.have.length(1);
      // The first part of the "text" is the hidden SVG title which is not hidden in the tests.
      expect(breadcrumbLink.text())
        .to.equal('NYPL Left Wedge SVG IconRecommendations');
      expect(breadcrumbLink.prop('href'))
        .to.equal('https://www.nypl.org/books-music-movies/recommendations');
    });

    it('should render a ListTitle component', () => {
      const listTitle = component.find(ListTitle);

      expect(listTitle.length).to.equal(1);
    });
  });
});
