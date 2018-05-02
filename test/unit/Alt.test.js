/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import alt from '../../src/app/alt';
import actions from '../../src/app/actions/BookActions';
import store from '../../src/app/stores/BookStore';

/*
 * getDispatcherArguments
 * Results of Actions are stored in an array so they must be obtained sequentially.
 * @param {object} dispatcherSpy Sinon spy for the Alt dispatcher object.
 * @param {number} num The offset of the action called.
 * @returns {object} object with the name and data of that the Action was called with.
 */
const getDispatcherArguments = (dispatcherSpy, num) => dispatcherSpy.args[num][0];
const picks = [
  {
    author: 'name',
    title: 'book title',
  },
  {
    author: 'name',
    title: 'book title',
  },
];
const filters = ['offbeat', 'funny', 'historical'];
const selectableFilters = ['offbeat', 'funny'];

describe('Alt', () => {
  describe('Actions', () => {
    let dispatcherSpy;

    before(() => {
      dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    after(() => {
      alt.dispatcher.dispatch.restore();
    });

    it('should pass data to updatePicksData Action', () => {
      const action = actions.UPDATE_PICKS_DATA;

      // Trigger the action with data.
      actions.updatePicksData(picks);

      // Get the payload passed to the dispatcher.
      // Note, the offset must match the order that the action was called.
      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 0);

      // Test that the correct name of the action was called with the expected data.
      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(picks);
    });

    it('should pass data to updateFilters Action', () => {
      const action = actions.UPDATE_FILTERS;

      actions.updateFilters(filters);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 1);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(filters);
    });

    it('should pass the boolean to setIsJsEnabled Action', () => {
      const action = actions.SET_IS_JS_ENABLED;

      actions.setIsJsEnabled(true);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 2);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(true);
    });

    it('should pass data to setSelectableFilters Action', () => {
      const action = actions.SET_SELECTABLE_FILTERS;

      actions.setSelectableFilters(selectableFilters);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 3);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(selectableFilters);
    });
  });

  describe('Store', () => {
    it('should pass data to updatePicksData Action', () => {
      const oldPicks = store.getState().picksData;
      const action = actions.UPDATE_PICKS_DATA;
      const data = {};

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newPicks = store.getState().picksData;

      // Since the action was already fired in a previous test, and we're using the same
      // instance, these tests are to verify that data updated and not caring so much
      // about what the actual data was.
      expect(oldPicks).to.eql(picks);
      expect(newPicks).to.eql({});
    });

    it('should pass data to updateFilters Action', () => {
      const oldFilters = store.getState().filters;
      const action = actions.UPDATE_FILTERS;
      const data = ['graphic-novels'];

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newFilters = store.getState().filters;

      expect(oldFilters).to.eql(filters);
      expect(newFilters).to.eql(['graphic-novels']);

      // Clearing the data:
      alt.dispatcher.dispatch({ action, data: [] });
    });

    it('should pass data to setSelectableFilters Action', () => {
      const oldSelectableFilters = store.getState().selectableFilters;
      const action = actions.SET_SELECTABLE_FILTERS;
      const data = [];

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSelectableFilters = store.getState().selectableFilters;

      expect(oldSelectableFilters).to.eql(selectableFilters);
      expect(newSelectableFilters).to.eql([]);
    });

    it('should pass the boolean value to setIsJsEnabled Action', () => {
      const initialIsJsEnabledValue = store.getState().isJsEnabled;
      const action = actions.SET_IS_JS_ENABLED;
      const data = false;

      // Dispatch the updated boolean, the previous test had set the boolean to TRUE. We are testing
      // the ability to dispatch an event and check the store update
      alt.dispatcher.dispatch({ action, data });
      const updatedIsJsEnabledValue = store.getState().isJsEnabled;

      expect(initialIsJsEnabledValue).to.eql(true);
      expect(updatedIsJsEnabledValue).to.eql(false);
    });
  });
});
