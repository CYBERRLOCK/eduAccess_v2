import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from './theme-provider';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight,
  color,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Get font weight based on variant or explicit weight prop
  const getFontWeight = () => {
    if (weight) {
      return weight;
    }
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return 'semiBold';
      case 'subtitle1':
      case 'subtitle2':
        return 'medium';
      case 'button':
        return 'semiBold';
      default:
        return 'regular';
    }
  };

  // Get font size and line height based on variant
  const getTypographyStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 32,
          lineHeight: 40, // 1.25x
          letterSpacing: -0.5,
        };
      case 'h2':
        return {
          fontSize: 28,
          lineHeight: 36, // 1.29x
          letterSpacing: -0.3,
        };
      case 'h3':
        return {
          fontSize: 24,
          lineHeight: 32, // 1.33x
          letterSpacing: -0.2,
        };
      case 'h4':
        return {
          fontSize: 20,
          lineHeight: 28, // 1.4x
          letterSpacing: -0.1,
        };
      case 'subtitle1':
        return {
          fontSize: 18,
          lineHeight: 26, // 1.44x
          letterSpacing: 0,
        };
      case 'subtitle2':
        return {
          fontSize: 16,
          lineHeight: 24, // 1.5x
          letterSpacing: 0,
        };
      case 'body1':
        return {
          fontSize: 16,
          lineHeight: 24, // 1.5x
          letterSpacing: 0.15,
        };
      case 'body2':
        return {
          fontSize: 14,
          lineHeight: 20, // 1.43x
          letterSpacing: 0.25,
        };
      case 'caption':
        return {
          fontSize: 12,
          lineHeight: 16, // 1.33x
          letterSpacing: 0.4,
        };
      case 'button':
        return {
          fontSize: 14,
          lineHeight: 20, // 1.43x
          letterSpacing: 0.1,
          textTransform: 'uppercase' as const,
        };
      default:
        return {
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.15,
        };
    }
  };

  // Get font weight for React Native (using fontWeight instead of fontFamily)
  const getFontWeightStyle = () => {
    const fontWeight = getFontWeight();
    
    switch (fontWeight) {
      case 'regular':
        return { fontWeight: '400' as const };
      case 'medium':
        return { fontWeight: '500' as const };
      case 'semiBold':
        return { fontWeight: '600' as const };
      case 'bold':
        return { fontWeight: '700' as const };
      default:
        return { fontWeight: '400' as const };
    }
  };

  const typographyStyles = getTypographyStyles();
  const fontWeightStyle = getFontWeightStyle();
  const textColor = color || theme.textPrimary;

  return (
    <Text
      style={[
        {
          fontSize: typographyStyles.fontSize,
          lineHeight: typographyStyles.lineHeight,
          letterSpacing: typographyStyles.letterSpacing,
          color: textColor,
          textAlign: align,
          ...fontWeightStyle,
          ...(variant === 'button' && { textTransform: 'uppercase' as const }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Predefined typography components for common use cases
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Subtitle1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="subtitle1" {...props} />
);

export const Subtitle2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="subtitle2" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="button" {...props} />
);

export default Typography; 