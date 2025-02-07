import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTouchableOpacityProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  onPress?: () => void;
};

export function ThemedTouchableOpacity({ style, lightColor, darkColor, onPress, ...otherProps }: ThemedTouchableOpacityProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <TouchableOpacity style={[{ backgroundColor }, style]} onPress={onPress} {...otherProps} />;
}
