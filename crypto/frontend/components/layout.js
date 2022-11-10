import styled from '@emotion/styled';
import {Divider, Fade, IconButton, Stack, Tooltip} from '@mui/material';
import {useRouter} from 'next/router';
import {useState} from 'react';

import {
  useMode,
  useMutationObserver,
  useScrollRestore,
  useSlots,
} from '@/hooks';
import {
  AppIcon,
  BitcoinIcon,
  CardanoIcon,
  CloseIcon,
  CommandIcon,
  DarkModeIcon,
  DashboardIcon,
  EthereumClassicIcon,
  LightModeIcon,
  MenuIcon,
  ScreenerIcon,
  WatchlistIcon,
} from '@/icons';

import {ErrorBoundary} from './error-boundary';
import {Menu} from './menu';
import {NoSSR} from './no-ssr';

const favorites = [
  ['BTC', BitcoinIcon, 'Bitcoin'],
  ['ETC', EthereumClassicIcon, 'Ethereum Classic'],
  ['ADA', CardanoIcon, 'Cardano'],
];

const Root = styled.div`
  height: 100vh;
  width: 100%;
  min-width: 375px;
  max-width: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 1px 0 0 0 #4a4c50, 0 0 0 100vw #292a2d;
`;

const Menubar = styled(Stack)(
  ({theme}) => `
  height: ${theme.spacing(6.5)};
  padding: ${theme.spacing(1)};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`,
);

const Statusbar = styled(Stack)(
  ({theme}) => `
  height: ${theme.spacing(6.5)};
  padding: ${theme.spacing(1)};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`,
);

const Controlbar = styled(Stack)`
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const Main = styled.div(
  ({theme, variant}) => `
  padding: ${theme.spacing(3)};
  flex: 1;
  display: flex;
  flex-direction: column;
  ${
    variant === 'splash' &&
    `
      align-items: center;
      justify-content: center;
    `
  };
  position: relative;
  overflow: scroll;
`,
);

export const Splash = ({children}) => (
  <Root>
    <Main variant="splash">
      <NoSSR>
        <ErrorBoundary>{children}</ErrorBoundary>
      </NoSSR>
    </Main>
  </Root>
);

const Full = ({children}) => {
  const router = useRouter();
  const {mode, toggleMode} = useMode();
  const {menubar: menubarRef, statusbar: statusbarRef} = useSlots();
  const [command, setCommand] = useState(0);
  const [menu, setMenu] = useState(false);

  useMutationObserver(
    statusbarRef,
    () => {
      setCommand((previous) => {
        const current = Math.sign(statusbarRef.current?.childElementCount ?? 0);

        return current === previous ? previous : current;
      });
    },
    {childList: true},
  );

  const [scrollRef] = useScrollRestore();

  return (
    <Root>
      <Menu
        active={menu}
        close={() => {
          setMenu(false);
        }}
      />
      <Menubar>
        <IconButton
          size="small"
          disableRipple
          onClick={() => {
            router.push('/');
          }}
        >
          <AppIcon fontSize="small" />
        </IconButton>
        <Controlbar ref={menubarRef} />
        <Tooltip title="Mode">
          <IconButton aria-label="mode" size="small" onClick={toggleMode}>
            {mode === 'light' ? (
              <DarkModeIcon fontSize="inherit" />
            ) : (
              <LightModeIcon fontSize="inherit" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Menu">
          <IconButton
            aria-label="menu"
            size="small"
            onClick={() => {
              setMenu(true);
            }}
          >
            <MenuIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Menubar>
      <Divider />
      <Main ref={scrollRef} variant="full">
        <NoSSR>
          <ErrorBoundary>{children}</ErrorBoundary>
        </NoSSR>
      </Main>
      <Divider />
      <Statusbar>
        <Tooltip title="Dashboard">
          <IconButton
            aria-label="dashboard"
            size="small"
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            <DashboardIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Screener">
          <IconButton
            aria-label="screener"
            size="small"
            onClick={() => {
              router.push('/screener');
            }}
          >
            <ScreenerIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Watchlist">
          <IconButton
            aria-label="watchlist"
            size="small"
            onClick={() => {
              router.push('/watchlist');
            }}
          >
            <WatchlistIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        {favorites.map(([symbol, Icon, title]) => (
          <Tooltip key={symbol} title={title}>
            <IconButton
              aria-label={title}
              size="small"
              onClick={() => {
                router.push('/currencies/[symbol]', `/currencies/${symbol}`);
              }}
            >
              <Icon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ))}
        <Fade in={command < 0}>
          <Controlbar ref={statusbarRef} />
        </Fade>
        <Tooltip title="Command">
          <span>
            <IconButton
              aria-label="command"
              size="small"
              disabled={!command}
              onClick={() => {
                setCommand((previous) => previous * -1);
              }}
            >
              {command < 0 ? (
                <CloseIcon fontSize="inherit" />
              ) : (
                <CommandIcon fontSize="inherit" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Statusbar>
    </Root>
  );
};

/**
 * This is an opinionated component just to provide a single layout for the entire app.
 *
 * **Note**: If you need multiple layouts, visit [Per-Page Layouts](https://nextjs.org/docs/basic-features/layouts#per-page-layouts).
 */
export const Layout = ({variant, ...rest}) => {
  const Shell = variant === 'full' ? Full : Splash;

  return <Shell {...rest} />;
};
