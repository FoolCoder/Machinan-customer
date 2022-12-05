import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../components/Button';
import Input from '../components/Input';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import Images from '../utils/Images';
import DeviceInfo from 'react-native-device-info';
import Api from '../utils/Api';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import RNRestart from 'react-native-restart';
import {setUserInfo} from '../redux/reducer';
import {hp} from '../components/Responsive';
import AlertModal from '../components/AlertModal';
import Loader from '../components/Loader';

const CreateAccount = ({navigation}) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');

  const [loading, setLoading] = useState(false);
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const createAccount = () => {
    if (name == '') {
      setStatus('Failure');
      setScreen('');
      setMalert('Name field is required');
      setModalVisible(true);
      return;
    }
    if (email == '') {
      setStatus('Failure');
      setScreen('');
      setMalert('Email field is required');
      setModalVisible(true);
      return;
    }
    if (phone == '') {
      setStatus('Failure');
      setScreen('');
      setMalert('Phone field is required');
      setModalVisible(true);
      return;
    }
    setLoading(true);
    Api.createAccount(
      name,
      email,
      '+' + selectedCountry?.callingCode + phone,
      DeviceInfo.getUniqueId(),
      Platform.OS,
    )
      .then(res => {
        if (res.response == 101) {
          dispatch(setUserInfo({token: res.data.token}));
          setLoading(false);
          setStatus('Successful');
          setScreen('screen');
          setMalert(res.message);
          setModalVisible(true);
        }
        if (res.response == 102) {
          setLoading(false);
          setStatus('Failure');
          setScreen('');
          setMalert('Email or Phone already exist');
          setModalVisible(true);
        }
      })
      .catch(e => {
        setLoading(false);
        setStatus('Failure');
        setScreen('');
        setMalert('Device already regitered or Network Error');
        setModalVisible(true);
        console.log('This is error', e);
      });
  };

  const AlertNav = () => {
    RNRestart.Restart();
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ?? 'padding'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}>
              <Ionicons name="chevron-back" color={Colors.White} size={20} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
          </View>

          <ScrollView
            style={{
              flex: 1,
              margin: 10,
              marginTop: Global.SCREEN_HEIGHT * 0.05,
            }}
            showsVerticalScrollIndicator={false}>
            <View>
              <Text style={{fontWeight: 'bold'}}>
                Name<Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="First Name"
                containerStyle={{marginTop: 3}}
                error=""
                value={name}
                onChangeText={setName}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                Email Address
                <Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="Surname"
                containerStyle={{marginTop: 3}}
                error=""
                value={email}
                onChangeText={setEmail}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                Phone<Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <View style={styles.ccInput}>
                <View style={styles.ccPicker}>
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
          </ScrollView>

          <Text style={{margin: 10, alignSelf: 'center', textAlign: 'center'}}>
            By registering your account you agree to our{' '}
            <Text style={styles.terms}>terms {'&'} conditions</Text> and{' '}
            <Text style={styles.terms}>privacy policy</Text>
          </Text>

          <View style={{margin: 20}}>
            <Button
              label="Create"
              onPress={() => createAccount()}
              style={{}}></Button>
            {/* <Text style={{ alignSelf: 'center', marginTop: 10 }}>Already have a account? <Text onPress={() => navigation.navigate('Login')} style={{ fontWeight: 'bold', color: Colors.Primary }}>Login</Text></Text> */}
          </View>
          <AlertModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            msg={malert}
            navigation={AlertNav}
            status={status}
            screen={screen}
          />
          {loading && <Loader />}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    backgroundColor: Colors.Black,
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 10,
  },
  title: {
    color: Colors.Black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  ccPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  ccInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.Gray,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 3,
    paddingHorizontal: 10,
  },
  terms: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: Colors.Black,
  },
});
export default CreateAccount;
