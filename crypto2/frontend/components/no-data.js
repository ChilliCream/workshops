import {Typography} from '@mui/material';
import {forwardRef} from 'react';

export const NoData = forwardRef(function NoDate(
  {message = 'No data available.', ...rest},
  ref,
) {
  return (
    <Typography
      ref={ref}
      component="div"
      variant="body2"
      align="center"
      p={4}
      children={message}
      {...rest}
    />
  );
});
