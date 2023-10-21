import styled from '@emotion/native';
import React, {
  memo,
  Suspense,
  unstable_SuspenseList as SuspenseList,
} from 'react';
import {View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import type {homeSpotlightFragment_query$key} from '@/__generated__/homeSpotlightFragment_query.graphql';
import type {homeSpotlightGainersFragment_query$key} from '@/__generated__/homeSpotlightGainersFragment_query.graphql';
import type {homeSpotlightLosersFragment_query$key} from '@/__generated__/homeSpotlightLosersFragment_query.graphql';
import {BearishIcon, BullishIcon} from '@/components';

import {HomeSpotlightCard} from './home-spotlight-card';

type GainersDataProp = homeSpotlightGainersFragment_query$key;
type LoosersDataProp = homeSpotlightLosersFragment_query$key;
type HomeSpotlightDataProp = homeSpotlightFragment_query$key;

interface GainersProps {
  fragmentRef: GainersDataProp;
}

interface LoosersProps {
  fragmentRef: LoosersDataProp;
}

interface HomeSpotlightProps {
  fragmentRef: HomeSpotlightDataProp;
}

const Divider = styled(View)`
  width: 100%;
  height: 1px;
  background-color: ${({theme}) => theme.pallete.border.primary};
`;

const Gainers: React.FC<GainersProps> = ({fragmentRef}) => {
  const data = useFragment<GainersDataProp>(
    graphql`
      fragment homeSpotlightGainersFragment_query on Query {
        gainers: assets(
          first: 5
          where: {price: {change24Hour: {gt: 0}}}
          order: {price: {change24Hour: DESC}}
        ) {
          ...homeSpotlightCardFragment_asset
        }
      }
    `,
    fragmentRef,
  );

  if (!data.gainers) {
    return null;
  }

  return (
    <HomeSpotlightCard
      fragmentRef={data.gainers}
      title="Top Gainers"
      avatar={() => <BullishIcon width={30} height={30} />}
    />
  );
};

const Losers: React.FC<LoosersProps> = ({fragmentRef}) => {
  const data = useFragment<LoosersDataProp>(
    graphql`
      fragment homeSpotlightLosersFragment_query on Query {
        losers: assets(
          first: 5
          where: {price: {change24Hour: {lt: 0}}}
          order: {price: {change24Hour: ASC}}
        ) {
          ...homeSpotlightCardFragment_asset
        }
      }
    `,
    fragmentRef,
  );

  if (!data.losers) {
    return null;
  }

  return (
    <HomeSpotlightCard
      fragmentRef={data.losers}
      title="Top Losers"
      avatar={() => <BearishIcon width={30} height={30} />}
    />
  );
};

export const HomeSpotlight = memo<HomeSpotlightProps>(function HomeSpotlight({
  fragmentRef,
}) {
  const data = useFragment<HomeSpotlightDataProp>(
    graphql`
      fragment homeSpotlightFragment_query on Query {
        ...homeSpotlightGainersFragment_query @defer(label: "gainers")
        ...homeSpotlightLosersFragment_query @defer(label: "losers")
      }
    `,
    fragmentRef,
  );

  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={false}>
        <Gainers fragmentRef={data} />
      </Suspense>
      <Divider />
      <Suspense fallback={false}>
        <Losers fragmentRef={data} />
      </Suspense>
    </SuspenseList>
  );
});
