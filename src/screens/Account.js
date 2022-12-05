import React, {useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  LogBox,
  ActivityIndicator,
  PermissionsAndroid,
  PanResponder,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import Images from '../utils/Images';
import Button from '../components/Button';
import Global from '../utils/Global';
import Colors from '../utils/Colors';
import Constants from '../utils/Constants';
import Api from '../utils/Api';
import RNRestart from 'react-native-restart';
import auth from '@react-native-firebase/auth';
import {hp, wp} from '../components/Responsive';
import {
  removeCoustmer,
  removeUser,
  setCoustmer,
  setUserInfo,
} from '../redux/reducer';
import AlertModal from '../components/AlertModal';
import Loader from '../components/Loader';
import {CommonActions} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

LogBox.ignoreAllLogs();
const Account = ({navigation}) => {
  const dispatch = useDispatch();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Coustmer} = dashboardReducer;
  const [imageOptionsModal, setImageOptionsModal] = useState(false);
  const [photoUri, setPhotoUri] = useState('');
  const [image, setImage] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    if (userInfo == null) {
      return;
    }

    // resetInactivityTimeout()
  }, []);

  const openGallery = async (item, index) => {
    const img = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      forceJpg: true,
      width: 300,
      height: 300,
      compressImageQuality: 0.5,
    });
    setPhotoUri(img.path);
    setImageOptionsModal(false);
    // setImage(img);
    let photo = {
      uri: Platform.OS === 'ios' ? `file:///${img.path}` : img.path,
      type: img.mime,
      name:
        Platform.OS === 'ios'
          ? img['filename']
          : `my_profile_${Date.now()}.${
              img['mime'] === 'image/jpeg' ? 'jpg' : 'png'
            }`,
      size: img.size,
    };
    updateprofile(Coustmer?.pay_from_wallet, photo);
    //savePicture(img);

    // const uri = await ImgToBase64.getBase64String(img.path);
    // setList(st => st.map((e, i) => (i == index ? { ...e, uri: uri } : e)))
    // setSelectedImage(uri)
  };
  const openCamera = async (item, index) => {
    const img = await ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      forceJpg: true,

      width: 300,
      height: 300,
      compressImageQuality: 0.5,
    });
    setPhotoUri(img.path);
    setImageOptionsModal(false);
    // setImage(img);
    let photo = {
      uri: Platform.OS === 'ios' ? `file:///${img.path}` : img.path,
      type: img.mime,
      name:
        Platform.OS === 'ios'
          ? img['filename']
          : `my_profile_${Date.now()}.${
              img['mime'] === 'image/jpeg' ? 'jpg' : 'png'
            }`,
      size: img.size,
    };
    updateprofile(Coustmer?.pay_from_wallet, photo);
    // savePicture(img);

    // const uri = await ImgToBase64.getBase64String(img.path);
    // setList(st => st.map((e, i) => (i == index ? { ...e, uri: uri } : e)))
    // setSelectedImage(uri)
  };

  const updateprofile = (pay, photo) => {
    setLoading(true);

    Api.UpdateProfile(userInfo.token, photo, pay)
      .then(res => {
        if (res.response == 101) {
          dispatch(setCoustmer(res.data));
          setLoading(false);
        }
      })
      .catch(e => {
        Alert.alert('Machinan', 'Network Error');
        setLoading(false);
      });
  };
  const AlertNav = async () => {
    setLoading(true);
    await auth()
      .signOut()
      .then(() => {
        dispatch(removeCoustmer());
        dispatch(removeUser());
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e);
      });
  };

  if (userInfo == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginModal}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            You are not logged in
          </Text>
          <Text style={{marginTop: 10}}>
            Please create account or login to see Account
          </Text>

          <Button
            label={'Login'}
            onPress={() => navigation.navigate('Register')}
            style={{marginTop: 30}}></Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {Constants.IS_ANDROID ? (
        <StatusBar
          backgroundColor={Colors.Primary}
          barStyle={'light-content'}
        />
      ) : (
        <SafeAreaView>
          <StatusBar barStyle={'dark-content'} />
        </SafeAreaView>
      )}

      <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setImageOptionsModal(true)}
            style={{
              alignSelf: 'center',
              marginTop: Global.SCREEN_HEIGHT * 0.1,
            }}>
            {Coustmer?.photo || photoUri ? (
              <FastImage
                style={styles.img}
                source={{
                  uri: photoUri ? photoUri : Coustmer?.photo,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Image
                source={Images.Placeholder}
                resizeMode={'contain'}
                style={styles.img}
              />
            )}
            <View style={styles.edit} onPress={() => navigation.pop()}>
              <Feather name={'edit-2'} color={Colors.White} size={12} />
            </View>
          </TouchableOpacity>

          <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 10}}>
            {Coustmer?.name}
          </Text>
          <Text style={{}}>{Coustmer?.phone}</Text>
        </View>

        <ScrollView style={{marginTop: Global.SCREEN_HEIGHT * 0.1}}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 1,
              //     routes: [
              //       {name: 'AccountStack'},
              //       {
              //         name: 'Register',
              //       },
              //     ],
              //   }),
              // );
              Alert.alert('Machinan', 'Feature coming soon');
              // navigation.navigate('UpdatePassword')
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'lock'} size={16} color={Colors.Primary} />
              <Text style={{paddingLeft: 10}}>Update Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              // if (userInfo == null) {
              //   Alert.alert('Machinan', 'You need to login first', [
              //     {
              //       text: 'Login',
              //       onPress: () => navigation.navigate('Register'),
              //     },
              //     {text: 'Cancel'},
              //   ]);
              //   return;
              // }
              navigation.navigate('Notifications');
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'bell'} size={16} color={Colors.Primary} />
              <Text style={{paddingLeft: 10}}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            disabled={true}
            onPress={() => {
              // if (userInfo == null) {
              //   Alert.alert('Machinan', 'You need to login first', [
              //     {
              //       text: 'Login',
              //       onPress: () => navigation.navigate('Register'),
              //     },
              //     {text: 'Cancel'},
              //   ]);
              //   return;
              // }
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name={'wallet-outline'}
                size={16}
                color={Colors.Primary}
              />
              <Text style={{paddingLeft: 10}}>Wallet Pay</Text>
            </View>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={
                Coustmer?.pay_from_wallet ? Colors.Primary : Colors.Black
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                // setIsEnabled(!Coustmer?.pay_from_wallet);
                updateprofile(!Coustmer?.pay_from_wallet, null);
              }}
              value={Coustmer?.pay_from_wallet}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              setModalVisible(true);
              setMalert('Are you sure you want to logout?');
              setStatus('Successful');
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'log-out'} size={16} color={Colors.Primary} />
              <Text style={{paddingLeft: 10}}>Logout</Text>
            </View>
            {/* <Ionicons name='chevron-forward' size={20} /> */}
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => updateprofile()} style={styles.btn}>
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity> */}
        </ScrollView>

        <Modal
          isVisible={imageOptionsModal}
          animationIn="slideInUp"
          coverScreen={true}
          style={{
            margin: 0,
            position: 'absolute',
            bottom: 0,
            width: Global.SCREEN_WIDTH,
          }}
          onBackButtonPress={() => setImageOptionsModal(false)}
          onBackdropPress={() => setImageOptionsModal(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => openCamera()}
              style={{alignItems: 'center', margin: 20}}>
              <FastImage />
              <Image
                source={Images.CameraIcon}
                resizeMode={'contain'}
                style={styles.modalimg}
              />
              <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                From Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openGallery()}
              style={{alignItems: 'center', margin: 20}}>
              <Image
                source={Images.GalleryIcon}
                resizeMode={'contain'}
                style={styles.modalimg}
              />
              <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                From Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <AlertModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          msg={malert}
          status={status}
          screen={screen}
          navigation={AlertNav}
        />
      </SafeAreaView>
      {loading && <Loader />}
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  loginModal: {
    marginTop: Global.SCREEN_HEIGHT * 0.2,
    margin: 10,
    backgroundColor: Colors.White,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loginbtn: {
    backgroundColor: Colors.Primary,
    width: wp(85),
    alignSelf: 'center',
    marginTop: hp(5),
    height: hp(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.DarkerOpacity,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 5,
    borderColor: Colors.Primary,
  },
  edit: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.Gray,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: Colors.Gray,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalimg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.White,
  },
  btn: {
    alignSelf: 'center',
    marginTop: hp(10),
    width: wp(85),
    height: hp(6),
    borderRadius: hp(6) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
