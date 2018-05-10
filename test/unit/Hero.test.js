/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Hero from '../../src/app/components/Hero/Hero';
import config from '../../appConfig.js';

describe('Hero', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<Hero heroData={{}} />);
    });

    after(() => {
      component.unmount();
    });

    it('should be wrapped in an .hero class', () => {
      expect(component.find('.hero').length).to.equal(1);
    });
  });

  describe('The list displayType is "teens"', () => {
    let component;
    const teensHeroData = config.heroData.ya;

    before(() => {
      component = shallow(<Hero heroData={teensHeroData} />);
    });

    after(() => {
      component.unmount();
    });

    it('should has the correct title and description.', () => {
      expect(component.find('h1').text()).to.equal('Best Books for Teens');
      expect(component.find('p.hero-content-description').text()).to.equal(
        'Explore our annual selection of outstanding young adult titles.'
      );
    });

    it('should not has the section title.', () => {
      expect(component.find('p.hero-section-title').length).to.equal(0);
    });

    it('should has the correct image link.', () => {
      expect(component.find('img').node.props.src).to.equal(
        'src/client/images/desktop.teens.cover.2017.png'
      );
    });
  });

  describe('The list displayType is "kids"', () => {
    let component;
    const kidsHeroData = config.heroData.childrens;

    before(() => {
      component = shallow(<Hero heroData={kidsHeroData} />);
    });

    after(() => {
      component.unmount();
    });

    it('should has the correct title and description.', () => {
      expect(component.find('h1').text()).to.equal('Best Books for Kids');
      expect(component.find('p.hero-content-description').text()).to.equal(
        'Explore our annual selection of outstanding children\'s titles.'
      );
    });

    it('should not has the section title.', () => {
      expect(component.find('p.hero-section-title').length).to.equal(0);
    });

    it('should has the correct image link.', () => {
      expect(component.find('img').node.props.src).to.equal(
        'src/client/images/desktop.kids.cover.2017.png'
      );
    });
  });

  describe('The list displayType is "staff-picks"', () => {
    let component;
    const staffPicksHeroData = config.heroData.staffPicks;

    before(() => {
      component = shallow(<Hero heroData={staffPicksHeroData} />);
    });

    after(() => {
      component.unmount();
    });

    it('should has the correct title and description.', () => {
      expect(component.find('h1').text()).to.equal('Staff Picks');
      expect(component.find('p.hero-content-description').text()).to.equal(
        'Nobody loves books more than our experts. Browse and filter hundreds of their favorites.'
      );
    });

    it('should has the correct section title.', () => {
      expect(component.find('p.hero-section-title').length).to.equal(1);
      expect(component.find('p.hero-section-title').text()).to.equal('BOOKS/MUSIC/MOVIES');
    });

    it('should has the correct style for backgeround and texts.', () => {
      expect(component.find('div.hero').node.props.className).to.equal('hero staff-picks-hero');
    });

    it('should not render the image.', () => {
      expect(component.find('img').length).to.equal(0);
    });
  });
});
