/* eslint-disable no-new-func */

/* unused proof of concept for loading custom code */

import React from 'react';
import createReactClass from 'create-react-class';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as networkActions } from '../../ducks/modules/network';
import { actionCreators as modalActions } from '../../ducks/modules/modals';
import { PromptSwiper } from '../../containers/';
import { NodeList, DropZone } from '../../components/';

const actions = {
  network: networkActions,
  modal: modalActions,
};

const selectors = {
};

const elements = {
  PromptSwiper, NodeList, DropZone,
};

const environment = {
  React,
  createReactClass,
  bindActionCreators,
  connect,
};

const api = {
  actions,
  selectors,
  elements,
};

export default protocol => (
  new Function(
    'environment',
    'api',
    protocol,
  )(
    environment,
    api,
  )
);