import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import Constants from '../utils/Constants';

const Button = props => {
  const {
    label,
    style,
    outline,
    onPress,
    leftIcon,
    rightIcon,
    loading,
    secondary,
  } = props;
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      style={[
        style,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
          borderWidth: 1,
          borderColor: secondary ? Colors.Secondary : Colors.Gray,
          borderRadius: 10,
          padding: 10,
          backgroundColor: secondary
            ? Colors.Secondary
            : outline
            ? Colors.White
            : Colors.Black,
        },
      ]}>
      {leftIcon && (
        <Ionicons
          name="chevron-back"
          color={outline ? Colors.Gray : Colors.White}></Ionicons>
      )}
      <Text style={{color: outline ? Colors.Black : Colors.White}}>
        {label}
      </Text>
      {rightIcon && (
        <Ionicons
          name="chevron-forward"
          color={outline ? Colors.Black : Colors.White}></Ionicons>
      )}
      {loading && (
        <ActivityIndicator color={outline ? Colors.Black : Colors.White} />
      )}
    </TouchableOpacity>
  );
};

export default Button;
