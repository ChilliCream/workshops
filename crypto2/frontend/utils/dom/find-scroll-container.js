/**
 * Finds the nearest ancestor element that is scrollable in any direction.
 *
 * @example
 * findScrollContainer(document.querySelector('#foo'));
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export const findScrollContainer = (element) => {
  if (getComputedStyle(element).position !== 'fixed') {
    let parent = element.parentElement;

    while (parent) {
      if (/(auto|scroll)/.test(getComputedStyle(parent).overflow)) {
        return parent;
      }

      parent = parent.parentElement;
    }
  }

  return document.scrollingElement;
};
