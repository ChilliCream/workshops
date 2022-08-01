import {Redirect} from '@/components';

export default function Alerts() {
  return (
    <Redirect url={{pathname: '/currencies/BTC', query: {alerts: 'on'}}} />
  );
}
