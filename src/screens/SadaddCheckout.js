import {WebView} from 'react-native-webview';
import React, {createRef, useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Api from '../utils/Api';
import Loader from '../components/Loader';
import {hp, wp} from '../components/Responsive';
import Colors from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';

function SadaddCheckout({navigation, route}) {
  const [modal, setModal] = React.useState(false);
  const [modalb, setModalb] = React.useState(false);
  const webRef = createRef(null);
  const url = route?.params?.url
    ? route?.params?.url
    : route?.params?.params?.url;
  return (
    <View
      style={{
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'BookingsStack'}, {name: 'BookingsStack'}],
            }),
          )
        }
        style={styles.goBack}>
        <Ionicons name="chevron-back" size={24} color={'#fff'} />
      </TouchableOpacity>
      <WebView
        ref={webRef}
        source={{
          uri: url,
        }}
        onNavigationStateChange={item => {
          if (item.url.includes('payment-success')) {
            setModal(true);
          } else if (item.url.includes('payment-failed')) {
            setModalb(true);
          }
        }}
      />

      <Modal
        visible={modal}
        transparent={true}
        animationType="slide"
        style={{
          alignSelf: 'center',
        }}>
        <View style={styles.thankuModal}>
          {/* <Image style={styles.thankuImg} source={Thanku} /> */}
          <Text style={{color: 'black', fontSize: wp(4), marginTop: wp(5)}}>
            Thank You For Your Payment
          </Text>
          <Text
            style={{
              color: Colors.Gray,
              fontSize: wp(4),
              fontWeight: '600',
            }}></Text>
          <TouchableOpacity
            onPress={() => {
              setModal(false);
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{name: 'BookingsStack'}, {name: 'BookingsStack'}],
                }),
              );
              // route?.params?.path
              //   ? navigation.dispatch(
              //       CommonActions.reset({
              //         index: 1,
              //         routes: [
              //           {
              //             name: route?.params?.path,
              //           },
              //         ],
              //       }),
              //     )
              //   : navigation.goBack();
            }}
            style={styles.thankuBtn}>
            <Text>Back </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={modalb}
        transparent={true}
        animationType="slide"
        style={{
          alignSelf: 'center',
        }}>
        <View style={styles.thankuModal}>
          {/* <Image style={styles.thankuImg} source={Thanku} /> */}
          <Text style={{color: 'black', fontSize: wp(4), marginTop: wp(5)}}>
            Payment Failed Kindly try again
          </Text>
          <Text
            style={{
              color: Colors.Gray,
              fontSize: wp(4),
              fontWeight: '600',
            }}></Text>
          <TouchableOpacity
            onPress={() => {
              setModalb(false);
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{name: 'BookingsStack'}, {name: 'BookingsStack'}],
                }),
              );
            }}
            style={styles.thankuBtn}>
            <Text>Back </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  lottie: {
    width: wp(80),
    height: wp(80),
  },
  thankuModal: {
    width: wp(70),
    height: wp(70),
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: hp(28),
    alignSelf: 'center',
    elevation: 5,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: Colors.Primary,
  },
  thankuImg: {
    flex: 0.7,
    resizeMode: 'contain',
  },
  thankuBtn: {
    backgroundColor: Colors.LightGray,
    height: wp(11),
    width: wp(40),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(7),
  },
  goBack: {
    position: 'absolute',
    zIndex: 1,
    top: hp(3.5),
    left: wp(8),
    backgroundColor: '#000',
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SadaddCheckout;
