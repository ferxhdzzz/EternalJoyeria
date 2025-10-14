import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/colors';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon} 
              size={20} 
              color={isFocused ? COLORS.primary : COLORS.textLight} 
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={toggleSecureEntry}
          >
            <Ionicons 
              name={isSecure ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={COLORS.textLight} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={COLORS.textLight} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.sm,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.sm,
  },
  leftIconContainer: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  rightIconContainer: {
    paddingRight: SPACING.md,
    paddingLeft: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default Input;
