import styled from '@emotion/native';
import React, {memo} from 'react';
import {View} from 'react-native';

import {Typography} from './typography';

interface ChipProps {
  label: string;
}

const Root = styled(View)`
  background-color: ${({theme}) => theme.pallete.background.secondary};
  padding: 0px 8px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const Chip = memo<ChipProps>(function Chip({label}) {
  return (
    <Root>
      <Typography variant="subtitle">{label}</Typography>
    </Root>
  );
});
