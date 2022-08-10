import {useRouter} from 'next/router';
import {useEffect, useMemo, useRef} from 'react';

/**
 * React effectful hook which saves and restore the scroll position on navigation.
 *
 * @example
 * const MyComponent = ({children}) => {
 *   const [scrollRef] = useScrollRestore();
 *
 *   return <div ref={scrollRef}>{children}</div>
 * };
 */
export const useScrollRestore = () => {
  const targetRef = useRef(null);
  const router = useRouter();

  const cache = useMemo(() => new Map(), []);
  const lastVisited = useRef(router.asPath);

  useEffect(() => {
    const saveScroll = (path, {shallow}) => {
      if (targetRef.current && !shallow) {
        cache.set(lastVisited.current, [
          targetRef.current.scrollLeft,
          targetRef.current.scrollTop,
        ]);

        lastVisited.current = path;
      }
    };

    const restoreScroll = (path, {shallow}) => {
      if (targetRef.current && !shallow) {
        const [x, y] = cache.get(path) ?? [0, 0];

        targetRef.current.scrollTo(x, y);
      }
    };

    router.events.on('routeChangeStart', saveScroll);
    router.events.on('routeChangeComplete', restoreScroll);

    return () => {
      router.events.off('routeChangeStart', saveScroll);
      router.events.off('routeChangeComplete', restoreScroll);
    };
  }, []);

  return [targetRef];
};
