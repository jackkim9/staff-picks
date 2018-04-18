/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Main from '../../src/app/components/Application/Main';

const picks = [
  {
    title: 'first book title',
    tags: ['funny', 'horror'],
  },
  {
    title: 'second book title',
    tags: ['adventure', 'horror'],
  },
  {
    title: 'third book title',
    tags: ['graphic-novels', 'funny'],
  },
];
const selectedFilters = ['funny', 'graphic-novels'];

describe('Main', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<Main />);
    });

    it('should be wrapped in an .nypl-row class', () => {
      expect(component.find('.nypl-row').length).to.equal(1);
    });

    it('should render a <Sidebar> component', () => {
      expect(component.find('Sidebar').length).to.equal(1);
    });

    it('should render a <BookList> component', () => {
      expect(component.find('BookList').length).to.equal(1);
    });

    it('should have a state of empty default values', () => {
      expect(component.state('selectedFilters')).to.eql([]);
      expect(component.state('selectableFilters')).to.eql([]);
      expect(component.state('picks')).to.eql([]);
    });
  });

  describe('Methods', () => {
    describe('getNewPickSet', () => {
      let component;
      let getNewPickSet;

      before(() => {
        component = mount(<Main />);
        getNewPickSet = component.instance().getNewPickSet;
      });

      it('should return an empty array with no params passed', () => {
        expect(getNewPickSet()).to.eql([]);
      });

      it('should return an empty array with no selected filters passed', () => {
        expect(getNewPickSet([])).to.eql([]);
      });

      it('should return the submitted picks with no selected filters passed', () => {
        expect(getNewPickSet(picks)).to.eql(picks);
      });

      it('should return a subset of the picks passed, based on the one selected filter', () => {
        expect(getNewPickSet(picks, ['adventure'])).to.eql([
          {
            title: 'second book title',
            tags: ['adventure', 'horror'],
          },
        ]);
      });

      it('should return a subset of the picks passed, based on the selected filters', () => {
        expect(getNewPickSet(picks, selectedFilters)).to.eql([
          {
            title: 'third book title',
            tags: ['graphic-novels', 'funny'],
          },
        ]);
      });
    });

    describe('setSelectedFilter', () => {
      let component;
      let setSelectedFilter;

      before(() => {
        component = mount(<Main currentPicks={{ picks: [] }} />);
        setSelectedFilter = component.instance().setSelectedFilter;
      });

      it('should not change the state if nothing was passed', () => {
        expect(component.state('selectedFilters')).to.eql([]);
        expect(component.state('selectableFilters')).to.eql([]);
        expect(component.state('picks')).to.eql([]);

        setSelectedFilter();

        expect(component.state('selectedFilters')).to.eql([]);
        expect(component.state('selectableFilters')).to.eql([]);
        expect(component.state('picks')).to.eql([]);
      });

      it('should add the selected filters if the filter Id passed is inactive', () => {
        expect(component.state('selectedFilters')).to.eql([]);

        setSelectedFilter('funny', true);
        expect(component.state('selectedFilters')).to.eql(['funny']);

        setSelectedFilter('adventure', true);
        expect(component.state('selectedFilters')).to.eql(['funny', 'adventure']);
      });

      it('should remove the selected filters if the filter Id passed is inactive', () => {
        expect(component.state('selectedFilters')).to.eql(['funny', 'adventure']);

        setSelectedFilter('funny', false);
        expect(component.state('selectedFilters')).to.eql(['adventure']);

        setSelectedFilter('adventure', false);
        expect(component.state('selectedFilters')).to.eql([]);
      });

      // it('should update the picks and selectableFilters in the state', () => {
      //   component = shallow(<Main currentPicks={{ picks }} />);
      //
      //   expect(component.state('picks')).to.eql(picks);
      //   expect(component.state('selectableFilters')).to.eql([]);
      //   expect(component.state('selectedFilters')).to.eql([]);
      //
      //   setSelectedFilter('funny', true);
      //   component.update();
      //
      //   expect(component.state('picks')).to.eql(picks);
      //   expect(component.state('selectableFilters'))
      //     .to.eql(['funny', 'horror', 'graphic-novels']);
      //   expect(component.state('selectedFilters')).to.eql(['funny']);
      // });
    });

    describe('clearFilters', () => {
      let component;
      let clearFilters;

      before(() => {
        component = shallow(<Main currentPicks={{ picks: [] }} />);
        clearFilters = component.instance().clearFilters;
      });

      it('should clear the state', () => {
        component.setState({
          picks,
          selectedFilters,
          selectableFilters: ['funny', 'graphic-novels'],
        });

        expect(component.state('selectedFilters')).to.eql(selectedFilters);
        expect(component.state('picks')).to.eql(picks);

        clearFilters();

        expect(component.state('selectedFilters')).to.eql([]);
        expect(component.state('selectableFilters')).to.eql([]);
        expect(component.state('picks')).to.eql([]);
      });
    });

    describe('extractAudienceGroup', () => {
      it('should return specific audience/age group based on the props', () => {});
    });
  });
});
