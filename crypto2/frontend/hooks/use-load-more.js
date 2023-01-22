import {useCallback, useRef} from 'react';

import {findScrollContainer} from '@/utils';

import {useIntersectionObserver} from './use-intersection-observer';

/**
 * React layout hook that tracks the visibility of a HTML element.
 *
 * @example
 * const MyComponent = () => {
 *   const [loaderRef, loadMore] = useLoadMore(() => {
 *     if (!isLoadingNext) {
 *       loadNext();
 *     }
 *   }, [isLoadingNext, loadNext]);
 *
 *   return (
 *     <div>
 *       <div>1</div>
 *       <div>2</div>
 *       <div>3</div>
 *       ...
 *       <div>
 *         <button ref={loaderRef} onClick={loadMore}>load more</button>
 *       </div>
 *     </div>
 *   );
 * };
 */
export const useLoadMore = (callback, deps) => {
  const loadMore = useCallback(callback, deps);

  const targetRef = useRef(null);
  const containerRef = useRef();
  const cbRef = useRef(loadMore);
  const autoRef = useRef(null);

  if (cbRef.current !== loadMore) {
    autoRef.current = null;
    cbRef.current = loadMore;
  }

  useIntersectionObserver(targetRef, (entries) => {
    if (targetRef.current) {
      if (!containerRef.current) {
        containerRef.current = findScrollContainer(targetRef.current);
      }

      const reached = entries.some((entry) => entry.isIntersecting);

      if (reached) {
        if (!autoRef.current) {
          autoRef.current =
            targetRef.current.offsetTop > containerRef.current.offsetHeight;
        }

        if (autoRef.current) {
          cbRef.current();
        }
      }
    }
  });

  return [targetRef, loadMore, containerRef];
};
