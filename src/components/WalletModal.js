import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {hp, wp} from './Responsive';
import Images from '../utils/Images';
import {useDispatch, useSelector} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import Colors from '../utils/Colors';
import Api from '../utils/Api';
import {useEffect} from 'react';
import {setCoustmer} from '../redux/reducer';
import Loader from './Loader';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WalletModal = ({setModalVisible, modalVisible, navigation, path}) => {
  const dispatch = useDispatch();
  const [pay, setPay] = useState(null);
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Coustmer} = dashboardReducer;
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   Api.getCoustmer(userInfo?.token).then(res => {
  //     if (res.response == 101) {
  //       dispatch(setCoustmer(res.data));
  //     }
  //   });
  // }, [modalVisible]);

  const InitaitePaymet = () => {
    if (pay == null || pay < 50) {
      return Alert.alert(
        'Amount',
        'Please Enter The Amount and Amount must be Greater than 50',
      );
    }
    setLoading(true);
    Api.InitaitePayment(userInfo.token, pay)
      .then(res => {
        if (res.response == 101) {
          navigation.navigate('BookingsStack', {
            screen: 'SadaddCheckout',
            params: {
              url: res?.data?.url,
              path: path,
            },
          });
          setModalVisible(!modalVisible);
          setLoading(false);
        }
      })
      .catch(e => {
        Alert.alert('Error', e);
        setLoading(false);
      });
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={{flex: 1, width: wp(100)}}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
        <View style={styles.modalView}>
          <View style={styles.headerView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Ionicons
                name="chevron-back"
                size={hp(3.2)}
                color={Colors.White}
              />
            </TouchableOpacity>
            <Text
              style={styles.customername}>{`${Coustmer?.name} Wallet`}</Text>

            <View style={styles.backPress} />
          </View>
          <View style={{width: wp(85), marginTop: 20}}>
            <Text style={{...styles.modalText, fontSize: hp(1.8)}}>
              Current balance
            </Text>
            <View style={styles.aligntext}>
              <Text
                style={{
                  ...styles.modalText,
                  marginBottom: -5,
                }}>{`QR.${Coustmer?.wallet_amount}`}</Text>
              <Text style={styles.datetext}>
                {moment(new Date()).format('[Today] D MMM')}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 20,
              }}>
              <Text style={styles.datetext}>{`${Coustmer?.email}`}</Text>
            </View>
          </View>

          <View style={styles.bottomview}>
            <View style={{marginTop: 20}}>
              <Text style={{alignSelf: 'flex-start', fontSize: hp(1.8)}}>
                Add Amount
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="QR. 00"
                style={{...styles.input}}
                onChangeText={val => setPay(val)}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                InitaitePaymet();
              }}>
              <Text style={styles.textStyle}>Add Amount</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {loading && <Loader />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  backPress: {width: 30, height: 30},
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  modalView: {
    width: wp(100),
    height: hp(55),
    backgroundColor: 'black',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerView: {
    width: wp(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customername: {
    fontWeight: 'bold',
    fontSize: hp(2),
    color: 'white',
  },
  aligntext: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bottomview: {
    flex: 1,
    backgroundColor: 'white',
    width: wp(100),
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 15,
    marginVertical: 12,
    width: wp(80),
    height: hp(6),
  },
  button: {
    borderRadius: hp(5) / 2,
    width: wp(49),
    elevation: 2,
    backgroundColor: 'black',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {},
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: hp(4),
    fontWeight: '600',
    marginTop: 5,
    color: 'white',
  },
  datetext: {
    fontSize: hp(1.6),
    color: Colors.LightGray,
    fontWeight: '600',
  },
});

export default WalletModal;
