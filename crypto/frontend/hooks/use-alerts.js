import {useRouter} from 'next/router';

const Status = {
  ON: 'on',
  OFF: 'off',
};

export const useAlerts = () => {
  const router = useRouter();

  const {pathname, query} = router;
  const active = query.alerts === Status.ON;

  const handler = (alerts) => () => {
    const q = {...query, alerts};

    if (alerts === Status.OFF) {
      delete q.alerts;
    }

    router.replace({pathname, query: q}, undefined, {shallow: true});
  };

  const show = handler(Status.ON);
  const hide = handler(Status.OFF);

  return {active, show, hide};
};
