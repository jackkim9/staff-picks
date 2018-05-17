/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import BookFilters from '../../src/app/components/BookFilters/BookFilters';

const filtersArray = ['Funny', 'Offbeat', 'Middle Grade', 'Graphic Novels'];
const selectableFilters = ['funny', 'graphic-novels'];
const selectedFilters = ['funny', 'adventure', 'offbeat'];

describe('BookFilters', () => {
  describe('Default component', () => {
    let component;

    before(() => {
      component = mount(<BookFilters />);
    });

    it('should not render if there is no filter prop', () => {
      expect(component.find('.book-filters').length).to.equal(0);
    });
  });

  describe('With just filters prop data', () => {
    let component;

    before(() => {
      component = mount(<BookFilters filters={filtersArray} />);
    });

    it('should have a .book-filters wrapper', () => {
      const bookFiltersWrapper = component.find('div').at(0);
      expect(bookFiltersWrapper.hasClass('book-filters')).to.equal(true);
    });

    it('should render a heading and an h3 inside of it', () => {
      const heading = component.find('.book-filters-container');
      expect(heading.length).to.equal(1);
      expect(heading.find('h3').length).to.equal(1);
      expect(heading.find('h3').text()).to.equal('NYPL Filter SVG Icon Filter by Tags');
    });

    it('should render a `ul`', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should map the filters data', () => {
      expect(component.state('filters')).to.eql([
        { id: 'funny', label: 'Funny' },
        { id: 'offbeat', label: 'Offbeat' },
        { id: 'middle-grade', label: 'Middle Grade' },
        { id: 'graphic-novels', label: 'Graphic Novels' },
      ]);
    });

    it('should render the filters passed in as list items', () => {
      const filterListItem = component.find('li');

      expect(filterListItem.length).to.equal(4);
      expect(filterListItem.at(0).text()).to.equal('Funny');
      expect(filterListItem.at(1).text()).to.equal('Offbeat');
      expect(filterListItem.at(2).text()).to.equal('Middle Grade');
      expect(filterListItem.at(3).text()).to.equal('Graphic Novels');
    });

    it('should not render the `clear filters` button', () => {
      expect(component.find('.clear-button').length).to.equal(0);
    });
  });

  describe('Updating the rendered filters based on the selectableFilters prop', () => {
    let component;

    before(() => {
      component = mount(
        <BookFilters filters={filtersArray} selectableFilters={selectableFilters} />
      );
    });

    it('should update the state and the filters rendered', () => {
      const filterListItem = component.find('li');

      expect(filterListItem.length).to.equal(2);
      expect(filterListItem.at(0).text()).to.equal('Funny');
      expect(filterListItem.at(1).text()).to.equal('Graphic Novels');
      // The state should still stay the same, but the list of actual filters to render reduces.
      expect(component.state('filters')).to.eql([
        { id: 'funny', label: 'Funny' },
        { id: 'offbeat', label: 'Offbeat' },
        { id: 'middle-grade', label: 'Middle Grade' },
        { id: 'graphic-novels', label: 'Graphic Novels' },
      ]);
    });
  });

  describe('Clicking on the clear filters button', () => {
    let component;
    let clearFiltersFnCall = false;
    const clearFiltersFn = () => {
      clearFiltersFnCall = true;
    };

    before(() => {
      component = mount(
        <BookFilters
          filters={filtersArray}
          selectableFilters={selectableFilters}
          clearFilters={clearFiltersFn}
          selectedFilters={selectedFilters}
        />
      );
    });

    it('should render a clear filters button', () => {
      expect(component.find('.clear-button').length).to.equal(1);
    });

    it('should remove all active ids from the state', () => {
      component.find('.clear-button').simulate('click');

      expect(clearFiltersFnCall).to.eql(true);
    });
  });

  describe('Updated the state when props are passed', () => {
    let component;

    before(() => {
      component = mount(
        <BookFilters
          filters={filtersArray}
          selectableFilters={selectableFilters}
          selectedFilters={selectedFilters}
        />
      );
    });

    it('should return the filters passed since the selectableFilters array is empty', () => {
      expect(component.state('selectedFilters')).to.eql(selectedFilters);

      component.setProps({ selectedFilters: [] });

      expect(component.state('selectedFilters')).to.eql([]);
    });
  });

  describe('Methods', () => {
    describe('getFilterArray', () => {
      const filters = [
        { id: 'funny', label: 'Funny' },
        { id: 'offbeat', label: 'Offbeat' },
        { id: 'middle-grade', label: 'Middle Grade' },
        { id: 'graphic-novels', label: 'Graphic Novels' },
      ];
      let component;
      let getFilterArray;

      before(() => {
        component = mount(
          <BookFilters filters={filtersArray} selectableFilters={selectableFilters} />
        );
        getFilterArray = component.instance().getFilterArray;
      });

      it('should return the filters passed since the selectableFilters array is empty', () => {
        expect(getFilterArray([], filters)).to.eql(filters);
      });

      it('should return an array with only the values from the selectableFilters array', () => {
        expect(getFilterArray(['funny', 'middle-grade'], filters))
          .to.eql([
            { id: 'funny', label: 'Funny' },
            { id: 'middle-grade', label: 'Middle Grade' },
          ]);
      });
    });

    describe('onClick', () => {
      let component;
      let onClick;
      let globalFilterId;
      let globalActive;
      const setSelectedFilterFn = (filterId, active) => {
        globalFilterId = filterId;
        globalActive = active;
      };

      before(() => {
        component = mount(
          <BookFilters
            filters={filtersArray}
            selectableFilters={selectableFilters}
            setSelectedFilter={setSelectedFilterFn}
            selectedFilters={selectedFilters}
          />
        );
        onClick = component.instance().onClick;
      });

      afterEach(() => {
        globalActive = undefined;
        globalFilterId = undefined;

        component.setState({ focusId: '' });
      });

      it('should update the focusId state if it selected', () => {
        expect(component.state('focusId')).to.eql('');

        onClick('adventure', true);

        expect(component.state('focusId')).to.eql('adventure');
      });

      it('should update the focusId state if it unselected', () => {
        expect(component.state('focusId')).to.eql('');

        onClick('adventure', false);

        expect(component.state('focusId')).to.eql('adventure');
      });

      it('should call the `setSelectedFilter` prop function', () => {
        expect(globalFilterId).to.equal(undefined);
        expect(globalActive).to.equal(undefined);

        onClick('historic', true);

        expect(globalFilterId).to.equal('historic');
        expect(globalActive).to.equal(true);
      });
    });
  });
});
