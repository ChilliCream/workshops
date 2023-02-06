import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';

import type {ChangeSpan} from '@/__generated__/ViewerSnapshotRefetchableQuery.graphql';

import {Typography} from './typography';

interface SpanSelectorProps {
  span: ChangeSpan;
  busy: boolean;
  onChange: (value: ChangeSpan) => void;
}

const Toggler = styled(Pressable)`
  padding: 11px;
`;

const Root = styled(View)`
  flex-direction: row;
`;

export const SpanSelector = memo<SpanSelectorProps>(function SpanSelector({
  busy,
  span,
  onChange,
}) {
  const {
    pallete: {
      brand: {primary},
    },
  } = useTheme();
  const [activity, setActivity] = useState<boolean | undefined>(undefined);

  const handleChange = useCallback(
    (value: ChangeSpan) => {
      if (!activity && value) {
        onChange(value);
      }
    },
    [activity],
  );

  useEffect(() => {
    if (busy) {
      const timeout = setTimeout(() => {
        setActivity(true);
      }, 500);

      return () => {
        clearTimeout(timeout);
        setActivity(undefined);
      };
    }
  }, [busy]);

  return (
    <Root>
      <Toggler onPress={() => handleChange('HOUR')}>
        <Typography
          variant="caption"
          color={span === 'HOUR' ? primary : undefined}
        >
          1H
        </Typography>
      </Toggler>
      <Toggler onPress={() => handleChange('DAY')}>
        <Typography
          variant="caption"
          color={span === 'DAY' ? primary : undefined}
        >
          1D
        </Typography>
      </Toggler>
      <Toggler onPress={() => handleChange('WEEK')}>
        <Typography
          variant="caption"
          color={span === 'WEEK' ? primary : undefined}
        >
          1W
        </Typography>
      </Toggler>
      <Toggler onPress={() => handleChange('MONTH')}>
        <Typography
          variant="caption"
          color={span === 'MONTH' ? primary : undefined}
        >
          1M
        </Typography>
      </Toggler>
      <Toggler onPress={() => handleChange('YEAR')}>
        <Typography
          variant="caption"
          color={span === 'YEAR' ? primary : undefined}
        >
          1Y
        </Typography>
      </Toggler>
      <Toggler onPress={() => handleChange('ALL')}>
        <Typography
          variant="caption"
          color={span === 'ALL' ? primary : undefined}
        >
          ALL
        </Typography>
      </Toggler>
    </Root>
  );
});
