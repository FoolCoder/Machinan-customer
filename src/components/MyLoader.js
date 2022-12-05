import {ActivityIndicator, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import {hp, wp} from './Responsive';

const MyLoader = () => {
  return (
    <View style={styles.route}>
      <Image
        style={{
          height: hp(70),
          width: wp(80),
        }}
        source={Images.wheel}
      />
    </View>
  );
};

export default MyLoader;

const styles = StyleSheet.create({
  route: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
