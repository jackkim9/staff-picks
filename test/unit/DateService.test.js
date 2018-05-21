/* eslint-env mocha */
import { expect } from 'chai';

import {
  staffPicksDate,
  annualDate,
  monthOrSeason,
  matchListDate,
} from '../../src/app/utils/DateService';

describe('DateService', () => {
  describe('staffPicksDates(month, year)', () => {
    describe('When no date is passed', () => {
      it('should return the object that has empty month and year values.', () => {
        expect(staffPicksDate(undefined)).to.deep.equal({ month: '', year: '' });
      });
    });

    describe('When the passed year is earlier than 2016', () => {
      it('should return the correct month and year.', () => {
        expect(staffPicksDate('2015-04')).to.deep.equal({ month: 'April', year: 2015 });
      });
    });

    describe('When the passed year is later than 2016', () => {
      it('should return month value as the season with the correct year.', () => {
        expect(staffPicksDate('2016-06')).to.deep.equal({ month: 'Summer', year: 2016 });
      });
    });
  });

  describe('annualDateyear)', () => {
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
      it('should return an empty year.', () => {
        expect(annualDate('2015-01')).to.deep.equal({ year: '' });
      });
    });
  });

  describe('monthOrSeason)', () => {
    describe('Default values', () => {
      it('should return "Winter" as the default month value', () => {
        expect(monthOrSeason()).to.deep.equal('January');
      });
    });

    // January-December months are from 0-12
    describe('Updated month values, year is 2017 for testing', () => {
      it('should return "Spring"', () => {
        expect(monthOrSeason(2, 2017)).to.deep.equal('Spring');
        expect(monthOrSeason(3, 2017)).to.deep.equal('Spring');
        expect(monthOrSeason(4, 2017)).to.deep.equal('Spring');
      });

      it('should return "Summer"', () => {
        expect(monthOrSeason(5, 2017)).to.deep.equal('Summer');
        expect(monthOrSeason(6, 2017)).to.deep.equal('Summer');
        expect(monthOrSeason(7, 2017)).to.deep.equal('Summer');
      });

      it('should return "Fall"', () => {
        expect(monthOrSeason(8, 2017)).to.deep.equal('Fall');
        expect(monthOrSeason(9, 2017)).to.deep.equal('Fall');
        expect(monthOrSeason(10, 2017)).to.deep.equal('Fall');
      });

      it('should return "Winter"', () => {
        expect(monthOrSeason(11, 2017)).to.deep.equal('Winter');
        expect(monthOrSeason(0, 2017)).to.deep.equal('Winter');
        expect(monthOrSeason(1, 2017)).to.deep.equal('Winter');
      });
    });

    describe('Should return a month if the year is less than 2016', () => {
      it('should return specific months', () => {
        expect(monthOrSeason(0, 2014)).to.deep.equal('January');
        expect(monthOrSeason(3, 2014)).to.deep.equal('April');
        expect(monthOrSeason(6, 2014)).to.deep.equal('July');
        expect(monthOrSeason(10, 2014)).to.deep.equal('November');
      });
    });
  });

  describe('matchListDate', () => {
    describe('default input', () => {
      it('should return null without any values', () => {
        expect(matchListDate('')).to.equal(null);
        expect(matchListDate('', '')).to.equal(null);
        expect(matchListDate('not a real input', '')).to.equal(null);
      });
    });

    describe('staff-picks type input', () => {
      it('should return null with no date string', () => {
        expect(matchListDate('', 'staff-picks')).to.equal(null);
      });

      it('should accept date strings in a year and month pattern', () => {
        // We only care about the first three elements in the array:
        expect(matchListDate('2018-01', 'staff-picks').slice(0, 3))
          .to.eql(['2018-01', '2018', '01']);
        expect(matchListDate('2014-05', 'staff-picks').slice(0, 3))
          .to.eql(['2014-05', '2014', '05']);
      });

      it('should also accept date strings in a year and month and day pattern', () => {
        expect(matchListDate('2018-01-01', 'staff-picks').slice(0, 3))
          .to.eql(['2018-01-01', '2018', '01']);
        expect(matchListDate('2014-05-01', 'staff-picks').slice(0, 3))
          .to.eql(['2014-05-01', '2014', '05']);
      });

      it('should return null if there is no match', () => {
        expect(matchListDate('2018', 'staff-picks')).to.eql(null);
      });
    });

    describe('ya/childrens type input', () => {
      it('should return null with no date string', () => {
        expect(matchListDate('', 'ya')).to.equal(null);
        expect(matchListDate('', 'childrens')).to.equal(null);
      });

      it('should accept date strings only in a year pattern', () => {
        // We only care about the first input
        expect(matchListDate('2018', 'ya')[0]).to.eql('2018');
        expect(matchListDate('2017', 'ya')[0]).to.eql('2017');
        expect(matchListDate('2016', 'childrens')[0]).to.eql('2016');
        expect(matchListDate('2015', 'childrens')[0]).to.eql('2015');
      });


      it('should return null if there is no match', () => {
        expect(matchListDate('2016-01', 'ya')).to.eql(null);
        expect(matchListDate('2015-08', 'childrens')).to.eql(null);
      });
    });
  });
});
