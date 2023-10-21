import {Divider} from '@mui/material';
import {memo, Suspense, unstable_SuspenseList as SuspenseList} from 'react';
import {graphql, useFragment} from 'react-relay';

import {BearishIcon, BullishIcon} from '@/icons';

import DashboardSpotlightCard from './DashboardSpotlightCard';

const Gainers = ({fragmentRef}) => {
  const data = useFragment(
    graphql`
      fragment DashboardSpotlightGainersFragment_query on Query {
        gainers: assets(
          first: 5
          where: {price: {change24Hour: {gt: 0}}}
          order: {price: {change24Hour: DESC}}
        ) {
          ...DashboardSpotlightCardFragment_asset
        }
      }
    `,
    fragmentRef,
  );

  return (
    <DashboardSpotlightCard
      fragmentRef={data.gainers}
      title="Top Gainers"
      avatar={<BullishIcon />}
    />
  );
};

const Losers = ({fragmentRef}) => {
  const data = useFragment(
    graphql`
      fragment DashboardSpotlightLosersFragment_query on Query {
        losers: assets(
          first: 5
          where: {price: {change24Hour: {lt: 0}}}
          order: {price: {change24Hour: ASC}}
        ) {
          ...DashboardSpotlightCardFragment_asset
        }
      }
    `,
    fragmentRef,
  );

  return (
    <DashboardSpotlightCard
      fragmentRef={data.losers}
      title="Top Losers"
      avatar={<BearishIcon />}
    />
  );
};

export default memo(function DashboardSpotlight({fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment DashboardSpotlightFragment_query on Query {
        ...DashboardSpotlightGainersFragment_query @defer(label: "gainers")
        ...DashboardSpotlightLosersFragment_query @defer(label: "losers")
      }
    `,
    fragmentRef,
  );

  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={false}>
        <Gainers fragmentRef={data} />
        <Divider />
      </Suspense>
      <Suspense fallback={false}>
        <Losers fragmentRef={data} />
      </Suspense>
    </SuspenseList>
  );
});
