/* eslint-env mocha */
import { expect } from 'chai';

import ModelListOptionsService from '../../src/app/utils/ModelListOptionsService';

const mockStaffPicksListOptionsData = [
  { date: '2015-04-01' },
  { date: '2017-01-01' },
  { date: '2017-04-01' },
  { date: '2018-01-01' },
];

const mockAnnualListOptionsData = [
  { date: '2014' },
  { date: '2015' },
  { date: '2016' },
  { date: '2017' },
];

const mockModeledOptions = [
  { name: 'Winter 2018', value: '2018-01-01' },
  { name: 'Spring 2017', value: '2017-04-01' },
  { name: 'Winter 2017', value: '2017-01-01' },
  { name: 'April 2015', value: '2015-04-01' },
];

const mockModeledOptionsNotStaffPicks = [
  { name: '2017', value: '2017' },
  { name: '2016', value: '2016' },
  { name: '2015', value: '2015' },
  { name: '2014', value: '2014' },
];

describe('ModelListOptionsService', () => {
  describe('When there is no data', () => {
    it('should return the object, { options: [], latestOption: \'\' }', () => {
      expect(ModelListOptionsService(undefined, 'staff-picks')).to.deep.equal(
        { options: [], latestOption: '' }
      );
    });
  });

  describe('When the data is an empty array', () => {
    it('should return the object, { options: [], latestOption: \'\' }', () => {
      expect(ModelListOptionsService([], 'staff-picks')).to.deep.equal(
        { options: [], latestOption: '' },
      );
    });
  });

  describe('When the list type is not "staff-picks"', () => {
    it('should return the object with empty option names.', () => {
      expect(ModelListOptionsService(mockAnnualListOptionsData, 'teens')).to.deep.equal(
        { options: mockModeledOptionsNotStaffPicks, latestOption: '2017' },
      );
    });
  });

  describe('When there is valid data and the list type is "staff-picks"', () => {
    it('should return the modeled options and "latestOption" equals the first option value.', () => {
      expect(ModelListOptionsService(mockStaffPicksListOptionsData, 'staff-picks')).to.deep.equal(
        { options: mockModeledOptions, latestOption: '2018-01-01' });
    });
  });
});
