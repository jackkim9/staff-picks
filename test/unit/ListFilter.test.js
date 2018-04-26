/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ListFilter from '../../src/app/components/ListSelector/ListFilter';

const fieldsetProps = {
  fieldsetName: 'season',
  currentValue: '',
  options: [
    { name: '2018 Winter', value: '2018-01-01' },
    { name: '2017 Fall', value: '2017-09-01' },
    { name: '2017 Summer', value: '2017-06-01' },
    { name: '2017 Spring', value: '2017-04-01' },
  ],
};

const fieldsetPropsWithCurrentValue = {
  fieldsetName: 'season',
  currentValue: '2017-04-01',
  options: [
    { name: '2018 Winter', value: '2018-01-01' },
    { name: '2017 Fall', value: '2017-09-01' },
    { name: '2017 Summer', value: '2017-06-01' },
    { name: '2017 Spring', value: '2017-04-01' },
  ],
};

describe('ListFilter', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<ListFilter fieldsetProps={fieldsetProps} />);
    });

    after(() => {
      component.unmount();
    });

    it('should render a fieldset, and inside the fieldset, it should render <label> and <select>.',
      () => {
        expect(component.find('fieldset').length).to.equal(1);
        expect(component.find('label').length).to.equal(1);
        expect(component.find('select').length).to.equal(1);
      }
    );

    it('should render the <option>. The number of the option equals to the length of the data has.',
      () => {
        expect(component.find('option').length).to.equal(4);
      }
    );
  });

  describe('Dropdown menu\'s default value', () => {
    let component;

    afterEach(() => {
      component.unmount();
    });

    it('should be the first option\'s value, if no currentValue in props passed down.', () => {
      component = shallow(<ListFilter fieldsetProps={fieldsetProps} />);

      expect(component.find('select').nodes[0].props.defaultValue).to.equal('2018-01-01');
    });

    it('should be assigned with the props\'s currentValue, if the value exists.', () => {
      component = shallow(<ListFilter fieldsetProps={fieldsetPropsWithCurrentValue} />);

      expect(component.find('select').nodes[0].props.defaultValue).to.equal('2017-04-01');
    });
  });
});
