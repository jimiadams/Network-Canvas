/* eslint-disable no-shadow */
import { createSelector } from 'reselect';
import { get, clamp } from 'lodash';
import { currentStageIndex } from '../utils/matchSessionPath';
import { getAdditionalAttributes, getSubject } from '../utils/protocol/accessors';
import { createDeepEqualSelector } from './utils';
import { initialState } from '../ducks/modules/session';
import { getProtocolCodebook, getProtocolStages, getActiveProtocol } from './protocol';

const currentPathname = router => router && router.location && router.location.pathname;
const stageIndexForCurrentSession = state => currentStageIndex(currentPathname(state.router));

export const getActiveSession = state =>
  state.activeSessionId && state.sessions[state.activeSessionId];

export const getCaseId = createDeepEqualSelector(
  getActiveSession,
  session => (session && session.caseId),
);

export const getSessionPath = (state, stageIndex) => {
  const sessionId = state.activeSessionId;
  const sessionPath = `/session/${sessionId}`;

  if (stageIndex === undefined) { return sessionPath; }

  return `${sessionPath}/${stageIndex}`;
};

export const getSessionProgress = (state) => {
  const session = getActiveSession(state);
  const protocol = getActiveProtocol(state);
  /*
   * We use the stages selector (rather than plain protocol)
   * because it takes into account the finish screen
   */
  const stages = getProtocolStages(state);
  const currentPrompt = session.promptIndex;
  const currentStage = session.stageIndex;
  const stageCount = protocol.stages.length;
  // includes finish screen if present
  const screenCount = stages.length;
  const promptCount = get(stages, [currentStage, 'prompts', 'length'], 0);
  const stageProgress = currentStage / (screenCount - 1);
  const promptProgress = promptCount ? currentPrompt / promptCount : 0;
  // This can go over 100% when finish screen is not present,
  // so it needs to be clamped
  const percentProgress =
    clamp((stageProgress + (promptProgress / (screenCount - 1))) * 100, 0, 100);
  const isFirstPrompt = promptCount > 0 && currentPrompt === 0;
  const isLastPrompt = promptCount > 0 && currentPrompt === promptCount - 1;
  const isFirstStage = currentStage === 0;
  const isLastStage = currentStage === stageCount - 1;
  // includes finish screen if present
  const isLastScreen = currentStage === screenCount - 1;

  return {
    currentStage,
    stageCount,
    screenCount,
    currentPrompt,
    promptCount,
    isFirstPrompt,
    isLastPrompt,
    isFirstStage,
    isLastStage,
    isLastScreen,
    stageProgress,
    promptProgress,
    percentProgress,
  };
};

export const anySessionIsActive =
  state => state.activeSessionId && state.activeSessionId !== initialState;

export const getStageForCurrentSession = createSelector(
  (state, props) => getProtocolStages(state, props),
  stageIndexForCurrentSession,
  (stages, stageIndex) => stages[stageIndex],
);

export const getPromptIndexForCurrentSession = createSelector(
  state => (
    state.sessions[state.activeSessionId] && state.sessions[state.activeSessionId].promptIndex
  ) || 0,
  promptIndex => promptIndex,
);

const getPromptForCurrentSession = createSelector(
  getStageForCurrentSession,
  getPromptIndexForCurrentSession,
  (stage, promptIndex) => stage && stage.prompts && stage.prompts[promptIndex],
);

// @return {Array} An object entry ([key, object]) for the current node type
//  from the variable registry
export const getNodeEntryForCurrentPrompt = createSelector(
  (state, props) => getProtocolCodebook(state, props),
  getPromptForCurrentSession,
  getStageForCurrentSession,
  (registry, prompt, stage) => {
    if (!registry || !registry.node || !prompt || !stage) {
      return null;
    }
    const subject = getSubject(stage, prompt);
    const nodeType = subject && subject.type;
    const nodeTypeDefinition = nodeType && registry.node[nodeType];
    if (nodeTypeDefinition) {
      return [nodeType, nodeTypeDefinition];
    }
    return null;
  },
);

export const getAdditionalAttributesForCurrentPrompt = createSelector(
  getPromptForCurrentSession,
  getStageForCurrentSession,
  (prompt, stage) => getAdditionalAttributes(stage, prompt),
);
