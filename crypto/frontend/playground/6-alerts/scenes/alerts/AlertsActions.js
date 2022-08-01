import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TextField,
} from '@mui/material';
import {useCallback, useState} from 'react';
import {
  ConnectionHandler,
  graphql,
  useFragment,
  useMutation,
  usePaginationFragment,
} from 'react-relay';

import {
  BusyButton,
  LoadMoreButton,
  NoData,
  PercentageSlider,
} from '@/components';
import {CancelIcon} from '@/icons';
import {formatCurrency, inequality, round} from '@/utils';

const useCreateAlert = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation AlertsActionsCAMutation($input: CreateAlertInput!) {
      createAlert(input: $input) {
        createdAlert {
          asset {
            hasAlerts
            ...AlertsActionsDAFragment_asset
          }
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}, {currency, targetPrice, recurring}) => {
      commit({
        variables: {input: {symbol, currency, targetPrice, recurring}},
        optimisticUpdater(store) {
          store.get(id)?.setValue(true, 'hasAlerts');
        },
        onCompleted() {
          console.log(`alert created for ${symbol}`);
        },
        onError() {
          console.log(
            `there was a problem while creating an alert for ${symbol}`,
          );
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

export const AddAlert = ({fragmentRef}) => {
  const asset = useFragment(
    graphql`
      fragment AlertsActionsAAFragment_asset on Asset {
        id
        symbol
        price {
          currency
          lastPrice
        }
      }
    `,
    fragmentRef,
  );
  const {price} = asset;

  const [createAlert, isInFlight] = useCreateAlert();

  const [state, setState] = useState(() => ({
    currency: price.currency,
    targetPrice: price.lastPrice,
    percentage: 0,
    recurring: false,
  }));

  const handleChange = useCallback((event) => {
    const {name, value, checked} = event.target;

    switch (name) {
      case 'percentage':
        setState((prev) => ({
          ...prev,
          percentage: value,
          targetPrice:
            value === 0
              ? price.lastPrice
              : round(price.lastPrice * (1 + value / 100), 2),
        }));
        break;
      case 'price':
        setState((prev) => ({
          ...prev,
          percentage: (Math.max(Number(value), 0) / price.lastPrice - 1) * 100,
          targetPrice: Math.max(Number(value), 0),
        }));
        break;
      case 'recurring':
        setState((prev) => ({...prev, recurring: checked}));
        break;
    }
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        createAlert(asset, state);
      }}
    >
      <Stack gap={6}>
        <Box sx={{mt: 12, mx: 8}}>
          <PercentageSlider
            name="percentage"
            value={state.percentage}
            min={-25}
            max={+25}
            step={1}
            onChange={handleChange}
          />
        </Box>
        <TextField
          type="number"
          name="price"
          label="Target price"
          value={state.targetPrice}
          autoComplete="off"
          onChange={handleChange}
          sx={{width: 150, margin: 'auto'}}
        />
        <FormControlLabel
          label="Recurring"
          labelPlacement="end"
          control={
            <Checkbox
              name="recurring"
              checked={state.recurring}
              onChange={handleChange}
            />
          }
          sx={{margin: 'auto'}}
        />
        <Stack direction="row" justifyContent="end">
          <BusyButton type="submit" color="primary" busy={isInFlight}>
            save
          </BusyButton>
        </Stack>
      </Stack>
    </form>
  );
};

const useDeleteAlert = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation AlertsActionsDAMutation($input: DeleteAlertInput!) {
      deleteAlert(input: $input) {
        deletedAlert {
          asset {
            hasAlerts
          }
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}, {id: alertId}) => {
      commit({
        variables: {input: {alertId}},
        optimisticUpdater(store) {
          const asset = store.get(id);

          if (asset) {
            const alerts = ConnectionHandler.getConnection(
              asset,
              'AlertsActions_alerts',
            );

            if (alerts) {
              ConnectionHandler.deleteNode(alerts, alertId);

              if (!alerts.getLinkedRecords('edges').length) {
                asset.setValue(false, 'hasAlerts');
              }
            }
          }
        },
        updater(store) {
          const asset = store.get(id);

          if (asset) {
            const alerts = ConnectionHandler.getConnection(
              asset,
              'AlertsActions_alerts',
            );

            if (alerts) {
              ConnectionHandler.deleteNode(alerts, alertId);
            }
          }
        },
        onCompleted() {
          console.log(`alert deleted for ${symbol}`);
        },
        onError() {
          console.log(
            `there was a problem while deleting an alert for ${symbol}`,
          );
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

export const DeleteAlert = ({fragmentRef}) => {
  const {data, hasNext, loadNext, isLoadingNext} = usePaginationFragment(
    graphql`
      fragment AlertsActionsDAFragment_asset on Asset
      @argumentDefinitions(
        cursor: {type: "String"}
        count: {type: "Int", defaultValue: 5}
      )
      @refetchable(queryName: "AlertsActionRefetchableField") {
        symbol
        alerts(after: $cursor, first: $count)
          @connection(key: "AlertsActions_alerts") {
          edges {
            node {
              id
              currency
              targetPrice
              percentageChange
              recurring
            }
          }
        }
      }
    `,
    fragmentRef,
  );
  const alerts = data.alerts?.edges;

  const [deleteAlert] = useDeleteAlert();

  return alerts?.length || hasNext ? (
    <Table size="medium">
      <TableBody>
        {alerts.map(({node}) => (
          <TableRow key={node.id} tabIndex={-1} hover>
            <TableCell>1 {data.symbol}</TableCell>
            <TableCell align="center">
              {inequality(node.percentageChange)}
            </TableCell>
            <TableCell align="right" sx={{width: 'auto', fontWeight: 600}}>
              {formatCurrency(node.targetPrice, {currency: node.currency})}
            </TableCell>
            <TableCell align="right" sx={{width: 46, paddingLeft: 0}}>
              <IconButton
                size="small"
                aria-label="remove alert"
                onClick={() => {
                  deleteAlert(data, {id: node.id});
                }}
              >
                <CancelIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {hasNext && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} align="center">
              <LoadMoreButton busy={isLoadingNext} onClick={loadNext} />
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  ) : (
    <NoData />
  );
};
