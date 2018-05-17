/* eslint-env mocha */
import { expect } from 'chai';

import logger from '../../logger';

describe('Logger', () => {
  
  describe('Transports', () => {
    it('should be an object', () => {
      expect(logger.transports).to.be.an('object');
    });
  });

  describe('Levels', () => {
    it('should include all the levels', () => {
      expect(logger.levels).to.include({
        emergency: 0,
        alert: 1,
        critical: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7,
      });
    });
  });

  describe('exitOnError', () => {
    it('should be false by default', () => {
      expect(logger.exitOnError).to.eql(false);
    });
  });
});
