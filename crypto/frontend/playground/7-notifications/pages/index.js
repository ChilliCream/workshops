import {Redirect} from '@/components';

export default function Notifications() {
  return (
    <Redirect
      url={{
        pathname: '/notifications',
        query: {notifications: 'on'},
      }}
    />
  );
}
