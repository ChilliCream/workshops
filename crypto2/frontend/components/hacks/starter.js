/**
 * Registers a service worker.
 *
 * **Important**: The registration of SW with a `fetch` event handler are are among the mimimum requirements of a PWA.
 * At scale a solution like `Workbox` is more appropriate, visit [Learn PWA](https://web.dev/learn/pwa/).
 */
export const Starter = () => (
  <script
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
`,
    }}
  />
);
