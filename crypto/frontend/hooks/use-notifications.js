import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const Status = {
  ON: 'on',
  OFF: 'off',
};

export const useNotifications = () => {
  const router = useRouter();
  const [active, setActive] = useState(
    () => router.query.notifications === Status.ON,
  );

  const handler = (next) => () => {
    setActive(next === Status.ON);
  };

  const show = handler(Status.ON);
  const hide = handler(Status.OFF);

  useEffect(() => {
    router.events.on('routeChangeStart', hide);
  }, []);

  return {active, show, hide};
};
