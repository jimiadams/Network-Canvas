/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import PresetSwitcher from '../PresetSwitcher';

describe('<PresetSwitcher />', () => {
  const props = { presets: [{}, {}], presetIndex: 0 };

  it('renders navigation', () => {
    const subject = shallow(<PresetSwitcher {...props} />);
    expect(subject.dive().find('.preset-switcher__navigation--next')).toHaveLength(1);
  });

  it('handles navigation', () => {
    const handler = jest.fn();
    const subject = shallow(<PresetSwitcher {...props} updatePreset={handler} />);
    const next = subject.dive().find('.preset-switcher__navigation--next');
    next.simulate('click');
    expect(handler).toHaveBeenCalled();
  });

  it('enables freeze button', () => {
    const handler = jest.fn();
    const subject = shallow(<PresetSwitcher {...props} toggleFreeze={handler} />);
    const next = subject.dive().find('.preset-switcher__freeze');
    next.simulate('click');
    expect(handler).toHaveBeenCalled();
    expect(subject.dive().find('.preset-switcher__freeze--active')).toHaveLength(0);
  });

  it('activates freeze button', () => {
    const subject = shallow(<PresetSwitcher {...props} isFreeze />);
    expect(subject.dive().find('.preset-switcher__freeze--active')).toHaveLength(1);
  });

  it('hides freeze button', () => {
    const subject = shallow(<PresetSwitcher {...props} showFreezeButton={false} />);
    expect(subject.dive().find('.preset-switcher__freeze')).toHaveLength(0);
  });
});
