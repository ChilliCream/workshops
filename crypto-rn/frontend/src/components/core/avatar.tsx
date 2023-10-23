import styled from '@emotion/native';
import React from 'react';
import {Image, View, type ImageProps} from 'react-native';

export type AvatarSize = 'small' | 'medium' | 'large';

export interface AvatarProps {
  size: AvatarSize;
  src?: ImageProps['source'] | string;
}

const getSize = (size: AvatarSize): number =>
  ({
    small: 20,
    medium: 32,
    large: 40,
  })[size];

const Root = styled(View)<{size: AvatarSize}>`
  ${({size}) => `
    width: ${getSize(size)}px;
    height: ${getSize(size)}px;
    border-radius: ${getSize(size) / 2}px;
  `}
`;

export const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> = ({
  size,
  src,
  children,
}) => {
  const source =
    typeof src === 'string' ? {uri: `https:${src.split(':')[1]}`} : src;

  return (
    <Root size={size}>
      {source ? (
        <Image
          style={{width: getSize(size), height: getSize(size)}}
          source={source}
        />
      ) : (
        children
      )}
    </Root>
  );
};
