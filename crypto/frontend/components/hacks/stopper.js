/**
 * Prevents errors caught by error boundaries from reaching the obtrusive Next.js error overlay.
 *
 * **Important**: It must be placed before `NextScript` because event listeners run in the order of registration.
 */
export const Stopper = () => (
  <script
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `
window.addEventListener('error', (event) => {
  event.stopImmediatePropagation();

  if (event.error._suppressLogging) {
    event.preventDefault();
  }
});
`,
    }}
  />
);
