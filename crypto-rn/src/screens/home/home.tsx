import styled from '@emotion/native';
import React from 'react';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTranslation} from '@/translations';

const $SafeAreaView = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const $Text = styled(Text)`
  ${({theme}) => theme.typography.title}
  color: ${({theme}) => theme.pallete.brand.primary};
`;

export const Home: React.FC = () => {
  const {t} = useTranslation();

  return (
    <$SafeAreaView testID="view:home">
      <$Text>{t('home:title')}</$Text>
    </$SafeAreaView>
  );
};
