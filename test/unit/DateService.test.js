/* eslint-env mocha */
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DateService from '../../src/app/utils/DateService.js';

describe('When no date is passed', () => {
  it('should return the object that has empty month and year values.', () => {
    expect(DateService(undefined)).to.deep.equal({ month: '', year: '' });
  });
});

describe('When the passed year is earlier than 2016', () => {
  it('should return the correct month and year.', () => {
    expect(DateService('2015-04-01')).to.deep.equal({ month: 'April', year: 2015 });
  });
});

describe('When the passed year is later than 2016', () => {
  it('should return month value as the season with the correct year.', () => {
    expect(DateService('2016-06-01')).to.deep.equal({ month: 'Summer', year: 2016 });
  });
});