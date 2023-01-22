import {Checkbox} from '@mui/material';

import {AlertActiveIcon, AlertIcon} from '@/icons';

export const AlertCheckbox = (props) => (
  <Checkbox
    color="primary"
    icon={<AlertIcon />}
    checkedIcon={<AlertActiveIcon />}
    indeterminateIcon={<AlertIcon />}
    inputProps={{
      'aria-label': 'alert',
    }}
    {...props}
  />
);
