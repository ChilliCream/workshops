import {Card, CardContent, Link, Stack} from '@mui/material';
import NextLink from 'next/link';
import {memo} from 'react';
import {graphql, useFragment} from 'react-relay';

import {Change, Price, SmallChart, Symbol} from '@/components';

export default memo(function DashboardFeaturedCard({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment DashboardFeaturedCardFragment_asset on Asset {
        symbol
        color
        price {
          currency
          lastPrice
          change24Hour
          change(span: DAY) {
            history {
              nodes {
                epoch
                price
              }
            }
          }
        }
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
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" gap={4}>
              <Symbol value={asset.symbol} color={asset.color} />
              <Price
                value={price.lastPrice}
                options={{currency: price.currency}}
              />
              <Change value={price.change24Hour} />
            </Stack>
          </CardContent>
          <SmallChart color={asset.color} data={price.change.history.nodes} />
        </Card>
      </Link>
    </NextLink>
  );
});
