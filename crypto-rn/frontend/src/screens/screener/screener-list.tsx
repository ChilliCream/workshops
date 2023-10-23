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
import {Button, ListRenderItem, Modal, View} from 'react-native';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {graphql, usePaginationFragment} from 'react-relay';

import {OrderIcon, SearchIcon, Typography} from '@/components';
import type {screenerListFragment_query$key} from '@/generated/screenerListFragment_query.graphql';
import type {ScreenerListRefetchableQuery} from '@/generated/ScreenerListRefetchableQuery.graphql';

import {ScreenerListItem} from './screener-list-item';

const Order = [
  {
    title: 'Market cap ↓',
    expression: {price: {marketCap: 'DESC'}},
  },
  {
    title: 'Change 24H ↓',
    expression: {price: {change24Hour: 'DESC'}},
  },
  {
    title: 'Change 24H ↑',
    expression: {price: {change24Hour: 'ASC'}},
  },
  {
    title: 'Symbol ↑',
    expression: {symbol: 'ASC'},
  },
  {
    title: 'Slug ↑',
    expression: {slug: 'ASC'},
  },
  {
    title: 'Name ↑',
    expression: {name: 'ASC'},
  },
];

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
  align-items: center;

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

  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [order, setOrder] = useState(0);
  const orderRef = useRef(order);

  const [busy, startTransition] = useTransition();

  const renderItem: ListRenderItem<Asset> = ({item}) => (
    <ScreenerListItem fragmentRef={item.node} />
  );

  const handleChangeText = useCallback((value: string) => {
    setQ(value);
  }, []);

  useEffect(() => {
    if (qRef.current !== deferredQ || orderRef.current !== order) {
      qRef.current = deferredQ;
      orderRef.current = order;

      startTransition(() => {
        const filterVars = deferredQ
          ? {
              where: {
                or: [
                  {symbol: {contains: deferredQ}},
                  {name: {contains: deferredQ}},
                  {slug: {contains: deferredQ}},
                ],
              },
            }
          : null;

        const orderVars: any = order
          ? {order: [Order[order].expression]}
          : null;

        refetch(Object.assign({}, filterVars, orderVars));
      });
    }
  }, [deferredQ, order]);

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
        <TouchableOpacity onPress={() => setShowOrderOptions(true)}>
          <OrderIcon />
        </TouchableOpacity>
      </Stack>

      <Divider />

      <FlatList<Asset>
        style={{paddingLeft: 16, paddingRight: 16, marginBottom: 16}}
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => (
          <Typography variant="body">Hmm, we can't find that asset.</Typography>
        )}
      />

      {hasNext && (
        <LoadMore
          title="Load more ..."
          onPress={() => {
            if (!busy || !isLoadingNext) {
              loadNext(10);
            }
          }}
        />
      )}

      <Modal
        animationType="slide"
        visible={showOrderOptions}
        onRequestClose={() => {
          setShowOrderOptions(false);
        }}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {Order.map(({title}, index) => (
            <TouchableOpacity
              key={title}
              onPress={() => {
                setOrder(index);
                setShowOrderOptions(false);
              }}
            >
              <Typography variant="body">{title}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </Root>
  );
});
