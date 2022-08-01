import {Badge, IconButton, Portal, Tooltip} from '@mui/material';
import {memo, useMemo, useState} from 'react';
import {graphql, useSubscription} from 'react-relay';

import {useSlots} from '@/hooks';
import {NotificationsIcon} from '@/icons';

export default memo(function NotificationsManager({onClick}) {
  const [unread, setUnread] = useState(0);

  const {menubar: menubarRef} = useSlots();

  useSubscription(
    useMemo(
      () => ({
        subscription: graphql`
          subscription NotificationsManagerSubscription {
            onNotification {
              unreadNotifications
              notification {
                asset {
                  hasAlerts
                }
              }
            }
          }
        `,
        variables: {},
        updater(store) {
          store
            .getRoot()
            .getLinkedRecord('me')
            ?.getLinkedRecord('notifications')
            ?.invalidateRecord();
        },
        onNext(response) {
          setUnread(response.onNotification.unreadNotifications);
        },
      }),
      [],
    ),
  );

  return (
    <Portal container={menubarRef.current}>
      <Tooltip title="Notifications">
        <IconButton aria-label="notifications" size="small" onClick={onClick}>
          <Badge
            variant="dot"
            color="primary"
            overlap="circular"
            invisible={!unread}
          >
            <NotificationsIcon fontSize="inherit" />
          </Badge>
        </IconButton>
      </Tooltip>
    </Portal>
  );
});
