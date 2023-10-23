import styled from '@emotion/native';
import React, {useEffect} from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export interface SpinnerProps {
  size?: number;
  spinnerColor?: string;
  innerColor?: string;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Loader = styled(Animated.View)<Required<SpinnerProps>>`
  ${({size, spinnerColor, innerColor}) => `
    height: ${size}px;
    width: ${size}px;
    border-radius: ${size / 2}px;
    border-width: 7px;
    border-top-color: ${innerColor};
    border-right-color: ${innerColor};
    border-bottom-color: ${innerColor};
    border-left-color: ${spinnerColor};
  `}
`;

export const Spinner: React.FC<SpinnerProps> = ({
  size = 60,
  spinnerColor = '#f5f5f5',
  innerColor = '#000',
}) => {
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200,
    );
    return () => cancelAnimation(rotation);
  }, []);

  return (
    <Container>
      <Loader
        size={size}
        spinnerColor={spinnerColor}
        innerColor={innerColor}
        style={animatedStyles}
      />
    </Container>
  );
};
