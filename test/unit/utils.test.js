/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import utils from '../../src/app/utils/utils';

describe('Utils functions', () => {
  describe('getPickTags', () => {
    const getPickTags = utils.getPickTags;

    it('should return an empty array', () => {
      expect(getPickTags()).to.eql([]);
    });

    it('should return an array of all the tags in the picks', () => {
      const picks = {
        title: 'third book title',
        tags: ['Graphic-novels', 'Funny'],
      };
      expect(getPickTags(picks)).to.eql(['graphic-novels', 'funny']);
    });
  });

  describe('getSelectedTags', () => {
    const getSelectedTags = utils.getSelectedTags;

    it('should return an empty array', () => {
      expect(getSelectedTags()).to.eql([]);
    });

    it('should return an array of all the tags in the picks', () => {
      const initialTags = ['funny', 'horror', 'adventure', 'offbeat', 'graphic-novels', 'classy'];
      const selectedTags = ['funny', 'offbeat'];
      expect(getSelectedTags(initialTags, selectedTags)).to.eql(['funny', 'offbeat']);
    });
  });


  describe('getAllTags', () => {
    const getAllTags = utils.getAllTags;

    it('should return an empty array', () => {
      expect(getAllTags()).to.eql([]);
    });

    it('should return an array of all the tags in the picks', () => {
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
        {
          title: 'fourth book title',
          tags: [],
        },
      ];
      expect(getAllTags(picks)).to.eql(['adventure', 'funny', 'graphic-novels', 'horror']);
    });
  });

  describe('capitalize', () => {
    const capitalize = utils.capitalize;

    it('should make the first character of a string uppercase.', () => {
      expect(capitalize('audience')).to.equal('Audience');
    });
  });

  describe('focusOnFirstAvailableElement', () => {
    const mockElementIds = ['element1', 'element2', 'element3', 'element4'];
    // The mockups of the elements that getElementById will return
    // As we will run focus() on the function, we stub a focus function to each element
    const mockElements = [
      {
        id: 'element1',
        children: [],
        focus: sinon.stub(),
      },
      {
        id: 'element2',
        children: [],
        focus: sinon.stub(),
      },
      {
        id: 'element3',
        children: [],
        focus: sinon.stub(),
      },
      {
        id: 'element4',
        children: [],
        focus: sinon.stub(),
      },
    ];
    const focusOnFirstAvailableElement = utils.focusOnFirstAvailableElement;
    const getElementById = sinon.stub(document, 'getElementById');

    // Sets the stub function as the callback when calling getComputedStyle
    // So we can test the chained method of getComputedStyle().getPropertyValue('display')
    // Set two returns that have different values of styles for 'display'
    const getPropertyValue = {
      getPropertyValue: sinon.stub().withArgs('display')
        .onCall(0).returns('none')
        .onCall(1).returns('block')
        .onCall(2).returns('block'),
    };
    const getComputedStyle = sinon.stub(window, 'getComputedStyle').returns(getPropertyValue);

    // Sets three different returns when calling mockElements
    getElementById
      .onCall(0).returns(null)
      .onCall(1).returns(mockElements[1])
      .onCall(2).returns(mockElements[2])
      .onCall(3).returns(mockElements[3]);

    it('should return false if no data or empty array passed to it.', () => {
      expect(focusOnFirstAvailableElement(undefined)).to.equal(false);
      expect(focusOnFirstAvailableElement([])).to.equal(false);
    });

    it('should focus the first available element.', () => {
      focusOnFirstAvailableElement(mockElementIds);

      // getElementById should only be called 3 times, even with a forth element
      // On the third time it satisfies the condition, so the interation should stop
      expect(getElementById.callCount).to.equal(3);

      // getComputedStyle should only be called 2 times, even with a forth element
      // On the first time, it should skip calling it as there's no valid DOM
      // And the third time should be the last interation as it satisfies the condition
      expect(getComputedStyle.callCount).to.equal(2);

      // Tests which element got focused here (focus() got called)
      expect(mockElements[0].focus.callCount).to.equal(0);
      expect(mockElements[1].focus.callCount).to.equal(0);
      expect(mockElements[2].focus.callCount).to.equal(1);
      expect(mockElements[3].focus.callCount).to.equal(0);
    });
  });
});
