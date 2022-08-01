import {Starter} from './starter';
import {Stopper} from './stopper';

export const Hacks = () => (
  <>
    {process.env.NODE_ENV === 'development' && <Stopper />}
    <Starter />
  </>
);
