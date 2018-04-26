/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import About from '../../src/app/components/About/About';

describe('About', () => {
  let component;

  before(() => {
    component = shallow(<About />);
  });

  it('should be wrapped in div and .about and .nypl-row classes', () => {
    const divWrapper = component.find('div').at(0);
    expect(divWrapper.length).to.equal(1);
    expect(divWrapper.hasClass('about')).to.equal(true);
    expect(divWrapper.hasClass('nypl-row')).to.equal(true);
  });

  it('should have four links', () => {
    expect(component.find('a').length).to.equal(4);
  });

  it('should have one link to the accessible print editions of the titles', () => {
    const printDisabilityLink = component.find('a').at(0);
    expect(printDisabilityLink.text()).to.equal('patrons with print disabilities.');
    expect(printDisabilityLink.prop('href'))
      .to.equal('https://www.nypl.org/accessibility/print-disabilities');
  });

  it('should have one link to the about page', () => {
    const aboutLink = component.find('a').at(1);
    expect(aboutLink.text()).to.equal('About Best Books');
    expect(aboutLink.prop('href'))
      .to.equal('https://www.nypl.org/books-music-movies/recommendations/about/annual-lists');
  });

  it('should have two social media list items', () => {
    const socialMediaList = component.find('ul');
    expect(socialMediaList.length).to.equal(1);
  });
});
