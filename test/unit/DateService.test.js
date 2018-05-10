/* eslint-env mocha */
import { expect } from 'chai';

import { staffPicksDate, annualDate } from '../../src/app/utils/DateService';

describe('DateService', () => {
  describe('Staff picks dates (month, year)', () => {
    describe('When no date is passed', () => {
      it('should return the object that has empty month and year values.', () => {
        expect(staffPicksDate(undefined)).to.deep.equal({ month: '', year: '' });
      });
    });

    describe('When the passed year is earlier than 2016', () => {
      it('should return the correct month and year.', () => {
        expect(staffPicksDate('2015-04-01')).to.deep.equal({ month: 'April', year: 2015 });
      });
    });

    describe('When the passed year is later than 2016', () => {
      it('should return month value as the season with the correct year.', () => {
        expect(staffPicksDate('2016-06-01')).to.deep.equal({ month: 'Summer', year: 2016 });
      });
    });
  });

  describe('Best books dates (year)', () => {
    describe('When no date is passed', () => {
      it('should return the object that has empty month and year values.', () => {
        expect(annualDate(undefined)).to.deep.equal({ year: '' });
      });
    });

    describe('When the passed year is earlier than 2014', () => {
      it('should return the correct month and year.', () => {
        expect(annualDate('2013')).to.deep.equal({ year: 2013 });
      });
    });

    describe('When the passed year is later than 2014', () => {
      it('should return month value as the season with the correct year.', () => {
        expect(annualDate('2015')).to.deep.equal({ year: 2015 });
      });
    });

    describe('When passed a year and month', () => {
      it('should return year only.', () => {
        expect(annualDate('2015-01')).to.deep.equal({ year: 2015 });
      });
    });
  });
});
