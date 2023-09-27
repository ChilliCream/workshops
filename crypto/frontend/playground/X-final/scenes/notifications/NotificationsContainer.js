import {Stack} from '@mui/material';
import {memo} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import NotificationsList from './NotificationsList';

export default memo(function NotificationsContainer({cacheBuster}) {
  const data = useLazyLoadQuery(
    graphql`
      query NotificationsContainerQuery {
        ...NotificationsListFragment_query
      }
    `,
    {},
    {
      fetchKey: cacheBuster,
      fetchPolicy: 'network-only',
    },
  );

  return (
    <Stack gap={2}>
      <NotificationsList fragmentRef={data} />
    </Stack>
  );
});
