/* eslint-env jest */

import reducer from '../protocols';
import { actionTypes as ProtocolActionTypes } from '../protocol';

const initialState = [
  {
    name: 'Teaching Protocol',
    description: 'version 4.0.0',
    path: 'education.netcanvas',
    isFactoryProtocol: true,
  },
  {
    name: 'Development Protocol',
    description: 'version 4.0.0',
    path: 'development.netcanvas',
    isFactoryProtocol: true,
  },
];

describe('protocols reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {}),
    ).toEqual(initialState);
  });

  describe('SET_PROTOCOL', () => {
    it('adds a new protocol', () => {
      const setProtocolAction = { type: ProtocolActionTypes.SET_PROTOCOL, protocol: { name: 'new' } };
      expect(reducer(initialState, setProtocolAction)).toHaveLength(initialState.length + 1);
    });

    it('does not add an existing protocol', () => {
      const setProtocolAction = { type: ProtocolActionTypes.SET_PROTOCOL, protocol: { name: 'new' } };
      const newState = reducer(initialState, setProtocolAction);
      expect(reducer(newState, setProtocolAction)).toHaveLength(newState.length);
    });
  });
});
