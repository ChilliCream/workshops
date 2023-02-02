import {Link} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

import {Typography} from '@/components';

export const Viewer: React.FC = () => (
  <View style={{flex: 1}}>
    <Typography variant="title">VIEW SCREEN</Typography>

    <Link to="/Home">Go Home</Link>
  </View>
);
