import {Redirect} from '@/components';

export default function Alerts() {
  return (
    <Redirect
      url={{
        pathname: '/currencies/[symbol]',
        query: {alerts: 'on'},
      }}
      as="/currencies/BTC"
    />
  );
}
