import {Checkbox} from '@mui/material';

import {WatchedIcon, WatchIcon} from '@/icons';

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
