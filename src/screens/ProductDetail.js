import React from 'react';
import {SafeAreaView, View, Text, useWindowDimensions, StyleSheet} from 'react-native';
import Colors from '../utils/Colors';
import MapView, {Marker} from 'react-native-maps';

const ProductDetail = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const {product} = route.params;


  return (
    <SafeAreaView
      style={styles.container}>
      <MapView
        style={{width: width - 20, height: width * 0.6}}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title={'You location'}
          pinColor={Colors.Primary}
        />
      </MapView>
    </SafeAreaView>
  );
};
const styles=StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.White,
  }
})
export default ProductDetail;
