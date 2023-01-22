import {useRouter} from 'next/router';
import {useEffect} from 'react';

/**
 * Client-side navigation. For development purposes only.
 *
 * @example
 * <Redirect url={{pathname: '/foo', query: {bar: 'on'}}} />;
 */
export const Redirect = ({url, as, options}) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(url, as, options);
  }, [url, as, options]);

  return null;
};
