import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/colors';

const Card = ({ 
  children, 
  style, 
  padding = 'medium',
  shadow = 'medium',
  ...props 
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: SPACING.sm };
      case 'medium':
        return { padding: SPACING.md };
      case 'large':
        return { padding: SPACING.lg };
      default:
        return { padding: SPACING.md };
    }
  };

  const getShadowStyle = () => {
    switch (shadow) {
      case 'none':
        return {};
      case 'small':
        return SHADOWS.small;
      case 'medium':
        return SHADOWS.medium;
      case 'large':
        return SHADOWS.large;
      default:
        return SHADOWS.medium;
    }
  };

  return (
    <View 
      style={[
        styles.card,
        getPaddingStyle(),
        getShadowStyle(),
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
});

export default Card;
