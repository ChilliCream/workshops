import {Link, Stack} from '@mui/material';
import NextLink from 'next/link';
import {memo} from 'react';
import {graphql, useFragment} from 'react-relay';

import {Change, Price, Symbol} from '@/components';

export default memo(function DashboardTickerItem({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment DashboardTickerItemFragment_asset on Asset {
        symbol
        color
        price {
          ...DashboardTickerItemFragment_assetprice @relay(mask: false)
        }
      }

      fragment DashboardTickerItemFragment_assetprice on AssetPrice {
        currency
        lastPrice
        change24Hour
      }
    `,
    fragmentRef,
  );
  const {price} = asset;

  return (
    <NextLink
      href="/currencies/[symbol]"
      as={`/currencies/${asset.symbol}`}
      passHref
      legacyBehavior
    >
      <Link underline="none">
        <Stack direction="column" spacing={1} minWidth={100}>
          <Symbol value={asset.symbol} color={asset.color} size="tiny" />
          <Price value={price.lastPrice} options={{currency: price.currency}} />
          <Change value={price.change24Hour} size="tiny" />
        </Stack>
      </Link>
    </NextLink>
  );
});
