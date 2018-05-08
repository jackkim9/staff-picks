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

  describe('getFiltersMapping', () => {
    const getFiltersMapping = utils.getFiltersMapping;

    it('should return an empty array', () => {
      expect(getFiltersMapping()).to.eql([]);
    });

    it('should return a map of all the tags with ids and labels', () => {
      const filters = [
        'Graphic Novels',
      ];
      expect(getFiltersMapping(filters)).to.eql([
        {
          id: 'graphic-novels',
          label: 'Graphic Novels',
        }
      ]);
    });
  });

  describe('focusOnFirstAvailableElement', () => {
    const focusOnFirstAvailableElement = utils.focusOnFirstAvailableElement;
    const getElementById = sinon.stub(document, 'getElementById');
    const getComputedStyle = sinon.stub(window, 'getComputedStyle');

    afterEach(() => {
      getElementById.reset();
      getComputedStyle.reset();
    });

    after(() => {
      getElementById.restore();
      getComputedStyle.restore();
    });

    it('should return false if no data or empty array passed to it.', () => {
      expect(focusOnFirstAvailableElement(undefined)).to.equal(undefined);
      expect(focusOnFirstAvailableElement([])).to.equal(undefined);
    });

    it('should remain the current focus if there are no elements match the input IDs.', () => {
      // Sets the first return for calling getElementById
      getElementById.onCall('i-do-not-exist').returns(null);

      // Runs the function
      focusOnFirstAvailableElement(['i-do-not-exist']);

      // getElementById should get called once to see if the element exists
      expect(getElementById.callCount).to.equal(1);
      // getComputedStyle should not get called because the element does not exist
      expect(getComputedStyle.callCount).to.equal(0);
    });

    it('should remain the current focus if the suggested elements are "display: none".', () => {
      const mockElement = {
        id: 'i-am-here-but-invisible',
        children: [],
        focus: sinon.spy(),
      };

      // After calling getComputedStyle, it returns the function getPropertyValue
      const mockGetPropertyValue = {
        // Calling getPropertyValue with "display" as the argument should return
        // "none"
        getPropertyValue: sinon.stub().withArgs('display').returns('none'),
      };

      // Sets the returned object for calling getElementById
      getElementById.withArgs('i-am-here-but-invisible').returns(mockElement);

      // Sets the return function for calling getComputedStyle with mockElement
      getComputedStyle.withArgs(mockElement).returns(mockGetPropertyValue);

      // Runs the function
      focusOnFirstAvailableElement(['i-am-here-but-invisible']);

      // getElementById should get called once to see if the element exists
      expect(getElementById.callCount).to.equal(1);
      // getComputedStyle should get called once because the element exists
      expect(getComputedStyle.callCount).to.equal(1);
    });

    it('should focus the first available element even if multiple suggested elements are visible.',
      () => {
        const mockElements = [
          {
            id: 'i-am-here-but-invisible',
            children: [],
            focus: sinon.spy(),
          },
          {
            id: 'i-am-here-and-visible-and-should-get-focused',
            children: [],
            focus: sinon.spy(),
          },
          {
            id: 'i-am-here-and-visible-but-should-not-get-focused',
            children: [],
            focus: sinon.spy(),
          },
        ];

        // After calling getComputedStyle, it returns different functions based on dfferent
        // mockElements that passed as the argument
        const mockGetPropertyValueDisplayNone = {
          getPropertyValue: sinon.stub().withArgs('display').returns('none'),
        };
        const mockGetPropertyValueDisplayBlock = {
          getPropertyValue: sinon.stub().withArgs('display').returns('block'),
        };

        // Sets the objects for returning after calling getElementById
        getElementById.withArgs('i-am-here-but-invisible').returns(mockElements[0]);
        getElementById.withArgs('i-am-here-and-visible-and-should-get-focused')
          .returns(mockElements[1]);
        getElementById.withArgs('i-am-here-and-visible-but-should-not-get-focused')
          .returns(mockElements[2]);

        // Runs the function
        getComputedStyle
          .withArgs(mockElements[0]).returns(mockGetPropertyValueDisplayNone)
          .withArgs(mockElements[1]).returns(mockGetPropertyValueDisplayBlock)
          .withArgs(mockElements[2]).returns(mockGetPropertyValueDisplayBlock);

        focusOnFirstAvailableElement([
          'i-am-here-but-invisible',
          'i-am-here-and-visible-and-should-get-focused',
          'i-am-here-and-visible-but-should-not-get-focused',
        ]);

        expect(getElementById.withArgs('i-am-here-but-invisible').callCount).to.equal(1);
        // The first time is to check if the DOM exists and the second time is to call focus()
        expect(getElementById.withArgs('i-am-here-and-visible-and-should-get-focused')
          .callCount).to.equal(2);
        // Since it have found the available element already, the iteration stops
        expect(getElementById.withArgs('i-am-here-and-visible-but-should-not-get-focused')
          .callCount).to.equal(0);

        expect(getComputedStyle.withArgs(mockElements[0]).callCount).to.equal(1);
        expect(getComputedStyle.withArgs(mockElements[1]).callCount).to.equal(1);
        expect(getComputedStyle.withArgs(mockElements[2]).callCount).to.equal(0);

        expect(mockElements[0].focus.callCount).to.equal(0);
        expect(mockElements[1].focus.callCount).to.equal(1);
        expect(mockElements[2].focus.callCount).to.equal(0);
      }
    );
  });
});
