import React from 'react';
import {Image, View} from 'react-native';
import {wp, hp} from './Responsive';
import Images from '../utils/Images';
function Loader() {
  return (
    <View
      style={{
        backfaceVisibility: 'visible',
        alignSelf: 'center',
        width: wp(100),
        height: hp(100),
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.6)',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          height: hp(70),
          width: wp(80),
        }}
        source={Images.wheel}
      />
    </View>
  );
}

export default Loader;
