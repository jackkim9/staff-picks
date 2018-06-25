/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import About from '../../src/app/components/About/About';

describe('About', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<About />);
    });

    after(() => {
      component.unmount();
    });

    it('should be wrapped in div and .about and .nypl-row classes', () => {
      const divWrapper = component.find('div').at(0);

      expect(divWrapper.length).to.equal(1);
      expect(divWrapper.hasClass('about')).to.equal(true);
      expect(divWrapper.hasClass('nypl-row')).to.equal(true);
    });

    it('should have three links', () => {
      expect(component.find('a').length).to.equal(3);
    });

    it('should have one link to the accessible print editions of the titles', () => {
      const printDisabilityLink = component.find('a').at(0);

      expect(printDisabilityLink.text()).to.equal('Learn more about library materials and services for patrons with print disabilities');
      expect(printDisabilityLink.prop('href'))
        .to.equal('https://www.nypl.org/accessibility/print-disabilities');
    });

    it('should have two social media list items', () => {
      const socialMediaList = component.find('ul');

      expect(socialMediaList.length).to.equal(1);
      expect(socialMediaList.find('li').length).to.equal(2);
    });
  });

  describe('The list displayType is "teens"', () => {
    let component;

    before(() => {
      component = shallow(<About displayType="teens" />);
    });

    after(() => {
      component.unmount();
    });

    it('should render the link of "About Best Books".', () => {
      const aboutLink = component.find('a.about-best-books-link');

      // With "About Best Books" link now we should have 4 anchor links
      expect(component.find('a').length).to.equal(4);
      expect(aboutLink).to.have.length(1);
      expect(aboutLink.text()).to.equal('About Best Books');
      expect(aboutLink.prop('href'))
        .to.equal('https://www.nypl.org/books-music-movies/recommendations/about/annual-lists');
    });
  });

  describe('The list displayType is "kids"', () => {
    let component;

    before(() => {
      component = shallow(<About displayType="kids" />);
    });

    after(() => {
      component.unmount();
    });

    it('should render the link of "About Best Books".', () => {
      const aboutLink = component.find('a.about-best-books-link');

      // With "About Best Books" link now we should have 4 anchor links
      expect(component.find('a').length).to.equal(4);
      expect(aboutLink).to.have.length(1);
      expect(aboutLink.text()).to.equal('About Best Books');
      expect(aboutLink.prop('href'))
        .to.equal('https://www.nypl.org/books-music-movies/recommendations/about/annual-lists');
    });
  });

  describe('The list displayType is "staff-picks"', () => {
    let component;

    before(() => {
      component = shallow(<About displayType="staff-picks" />);
    });

    after(() => {
      component.unmount();
    });

    it('should not render the link of "About Best Books".', () => {
      const aboutLink = component.find('a.about-best-books-link');

      // Without "About Best Books" link now we should have 3 anchor links
      expect(component.find('a').length).to.equal(3);
      expect(aboutLink).to.have.length(0);
    });
  });

  describe('Twitter Link', () => {
    let component;
    let twitterLink;
    let gaSocialMediaEvent;

    before(() => {
      // As we are wrapping spy to the prototype function, it has to come before component mounting
      gaSocialMediaEvent = sinon.spy(About.prototype, 'gaSocialMediaEvent');
      component = shallow(<About displayType="staff-picks" />);
      twitterLink = component.find('a.twitter-link');
    });

    after(() => {
      component.unmount();
      gaSocialMediaEvent.restore();
    });

    it('should call the function "gaSocialMediaEvent" after the twitter link is clicked', () => {
      twitterLink.simulate('click');

      expect(gaSocialMediaEvent.callCount).to.equal(1);
      expect(gaSocialMediaEvent.calledWith('staff-picks', 'Twitter')).to.equal(true);
    });
  });

  describe('Facebook Link', () => {
    let component;
    let facebookLink;
    let gaSocialMediaEvent;

    before(() => {
      // As we are wrapping spy to the prototype function, it has to come before component mounting
      gaSocialMediaEvent = sinon.spy(About.prototype, 'gaSocialMediaEvent');
      component = shallow(<About displayType="staff-picks" />);
      facebookLink = component.find('a.facebook-link');
    });

    after(() => {
      component.unmount();
      gaSocialMediaEvent.restore();
    });

    it('should call the function "gaSocialMediaEvent" after the twitter link is clicked', () => {
      facebookLink.simulate('click');

      expect(gaSocialMediaEvent.callCount).to.equal(1);
      expect(gaSocialMediaEvent.calledWith('staff-picks', 'Facebook')).to.equal(true);
    });
  });
});
