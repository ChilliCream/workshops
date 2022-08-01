import {Viewer} from '@/scenes';

export default function Currencies({symbol}) {
  return <Viewer symbol={symbol} />;
}

Currencies.getInitialProps = ({query: {symbol}}) => ({symbol});
