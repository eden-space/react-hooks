import React from 'react';

const StoryContainer: React.FC<{ children: React.Component }> = (props) => {
  return <>{props.children}</>;
};

export const parameters = {
  // layout: 'centered',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story: React.Component) => (
    <StoryContainer>
      <Story />
    </StoryContainer>
  ),
];
