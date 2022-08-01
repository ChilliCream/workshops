import {Redirect} from '@/components';

export default function Viewer() {
  return <Redirect url={{pathname: '/currencies/BTC'}} />;
}
