import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { actionCreators as networkActions } from '../../ducks/modules/network';
import { activePromptAttributes } from '../../selectors/session';
import { existingNetwork } from '../../selectors/network';
import { data } from '../../selectors/data';

import { NodeList, SelectableNodeList, DraggableNodeList } from '../../components/Elements';

class NodeProvider extends Component {
  handleSelectNode = (node) => {
    if (_.isMatch(node, this.props.activePromptAttributes)) {
      this.props.updateNode(_.omit(node, Object.getOwnPropertyNames(this.props.activePromptAttributes)));
    } else {
      this.props.updateNode({ ...node, ...this.props.activePromptAttributes });
    }
  }

  render() {
    const {
      interaction,
      activePromptAttributes,
      network,
    } = this.props;

    switch (interaction) {
      case 'selectable':
        return <SelectableNodeList network={ network } activeNodeAttributes={ activePromptAttributes } handleSelectNode={ this.handleSelectNode } />;
      case 'draggable':
        return <DraggableNodeList network={ network } activeNodeAttributes={ activePromptAttributes } handleDragNode={ () => {} } />;
      default:
        return <NodeList network={ network } />;
    }

  }
}

function mapStateToProps(state, ownProps) {
  const interaction = ownProps.selectable && 'selectable' || ownProps.draggable && 'draggable' || 'none';
  let network = { nodes: [] };

  if (ownProps.source === 'existing') {
    network = existingNetwork(state)
  } else {
    network = data(state)[ownProps.source] || {};
  }

  return {
    network: ownProps.filter(network),
    interaction,
    activePromptAttributes: activePromptAttributes(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addNode: bindActionCreators(networkActions.addNode, dispatch),
    updateNode: bindActionCreators(networkActions.updateNode, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeProvider);
