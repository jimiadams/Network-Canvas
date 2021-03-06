import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { withHandlers, compose } from 'recompose';

import SettingsMenu from '../../components/MainMenu/SettingsMenu';
import { actionCreators as uiActions } from '../../ducks/modules/ui';
import { actionCreators as mockActions } from '../../ducks/modules/mock';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
import { actionCreators as importProtocolActions } from '../../ducks/modules/importProtocol';
import { actionCreators as deviceSettingsActions } from '../../ducks/modules/deviceSettings';
import { getAdditionalAttributesForCurrentPrompt, getNodeEntryForCurrentPrompt } from '../../selectors/session';

const settingsMenuHandlers = withHandlers({
  handleResetAppData: props => () => {
    props.openDialog({
      type: 'Warning',
      title: 'Reset application data?',
      message: 'This will delete ALL data from Network Canvas, including interview data and settings. Do you wish to continue?',
      onConfirm: () => {
        props.resetState();
        props.closeMenu();
      },
      confirmLabel: 'Continue',
    });
  },
  handleAddMockNodes: props => () => {
    if (!props.nodeVariableEntry) {
      return;
    }
    const [typeKey, nodeDefinition] = props.nodeVariableEntry;
    props.generateNodes(nodeDefinition.variables, typeKey, 20, props.additionalMockAttributes);
    props.closeMenu();
  },
});

const mapDispatchToProps = dispatch => ({
  closeMenu: () => dispatch(uiActions.update({ isMenuOpen: false })),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  resetState: () => dispatch(push('/reset')),
  generateNodes: bindActionCreators(mockActions.generateNodes, dispatch),
  importProtocolFromURI:
    bindActionCreators(importProtocolActions.importProtocolFromURI, dispatch),
  setDeviceDescription: name => dispatch(deviceSettingsActions.setDescription(name)),
  toggleUseFullScreenForms: () => dispatch(deviceSettingsActions.toggleSetting('useFullScreenForms')),
  toggleUseDynamicScaling: () => dispatch(deviceSettingsActions.toggleSetting('useDynamicScaling')),
  toggleShowScrollbars: () => dispatch(deviceSettingsActions.toggleSetting('showScrollbars')),
  toggleStartFullScreen: () => dispatch(deviceSettingsActions.toggleSetting('startFullScreen')),
  setInterfaceScale: scale => dispatch(deviceSettingsActions.setInterfaceScale(scale)),
});

const mapStateToProps = state => ({
  protocol: state.importProtocol,
  nodeVariableEntry: getNodeEntryForCurrentPrompt(state),
  shouldShowMocksItem: !!getNodeEntryForCurrentPrompt(state),
  additionalMockAttributes: getAdditionalAttributesForCurrentPrompt(state),
  useFullScreenForms: state.deviceSettings.useFullScreenForms,
  useDynamicScaling: state.deviceSettings.useDynamicScaling,
  showScrollbars: state.deviceSettings.showScrollbars,
  startFullScreen: state.deviceSettings.startFullScreen,
  deviceDescription: state.deviceSettings.description,
  interfaceScale: state.deviceSettings.interfaceScale,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  settingsMenuHandlers,
)(SettingsMenu);

