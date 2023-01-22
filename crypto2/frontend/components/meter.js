import {Box, LinearProgress} from '@mui/material';

import {formatPercent} from '@/utils';

export const Meter = ({value}) => {
  const buy = value >= 0.5;
  const sell = !buy;
  const relative = buy ? value : 1 - value;
  const absolute = relative * 100;
  const percent = formatPercent(relative, {
    minimumFractionDigits: 0,
    signDisplay: 'never',
  });

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
      {buy && <span>{percent} buy</span>}
      <LinearProgress
        variant="determinate"
        color="inherit"
        value={absolute}
        sx={{
          position: 'sticky',
          direction: 'rtl',
          flex: 1,
          color: buy ? 'trend.positive' : 'trend.negative',
          transform: sell && 'rotate(180deg)',
        }}
      />
      {sell && <span>{percent} sell</span>}
    </Box>
  );
};
