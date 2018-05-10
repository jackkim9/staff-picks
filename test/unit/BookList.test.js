/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import BookList from '../../src/app/components/BookList/BookList';
import About from '../../src/app/components/About/About';
import ListTitle from '../../src/app/components/ListTitle/ListTitle';

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

describe('BookList', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<BookList displayInfo={{}} picksCount={0} />);
    });

    it('should be wrapped in an .booklist-section and .nypl-column-three-quarters class', () => {
      expect(component.find('.booklist-section').length).to.equal(1);
      expect(component.find('.nypl-column-three-quarters').length).to.equal(1);
    });

    it('should render an <ListTitle> component', () => {
      expect(component.find(ListTitle).length).to.equal(1);
    });

    it('should not render an ul', () => {
      expect(component.find('ul').length).to.equal(0);
    });

    it('should render an <About> component', () => {
      expect(component.find(About).length).to.equal(1);
    });
  });

  describe('With staff picks data passed', () => {
    let component;
    const displayInfo = { displayDate: { month: 'Winter', year: 2017 }, displayAge: 'Adult' };

    before(() => {
      component = shallow(<BookList picks={picks} />);
    });

    it('should render the date and age selected for the list', () => {
      // Passes empty data
      component.setProps({ displayInfo: {}, picksCount: 0 });

      expect(component.find(ListTitle).node.props.displayInfo).to.deep.equal({});
      expect(component.find(ListTitle).node.props.picksCount).to.equal(0);

      // Passes valid data
      component.setProps({ displayInfo, picksCount: 3 });

      expect(component.find(ListTitle).node.props.displayInfo.displayDate).to.deep.equal(
        { month: 'Winter', year: 2017 }
      );
      expect(component.find(ListTitle).node.props.picksCount).to.equal(3);
    });

    it('should render an ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should render three <Book /> components', () => {
      expect(component.find('Book').length).to.equal(3);
    });
  });

  describe('With best books data passed', () => {
    let component;
    const displayInfo = { displayDate: { year: 2017 } };

    before(() => {
      component = shallow(<BookList picks={picks} />);
    });

    it('should render the date selected for the list', () => {
      // Passes empty data
      component.setProps({ displayInfo: {}, picksCount: 0 });

      expect(component.find(ListTitle).node.props.displayInfo).to.deep.equal({});
      expect(component.find(ListTitle).node.props.picksCount).to.equal(0);

      // Passes valid data
      component.setProps({ displayInfo, picksCount: 3 });

      expect(component.find(ListTitle).node.props.displayInfo.displayDate).to.deep.equal(
        { year: 2017 }
      );
      expect(component.find(ListTitle).node.props.picksCount).to.equal(3);
    });

    it('should render an ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should render three <Book /> components', () => {
      expect(component.find('Book').length).to.equal(3);
    });
  });
});
