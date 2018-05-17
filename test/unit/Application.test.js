/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Application from '../../src/app/components/Application/Application';
import { Header } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import Hero from '../../src/app/components/Hero/Hero';
import config from '../../appConfig';

const location = {
  staffPicks: {
    pathname: `${config.baseUrl}/staff-picks`,
  },
  ya: {
    pathname: `${config.baseUrl}/ya`,
  },
  childrens: {
    pathname: `${config.baseUrl}/childrens`,
  },
  notValid: {
    pathname: `${config.baseUrl}/not-valid`,
  },
};

describe('Application', () => {
  describe('Not valid param', () => {
    let component;

    before(() => {
      // Not the best way to initialize this component:
      component = shallow(<Application location={location.notValid} children={[]} />);
    });

    it('should be wrapped in an .app-wrapper class', () => {
      expect(component.find('.app-wrapper').length).to.equal(1);
    });

    it('should render a <Header> component', () => {
      expect(component.find(Header).length).to.equal(1);
    });

    it('should render a <Footer> component', () => {
      expect(component.find(Footer).length).to.equal(1);
    });

    it('should not render a <Hero> component', () => {
      expect(component.find(Hero).length).to.equal(0);
    });

    it('should render a div with id `app-content` for the skip navigation', () => {
      expect(component.find('#app-content').length).to.equal(1);
    });

    it('should have empty values for the state', () => {
      expect(component.state('filters')).to.eql([]);
      expect(component.state('selectableFilters')).to.eql([]);
      expect(component.state('picksData')).to.eql({});
      // Since the component did not mount yet:
      expect(component.state('isJsEnabled')).to.eql(false);
    });
  });

  describe('Staff-Picks param', () => {
    let component;

    before(() => {
      // Not the best way to initialize this component:
      component = shallow(<Application location={location.staffPicks} children={[]} />);
    });

    it('should be wrapped in an .app-wrapper class', () => {
      expect(component.find('.app-wrapper').length).to.equal(1);
    });

    it('should render a <Header> component', () => {
      expect(component.find(Header).length).to.equal(1);
    });

    it('should render a <Footer> component', () => {
      expect(component.find(Footer).length).to.equal(1);
    });

    it('should render a <Hero> component', () => {
      expect(component.find(Hero).length).to.equal(1);
      expect(component.find(Hero).node.props.heroData.header).to.equal('Staff Picks');
    });

    it('should render a div with id `app-content` for the skip navigation', () => {
      expect(component.find('#app-content').length).to.equal(1);
    });

    it('should have empty values for the state', () => {
      expect(component.state('filters')).to.eql([]);
      expect(component.state('selectableFilters')).to.eql([]);
      expect(component.state('picksData')).to.eql({});
      // Since the component did not mount yet:
      expect(component.state('isJsEnabled')).to.eql(false);
    });
  });

  describe('YA param', () => {
    let component;

    before(() => {
      // Not the best way to initialize this component:
      component = shallow(<Application location={location.ya} children={[]} />);
    });

    it('should be wrapped in an .app-wrapper class', () => {
      expect(component.find('.app-wrapper').length).to.equal(1);
    });

    it('should render a <Header> component', () => {
      expect(component.find(Header).length).to.equal(1);
    });

    it('should render a <Footer> component', () => {
      expect(component.find(Footer).length).to.equal(1);
    });

    it('should render a <Hero> component', () => {
      expect(component.find(Hero).length).to.equal(1);
      expect(component.find(Hero).node.props.heroData.header).to.equal('Best Books for Teens');
    });

    it('should render a div with id `app-content` for the skip navigation', () => {
      expect(component.find('#app-content').length).to.equal(1);
    });

    it('should have empty values for the state', () => {
      expect(component.state('filters')).to.eql([]);
      expect(component.state('selectableFilters')).to.eql([]);
      expect(component.state('picksData')).to.eql({});
      // Since the component did not mount yet:
      expect(component.state('isJsEnabled')).to.eql(false);
    });
  });
});
