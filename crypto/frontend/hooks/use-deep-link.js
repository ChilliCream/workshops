import {useRouter} from 'next/router';

const Status = {
  ON: 'on',
  OFF: 'off',
};

export const useDeepLink = (key) => {
  const router = useRouter();

  const {pathname, query} = router;
  const active = query[key] === Status.ON;

  const handler = (next) => () => {
    const q = {...query, [key]: next};

    if (next === Status.OFF) {
      delete q[key];
    }

    router.replace({pathname, query: q}, undefined, {
      shallow: true,
    });

    router.changeState;
  };

  const show = handler(Status.ON);
  const hide = handler(Status.OFF);

  return {active, show, hide};
};
