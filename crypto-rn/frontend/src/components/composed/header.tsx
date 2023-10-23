import styled from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {memo} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {RootStack} from '@/root';

import {AppIcon, BackIcon, DashboardIcon, ScreenerIcon} from '../icons';

const ICON_SIZE = 24;

interface HeaderProps {
  back?: boolean;
}

const Root = styled(View)`
  width: 100%;
  height: 80px;
  padding: 8px 16px;
  justify-content: flex-end;
  background-color: ${({theme}) => theme.pallete.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.pallete.border.primary};
  border-bottom-style: solid;
`;

const Stack = styled(View)<{distribute?: 'space-between'}>`
  flex-direction: row;
  align-items: center;
  ${({distribute}) => `justify-content: ${distribute}`}
`;

const Gap = styled(View)`
  width: 16px;
  height: 1px;
`;

const $AppIcon = styled(AppIcon)`
  justify-self: flex-end;
`;

export const Header = memo<HeaderProps>(function Header({back}) {
  const {navigate, goBack} =
    useNavigation<NativeStackNavigationProp<RootStack>>();

  return (
    <Root>
      <Stack distribute="space-between">
        <$AppIcon width={ICON_SIZE} height={ICON_SIZE} />
        <Stack>
          {back && (
            <>
              <TouchableOpacity onPress={goBack}>
                <BackIcon width={ICON_SIZE} height={ICON_SIZE} />
              </TouchableOpacity>
              <Gap />
            </>
          )}
          <TouchableOpacity onPress={() => navigate('Home')}>
            <DashboardIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
          <Gap />
          <TouchableOpacity onPress={() => navigate('Screener')}>
            <ScreenerIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
        </Stack>
      </Stack>
    </Root>
  );
});
