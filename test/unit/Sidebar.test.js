/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Sidebar from '../../src/app/components/Sidebar/Sidebar';
import config from '../../appConfig';

const mockDisplayInfo = {
  displayDate: { month: 'Winter', year: '2018' },
  displayAge: 'Adult',
};

describe('Sidebar', () => {
  describe('Default component with JS turned on', () => {
    let component;

    before(() => {
      component = mount(
        <Sidebar
          isJsEnabled
          listOptions={config.staffPicksListOptions}
          displayInfo={mockDisplayInfo}
        />
      );
    });

    it('should be wrapped in .sidebar and .nypl-column-one-quarter classes', () => {
      const sidebarWrapper = component.find('div').at(0);
      expect(sidebarWrapper.hasClass('sidebar')).to.equal(true);
      expect(sidebarWrapper.hasClass('nypl-column-one-quarter')).to.equal(true);
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

    it('should render a <BookFilters /> component', () => {
      expect(component.find('BookFilters')).to.have.length(1);
    });
  });

  describe('Default component with JS turned off', () => {
    let component;

    before(() => {
      component = mount(
        <Sidebar
          isJsEnabled={false}
          listOptions={config.staffPicksListOptions}
          displayInfo={mockDisplayInfo}
        />);
    });

    it('should render .sidebar wrapper DOM', () => {
      const sidebarWrapper = component.find('div').at(0);
      expect(sidebarWrapper.hasClass('sidebar')).to.equal(true);
      expect(sidebarWrapper.hasClass('nypl-column-one-quarter')).to.equal(true);
    });

    it('should not render the <BookFilters /> component', () => {
      expect(component.find('BookFilters')).to.have.length(0);
    });
  });
});
