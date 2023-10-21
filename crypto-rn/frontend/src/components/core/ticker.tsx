import styled from '@emotion/native';
import React, {memo} from 'react';
import {FlatList, View, type FlatListProps} from 'react-native';

type TickerProps<T> = FlatListProps<T> &
  ('renderItem' | 'data' | 'keyExtractor');

const Root = styled(View)`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({theme}) => theme.pallete.border.primary};
`;

const ItemSeparator = styled(View)`
  width: 1px;
  height: 100%;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

export const Ticker = memo(
  <T extends object>({renderItem, data, keyExtractor}: TickerProps<T>) => (
    <Root>
      <FlatList<T>
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
      />
    </Root>
  ),
);
