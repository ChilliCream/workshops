import {Tooltip} from '@mui/material';

import {InfoIcon} from '@/icons';

export const InfoText = ({children}) => (
  <Tooltip
    title={children}
    arrow
    componentsProps={{
      tooltip: {
        sx: {
          maxWidth: 200,
          paddingY: 2,
          paddingX: 3,
          borderRadius: 2,
        },
      },
    }}
  >
    <InfoIcon fontSize="inherit" />
  </Tooltip>
);
