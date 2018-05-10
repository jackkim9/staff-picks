/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Main from '../../src/app/components/Application/Main';
import config from '../../appConfig';

const picks = [
  {
    book: {
      title: 'first book title',
    },
    tags: ['funny', 'horror'],
    ageGroup: 'Adult',
  },
  {
    book: {
      title: 'second book title',
    },
    tags: ['adventure', 'horror'],
    ageGroup: 'Adult',
  },
  {
    book: {
      title: 'third book title',
    },
    tags: ['graphic-novels', 'funny'],
    ageGroup: 'YA',
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
      expect(component.state('picks')).to.eql([]);
    });
  });

  describe('Methods', () => {
    describe('getNewPickSet', () => {
      let component;
      let getNewPickSet;

      before(() => {
        component = mount(
          <Main listOptions={config.staffPicksListOptions} currentAudience="Adult" />
        );
        getNewPickSet = component.instance().getNewPickSet;
      });

      it('should return an empty array with no params passed', () => {
        expect(getNewPickSet()).to.eql([]);
      });

      it('should return an empty array with no selected filters passed', () => {
        expect(getNewPickSet([])).to.eql([]);
      });

      it('should return the submitted picks with no selected filters passed', () => {
        expect(getNewPickSet(picks)).to.eql([picks[0], picks[1]]);
      });

      it('should return a subset of the picks passed, based on the one selected filter', () => {
        expect(getNewPickSet(picks, ['adventure'])).to.eql([
          {
            book: {
              title: 'second book title',
            },
            tags: ['adventure', 'horror'],
            ageGroup: 'Adult',
          },
        ]);
      });

      it('should return a subset of the picks passed, based on the selected filters', () => {
        expect(getNewPickSet(picks, selectedFilters)).to.eql([
          {
            book: {
              title: 'third book title',
            },
            tags: ['graphic-novels', 'funny'],
            ageGroup: 'YA',
          },
        ]);
      });
    });

    describe('getPicksInfo', () => {
      let component;
      let getPicksInfo;

      before(() => {
        component = mount(<Main />);
        getPicksInfo = component.instance().getPicksInfo;
      });

      it('should return an empty object with no params passed', () => {
        expect(getPicksInfo()).to.eql({});
      });

      it('should return a date object and default of Adult age', () => {
        expect(getPicksInfo({ date: '2018-01-01', type: 'staff-picks' })).to.eql({
          displayDate: { month: 'Winter', year: 2018 }, displayAge: 'Adult',
        });
      });

      it('should return a date object with updated age', () => {
        expect(getPicksInfo({ date: '2017-03-01', type: 'staff-picks' }, 'YA')).to.eql({
          displayDate: { month: 'Spring', year: 2017 }, displayAge: 'Young Adult',
        });
      });
    });

    describe('getCount', () => {
      let component;
      let getCount;

      before(() => {
        component = mount(<Main />);
        getCount = component.instance().getCount;
      });

      it('should return 0 with no picks in the state', () => {
        expect(getCount()).to.eql(0);
      });

      // it('should return the count of the picks in the state', () => {
      //   component.setState({ picks });
      //   expect(getCount()).to.equal(3);
      // });
    });

    describe('setSelectedFilter', () => {
      let component;
      let setSelectedFilter;

      before(() => {
        component = mount(
          <Main picksData={{ picks: [] }} listOptions={config.staffPicksListOptions} />
        );
        setSelectedFilter = component.instance().setSelectedFilter;
      });

      it('should not change the state if nothing was passed', () => {
        expect(component.state('selectedFilters')).to.eql([]);
        expect(component.state('picks')).to.eql([]);

        setSelectedFilter();

        expect(component.state('selectedFilters')).to.eql([]);
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

      it('should update the picks and selectableFilters in the state', () => {
        component = shallow(<Main picksData={{ picks }} currentAudience="Adult" />);
        setSelectedFilter = component.instance().setSelectedFilter;

        expect(component.state('picks')).to.eql(picks);
        expect(component.state('selectedFilters')).to.eql([]);

        setSelectedFilter('funny', true);

        expect(component.state('picks')).to.eql([picks[0], picks[2]]);
        expect(component.state('selectedFilters')).to.eql(['funny']);
      });
    });

    describe('clearFilters', () => {
      let component;
      let clearFilters;

      before(() => {
        component = shallow(<Main currentPicks={{ picks: [] }} />);
        clearFilters = component.instance().clearFilters;
      });

      after(() => {
        component.unmount();
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
        expect(component.state('picks')).to.eql([]);
      });
    });

    describe('filterByAudience', () => {
      const staffPicksData = {
        picks: [
          {
            ageGroup: 'Adult',
            book: {
              title: 'book 01',
            },
          },
          {
            ageGroup: 'Children',
            book: {
              title: 'book 01',
            },
          },
          {
            ageGroup: 'YA',
            book: {
              title: 'book 03',
            },
          },
        ],
        type: 'staff-picks',
      };
      const filterByAudience = sinon.spy(Main.prototype, 'filterByAudience');
      const component = shallow(
        <Main picksData={staffPicksData} currentAudience="YA" listType="staff-picks" />
      );

      after(() => {
        filterByAudience.restore();
        component.unmount();
      });

      it('should be called with the passed down picks, age group, and list tyep as the arguments.',
        () => {
          expect(filterByAudience.called).to.equal(true);
          expect(filterByAudience.getCall(0).args).to.deep.equal(
            [staffPicksData.picks, 'YA', 'staff-picks']
          );
        }
      );

      it('should return the original list if it is not a staff picks list.', () => {
        const returnedValue = staffPicksData.picks;

        expect(filterByAudience(staffPicksData.picks, 'YA', 'some-other-list')).to.deep.equal(
          returnedValue
        );
      });

      it('should return an empty array if the passed down list is empty.', () => {
        const returnedValue = [];

        expect(filterByAudience([], 'YA', 'staff-picks')).to.deep.equal(
          returnedValue
        );
      });

      it('should return an empty array if the passed down age group is not valid.', () => {
        const returnedValue = [];

        expect(filterByAudience(staffPicksData.picks, 'Toddler', 'staff-picks')).to.deep.equal(
          returnedValue
        );
      });

      it('should return a specific audience/age group based on the props.', () => {
        const returnedValue = [
          {
            ageGroup: 'YA',
            book: {
              title: 'book 03',
            },
          },
        ];

        expect(filterByAudience(staffPicksData.picks, 'YA', 'staff-picks')).to.deep.equal(
          returnedValue
        );
      });
    });
  });
});
