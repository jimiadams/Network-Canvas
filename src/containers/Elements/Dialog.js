/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog as DialogComponent } from '../../components/Elements';
import modal from '../../behaviours/modal';

/**
  * A modal window which can be toggled open an closed.
  * @extends Component
  */
class Dialog extends Component {

  confirmModal = () => {
    this.props.close();
    this.props.onConfirm();
  };

  cancelModal = () => {
    this.props.close();
    this.props.onCancel();
  };

  render() {
    const {
      title,
      children,
      show,
      hasCancelButton,
      confirmLabel,
      cancelLabel,
      type,
    } = this.props;

    return (
      <DialogComponent
        show={show}
        title={title}
        hasCancelButton={hasCancelButton}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        type={type}
        onConfirm={this.confirmModal}
        onCancel={this.cancelModal}
      >
        {children}
      </DialogComponent>
    );
  }
}

Dialog.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hasCancelButton: PropTypes.bool,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  show: PropTypes.bool,
  children: PropTypes.any,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  close: PropTypes.func.isRequired,
};

Dialog.defaultProps = {
  show: false,
  hasCancelButton: true,
  confirmLabel: 'Okay',
  cancelLabel: 'Cancel',
  children: null,
  onCancel: () => {},
};


export default modal(Dialog);