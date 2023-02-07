import styled from '@emotion/native';
import React, {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {Button, ListRenderItem, Pressable, Text, View} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {graphql, usePaginationFragment} from 'react-relay';

import type {ScreenerListRefetchableQuery} from '@/__generated__/ScreenerListRefetchableQuery.graphql';
import type {screenerListFragment_query$key} from '@/__generated__/screenerListFragment_query.graphql';
import {SearchIcon, Typography} from '@/components';

import {ScreenerListItem} from './screener-list-item';

type ScreenerListDataProp = screenerListFragment_query$key;

type Asset = NonNullable<
  NonNullable<NonNullable<ScreenerListDataProp[' $data']>['assets']>['edges']
>[0];

interface ScreenerListProps {
  fragmentRef: ScreenerListDataProp;
}

const Root = styled(View)`
  flex: 1;
  padding: 12px;
`;

const Stack = styled(View)<{
  layout: 'row' | 'column';
  space?: {top?: number; right?: number; bottom?: number; left?: number};
}>`
  flex-direction: ${({layout}) => layout};

  ${({space}) =>
    !!space &&
    Object.entries(space).map(([pos, val]) => `margin-${pos}: ${val}px;`)}
`;

const $TextInput = styled(TextInput)`
  flex: 1;
  ${({theme}) => theme.typography['subtitle']}
  margin-left: 4px;
`;

const Divider = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

const LoadMore = styled(Button)`
  margin-bottom: 16px;
  background-color: none;
  border: none;
`;

export const ScreenerList = memo<ScreenerListProps>(function ScreenerList({
  fragmentRef,
}) {
  const {data, hasNext, loadNext, isLoadingNext, refetch} =
    usePaginationFragment<ScreenerListRefetchableQuery, ScreenerListDataProp>(
      graphql`
        fragment screenerListFragment_query on Query
        @argumentDefinitions(
          cursor: {type: "String"}
          count: {type: "Int", defaultValue: 10}
          where: {type: "AssetFilterInput"}
          order: {
            type: "[AssetSortInput!]"
            defaultValue: {price: {marketCap: DESC}}
          }
        )
        @refetchable(queryName: "ScreenerListRefetchableQuery") {
          assets(after: $cursor, first: $count, where: $where, order: $order)
            @connection(key: "ScreenerList_assets") {
            edges {
              node {
                id
                symbol
                ...screenerListItemFragment_asset
              }
            }
          }
        }
      `,
      fragmentRef,
    );

  const assets = data?.assets?.edges;

  const [q, setQ] = useState('');
  const qRef = useRef(q);
  const deferredQ = useDeferredValue(q);

  const [busy, startTransition] = useTransition();

  const renderItem: ListRenderItem<Asset> = ({item}) => (
    <ScreenerListItem fragmentRef={item.node} />
  );

  const handleChangeText = useCallback((value: string) => {
    setQ(value);
  }, []);

  useEffect(() => {
    if (qRef.current !== deferredQ) {
      qRef.current = deferredQ;

      startTransition(() => {
        const variables = deferredQ
          ? {
              where: {
                or: [
                  {symbol: {contains: deferredQ}},
                  {name: {contains: deferredQ}},
                  {slug: {contains: deferredQ}},
                ],
              },
            }
          : {};

        refetch(variables);
      });
    }
  }, [deferredQ]);

  return (
    <Root>
      <Stack layout="row" space={{left: 8, right: 8, bottom: 8}}>
        <SearchIcon />
        <$TextInput
          value={q}
          placeholder="Search all assets"
          autoFocus={true}
          onChangeText={handleChangeText}
        />
      </Stack>

      <Divider />

      <FlatList<Asset>
        style={{paddingLeft: 16, paddingRight: 16, marginBottom: 16}}
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        showsVerticalScrollIndicator={false}
        // onEndReached={() => {
        //   if (!busy && hasNext) {
        //     loadNext(10);
        //   }
        // }}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => (
          <Typography variant="body">Hmm, we can't find that asset.</Typography>
        )}
      />

      {hasNext && (
        <LoadMore
          title="Load more ..."
          onPress={() => {
            if (!busy) {
              loadNext(10);
            }
          }}
        />
      )}
    </Root>
  );
});
