/* eslint-env jest */

import React from 'react';
import MenuItem from '../../Elements/MenuItem';
import renderer from 'react-test-renderer';

const toLink = "linkyLink";
const onClick = () => {};
const imageType = "type";
const title = "title";

describe('MenuItem component', () => {
  it('renders menu item with title', () => {
    const component = renderer.create(
      <MenuItem to={toLink} onClick={onClick} imageType={imageType} title={title} />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders menu item with no image', () => {
    const component = renderer.create(
      <MenuItem to={toLink} onClick={onClick} title={title} />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
