import {Alerts} from '@/scenes';

export default function Currencies({symbol}) {
  return <Alerts symbol={symbol} />;
}

Currencies.getInitialProps = ({query: {symbol}}) => ({symbol});
