import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import Images from '../utils/Images';
import CountryPicker from 'react-native-country-picker-modal';
import Api from '../utils/Api';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import auth from '@react-native-firebase/auth';
import {setCoustmer, setUserInfo} from '../redux/reducer';
import {hp} from '../components/Responsive';
import {CommonActions} from '@react-navigation/native';
import MyLoader from '../components/MyLoader';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';

const Register = ({navigation, route}) => {
  const dispatch = useDispatch();

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: ['974'],
    cca2: 'QA',
    currency: ['QAR'],
    flag: 'flag-qa',
    name: 'Qatar',
    region: 'Asia',
    subregion: 'Western Asia',
  });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  // const [code, setCode] = useState('')
  const [verifyModal, setVerifyModal] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const checkPhone = num => {
    setLoading(true);
    Api.checkPhone(num)
      .then(res => {
        if (res.response == 100) {
          // navigation.navigate('VarifyOTP')
          setLoading(false);
          setStatus('Failure');
          setMalert(res.message + ' First register yourself');
          setModalVisible(true);
          return;
        }
        if (res.response == 101) {
          dispatch(setUserInfo({token: res.data.token}));
          navigation.goBack();

          setLoading(false);
        }
      })
      .catch(e => {
        console.log('Api.CheckPhone', e);
        setLoading(false);
        setStatus('Failure');
        setMalert('Something went wrong, Check your Network');
        setModalVisible(true);
      });
  };
  const sendOtp = () => {
    auth().signOut();
    if (phone == '') {
      setStatus('Failure');
      setMalert('Please enter phone number');
      setModalVisible(true);
      return;
    }

    setLoading(true);

    let num = '+' + selectedCountry?.callingCode + phone;

    signInWithPhoneNumber(num);
  };

  async function signInWithPhoneNumber(phoneNumber) {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setLoading(false);
      setVerifyModal(true);
    } catch (error) {
      console.log(error.code);

      switch (error.code) {
        case 'auth/invalid-phone-number':
          setLoading(false);
          setStatus('Failure');
          setMalert('Incorrect Number');
          setModalVisible(true);
          break;
        case 'auth/network-request-failed':
          setLoading(false);
          setStatus('Failure');
          setMalert('internet Connection Error');
          setModalVisible(true);
          break;
        case 'auth/too-many-requests':
          setLoading(false);
          setStatus('Failure');
          setMalert(
            'Too many OTP requests please check your number or try agin later',
          );
          setModalVisible(true);
          break;
        default:
          setLoading(false);
          break;
      }
    }
  }

  async function confirmCode(code) {
    try {
      setLoading(true);
      const a = await confirm.confirm(code);
      setLoading(false);
    } catch (error) {
      console.log('Error here', error.code);
      setVerifyModal(false);
      setLoading(false);
      setStatus('Failure');
      setMalert('Incorrect OTP');
      setModalVisible(true);
    }
  }

  // async function signInWithPhoneNumber(phoneNumber) {
  //   setLoading(true);
  //   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  //   setConfirm(confirmation);
  //   setVerifyModal(true);
  //   setLoading(false);
  // }

  // async function confirmCode(code) {
  //   setLoading(true);
  //   try {
  //     const a = await confirm.confirm(code);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //   }
  // }

  function onAuthStateChanged(user) {
    if (user) {
      setVerifyModal(false);
      checkPhone(user.phoneNumber);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}>
              <Ionicons name="chevron-back" color={Colors.White} size={20} />
            </TouchableOpacity>
            <View style={styles.numberView}>
              <Image
                source={Images.sendOtp}
                resizeMode={'contain'}
                style={{
                  width: Global.SCREEN_WIDTH * 0.6,
                  height: Global.SCREEN_WIDTH * 0.6,
                }}
              />
              <Text
                style={{
                  marginTop: 30,
                  fontWeight: 'bold',
                  fontSize: 18,
                  maxWidth: '80%',
                }}>
                {'Get In Your Account!'}
              </Text>
              <Text
                style={{
                  marginTop: 30,
                  color: Colors.Gray,
                  maxWidth: '80%',
                  textAlign: 'center',
                }}>
                {
                  'Enter your mobile number to receive a verification code to access your account'
                }
              </Text>

              <View style={styles.cpView}>
                <View style={styles.cp}>
                  <CountryPicker
                    withCallingCode
                    withFlag
                    excludeCountries={['AF']}
                    withFlagButton={true}
                    withCallingCodeButton
                    renderCountryFilter
                    preferredCountries={['US', 'GB', 'NG', 'PK']}
                    countryCode={selectedCountry ? selectedCountry.cca2 : 'QA'}
                    withEmoji
                    onSelect={country => {
                      setSelectedCountry(country);
                    }}
                  />
                  {/* <TouchableOpacity onPress={() => setModalVisibility(true)}><Feather name={'chevron-down'} style={{ paddingLeft: 5, paddingTop: 5 }} color={Colors.Gray} size={20} /></TouchableOpacity> */}
                </View>
                <TextInput
                  placeholder="000 0000 000"
                  keyboardType={'phone-pad'}
                  value={phone}
                  onChangeText={val => setPhone(val)}
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    fontSize: 16,
                    marginTop: 1,
                  }}></TextInput>
              </View>
            </View>
            <View style={{height: hp(10)}} />
            <View style={{margin: 20}}>
              <Button
                label="SEND OTP"
                onPress={() => {
                  // checkPhone('+' + selectedCountry?.callingCode + phone)
                  sendOtp();
                  // navigation.navigate('VarifyOTP')
                }}
                style={{}}></Button>
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: 10,
                  color: Colors.Gray,
                }}>
                Don't have account?{' '}
                <Text
                  onPress={() => navigation.navigate('CreateAccount')}
                  style={{fontWeight: 'bold', color: Colors.Black}}>
                  Register
                </Text>
              </Text>
            </View>
          </KeyboardAwareScrollView>
          <Modal
            isVisible={verifyModal}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            coverScreen={true}
            style={{
              margin: 0,
              width: Global.SCREEN_WIDTH,
              height: '100%',
              flex: 1,
              backgroundColor: Colors.White,
            }}
            onBackButtonPress={() => setVerifyModal(false)}
            onBackdropPress={() => setVerifyModal(false)}>
            <KeyboardAwareScrollView
              style={{flex: 1}}
              // behavior={Platform.OS == 'ios' ?? 'padding'}
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.back}>
                    <Ionicons
                      name="chevron-back"
                      color={Colors.White}
                      size={20}
                    />
                  </TouchableOpacity>
                  <ScrollView>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={Images.varifyOtp}
                        resizeMode={'contain'}
                        style={{
                          width: Global.SCREEN_WIDTH * 0.6,
                          height: Global.SCREEN_WIDTH * 0.6,
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 30,
                          fontWeight: 'bold',
                          fontSize: 18,
                          maxWidth: '80%',
                        }}>
                        {'OTP Verification'}
                      </Text>
                      <Text
                        style={{
                          marginTop: 30,
                          color: Colors.Gray,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        {'We have sent you an OTP on this mobile number'}
                      </Text>
                      <Text
                        style={{
                          marginTop: 20,
                          color: Colors.Gray,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        {'+' + selectedCountry?.callingCode + phone}
                      </Text>
                      <View>
                        <OTPInputView
                          style={{
                            width: 300,
                            height: 80,
                            marginTop: 30,
                            alignSelf: 'center',
                          }}
                          autoFocusOnLoad={false}
                          pinCount={6}
                          editable={true}
                          codeInputFieldStyle={{
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            color: Colors.Black,
                            borderColor: Colors.Gray,
                          }}
                          keyboardAppearance={'default'}
                          codeInputHighlightStyle={{
                            borderColor: Colors.Primary,
                            borderWidth: 1,
                          }}
                          onCodeFilled={code => {
                            confirmCode(code);
                            // if (status == 'updatephone') {
                            //     return
                            // }
                            // navigation.navigate(status)
                          }}
                        />
                      </View>
                      {/* <Text style={{ marginTop: 20, color: Colors.Gray, maxWidth: '80%', textAlign: 'center' }}>{'00:30'}</Text>
                                            <Text style={{ marginTop: 20, color: Colors.Gray, maxWidth: '80%', textAlign: 'center' }}>{'Haven\'t received yet?'}<Text style={{ fontWeight: 'bold' }}> Send Again</Text></Text> */}
                    </View>
                  </ScrollView>

                  {/* <Button
                    label="CONFIRM"
                    onPress={() => {
                      // navigation.navigate('CreateAccount')
                    }}
                    style={{margin: 20}}></Button> */}
                </SafeAreaView>
              </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
          </Modal>
          <AlertModal
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            msg={malert}
            status={status}
            screen={screen}
          />
          {loading && <Loader />}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  back: {
    margin: 20,
    backgroundColor: Colors.Black,
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 10,
  },
  numberView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  cpView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Gray,
    borderWidth: 0.5,
    borderRadius: 10,
    margin: 20,
    paddingHorizontal: 10,
  },
  cp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
export default Register;
