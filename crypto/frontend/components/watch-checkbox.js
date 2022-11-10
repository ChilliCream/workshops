import {Checkbox} from '@mui/material';

import {WatchIcon, WatchedIcon} from '@/icons';

export const WatchCheckbox = (props) => (
  <Checkbox
    color="primary"
    icon={<WatchIcon />}
    checkedIcon={<WatchedIcon />}
    inputProps={{
      'aria-label': 'watch',
    }}
    {...props}
  />
);
