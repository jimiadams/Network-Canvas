import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isEqual, pick, has, isNil } from 'lodash';
import LayoutNode from '../../containers/Canvas/LayoutNode';
import { entityPrimaryKeyProperty, getEntityAttributes, entityAttributesProperty } from '../../ducks/modules/network';

const watchProps = ['width', 'height', 'rerenderCount'];

const propsChangedExcludingNodes = (nextProps, props) =>
  !isEqual(pick(nextProps, watchProps), pick(props, watchProps));

const nodesLengthChanged = (nextProps, props) =>
  nextProps.nodes.length !== props.nodes.length;

class NodeLayout extends Component {
  static propTypes = {
    nodes: PropTypes.array,
    onSelected: PropTypes.func.isRequired,
    connectFrom: PropTypes.string,
    highlightAttribute: PropTypes.string,
    allowPositioning: PropTypes.bool,
    allowSelect: PropTypes.bool,
    layoutVariable: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    connectFrom: null,
    nodes: [],
    highlightAttribute: null,
    allowPositioning: true,
    allowSelect: true,
    layoutVariable: null,
    width: null,
    height: null,
  };

  shouldComponentUpdate(nextProps) {
    if (nodesLengthChanged(nextProps, this.props)) { return true; }
    if (!isEqual(nextProps.highlightAttribute, this.props.highlightAttribute)) { return true; }
    if (propsChangedExcludingNodes(nextProps, this.props)) { return true; }

    return false;
  }

  isHighlighted(node) {
    return !isEmpty(this.props.highlightAttribute) &&
      node[entityAttributesProperty][this.props.highlightAttribute] === true;
  }

  isLinking(node) {
    return node[entityPrimaryKeyProperty] === this.props.connectFrom;
  }

  render() {
    const {
      nodes,
      allowPositioning,
      allowSelect,
      layoutVariable,
      width,
      height,
    } = this.props;
    return (
      <div className="node-layout">
        { nodes.map((node) => {
          const nodeAttributes = getEntityAttributes(node);
          if (!has(nodeAttributes, layoutVariable) || isNil(nodeAttributes[layoutVariable])) {
            return null;
          }

          return (
            <LayoutNode
              key={node[entityPrimaryKeyProperty]}
              node={node}
              layoutVariable={layoutVariable}
              onSelected={() => this.props.onSelected(node)}
              selected={this.isHighlighted(node)}
              linking={this.isLinking(node)}
              allowPositioning={allowPositioning}
              allowSelect={allowSelect}
              areaWidth={width}
              areaHeight={height}
            />
          );
        }) }
      </div>
    );
  }
}

export { NodeLayout };

export default NodeLayout;
