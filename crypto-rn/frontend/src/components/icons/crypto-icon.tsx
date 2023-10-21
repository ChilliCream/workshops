import React from 'react';

import {Avatar, type AvatarProps} from '../core';
import {CurrencyIcon} from './currency-icon';

type CryptoIconProps = AvatarProps;

export const CryptoIcon: React.FC<CryptoIconProps> = (props) => (
  <Avatar {...props}>
    {!props.src && <CurrencyIcon width={32} height={32} />}
  </Avatar>
);
