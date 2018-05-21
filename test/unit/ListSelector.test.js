/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ListSelector from '../../src/app/components/ListSelector/ListSelector';
import config from '../../appConfig';

const fieldsetProps = {
  season: {
    fieldsetName: 'season',
    currentValue: '2018-01',
    options: [
      { name: '2018 Winter', value: '2018-01' },
      { name: '2017 Fall', value: '2017-09' },
      { name: '2017 Summer', value: '2017-06' },
      { name: '2017 Spring', value: '2017-04' },
    ],
  },
  audience: {
    fieldsetName: 'audience',
    currentValue: 'Adult',
    options: [
      { name: 'Adult', value: 'Adult' },
      { name: 'Teen', value: 'YA' },
      { name: 'Children', value: 'Children' },
    ],
  },
  type: 'staff-picks',
};

describe('ListSelector', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<ListSelector fieldsetProps={fieldsetProps} />);
    });

    after(() => {
      component.unmount();
    });

    it('should render a form, and inside the form, it should render <input>.',
      () => {
        expect(component.find('form').length).to.equal(1);
        expect(component.find('input').length).to.equal(2);
        expect(component.find('input').node.props.className).to.equal('no-js');
      }
    );

    it('should render <input> with the class "js" if its props "isJsEnabled" is true.',
      () => {
        component.setProps({ isJsEnabled: true });
        expect(component.find('input').length).to.equal(2);
        expect(component.find('input').node.props.className).to.equal('js');
      }
    );
  });

  describe('renderFieldset()', () => {
    const renderFieldset = sinon.spy(ListSelector.prototype, 'renderFieldset');
    const emptyFieldset = {
      fieldsetName: 'empty',
      currentValue: 'Nothing',
      options: [],
    };
    const mammalFieldset = {
      fieldsetName: 'mammal',
      currentValue: 'Dog',
      options: [
        { name: 'Dog', value: 'Dog' },
        { name: 'Cat', value: 'Cat' },
        { name: 'Whale', value: 'Whale' },
      ],
    };

    afterEach(() => {
      renderFieldset.reset();
    });

    after(() => {
      renderFieldset.restore();
    });

    it('should return null, if the list has no options.', () => {
      expect(renderFieldset(emptyFieldset)).to.equal(null);
    });

    it('should return null, if the list type is not "season" nor "audience".', () => {
      expect(renderFieldset(mammalFieldset)).to.equal(null);
    });
  });

  describe('When the selected option updates,', () => {
    // Bind sinon.spy to the prototype of ListSelector, before ListSelector is mounted
    const submitFormRequest = sinon.spy(ListSelector.prototype, 'submitFormRequest');
    const component = shallow(<ListSelector fieldsetProps={fieldsetProps} />);

    before(() => {
      component.instance().handleSeasonChange({ target: { value: '2017-01' } });
    });

    after(() => {
      submitFormRequest.restore();
      component.unmount();
    });

    it('should make an API request to request a new list.', () => {
      expect(submitFormRequest.called).to.equal(true);
    });
  });

  describe('After making the API request,', () => {
    const mock = new MockAdapter(axios);
    const updateBookStore = sinon.spy(ListSelector.prototype, 'updateBookStore');
    const updateLocation = sinon.spy(ListSelector.prototype, 'updateLocation');
    const component = shallow(<ListSelector fieldsetProps={fieldsetProps} />);
    const mockBookListResponse = {
      date: '2017-01',
      title: 'Winter 2016 Staff Picks',
      picksData: {
        picks: [
          {
            ageGroup: 'Adult',
            book: {
              title: 'book 01',
            },
          },
          {
            ageGroup: 'Children',
            book: {
              title: 'book 01',
            },
          },
          {
            ageGroup: 'YA',
            book: {
              title: 'book 03',
            },
          },
        ],
      },
    };

    before(() => {
      mock
        .onGet(`${config.baseApiUrl}2099-13`)
        .reply(500, {
          statusText: 'Undefined error',
          status: 500,
        })
        .onGet(`${config.baseApiUrl}staff-picks/2017-01`)
        .reply(200, mockBookListResponse);
    });

    afterEach(() => {
      // Clear the spy status after each time we run a test
      updateBookStore.reset();
      updateLocation.reset();
    });

    after(() => {
      // And after all the tests are done, restore the spy
      updateBookStore.restore();
      updateLocation.restore();
      component.unmount();
      mock.reset();
    });

    // As submitFormRequest will invoke an axios call, the test have to wait for the axios request
    // to resolve and to be examined.
    // For doing that, we add a setTimeout to delay the test.
    // However, it raises another issue that the test after the current one will be executed,
    // even when the current test has not been done yet.
    // To prevent that, we pass "done" to make this test async, and then we call "done()" to mark
    // the point where the current test is completed. The mark tells chai it is the time to do the
    // next test.
    it('should set BookStore back to the default, if the request fails.', (done) => {
      component.instance().submitFormRequest('season', '2099-13');
      setTimeout(
        () => {
          expect(updateBookStore.called).to.equal(true);
          expect(updateBookStore.getCall(0).args).to.deep.equal([]);

          done();
        }, 150
      );
    });

    it('should set URL to the 404 page, if the request fails.', (done) => {
      component.instance().submitFormRequest('season', '2099-13');
      setTimeout(
        () => {
          expect(updateLocation.called).to.equal(true);
          expect(updateLocation.getCall(0).args).to.deep.equal(
            ['/books-music-movies/recommendations/best-books/404']
          );

          done();
        }, 150
      );
    });

    it('should update BookStore with the data response, if the request succeeds.', (done) => {
      component.instance().submitFormRequest('2017-01');
      setTimeout(
        () => {
          expect(updateBookStore.called).to.equal(true);
          expect(updateBookStore.getCall(0).args).to.deep.equal(
            [mockBookListResponse, '2017-01', [], []]
          );

          done();
        }, 150
      );
    });

    it('should set the correct URL, if the request succeeds.', (done) => {
      component.instance().submitFormRequest('2017-01');
      setTimeout(
        () => {
          expect(updateLocation.called).to.equal(true);
          expect(updateLocation.getCall(0).args).to.deep.equal(
            ['/books-music-movies/recommendations/best-books/staff-picks/2017-01']
          );

          done();
        }, 150
      );
    });
  });
});
