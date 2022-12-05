import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import Colors from '../utils/Colors';
import Global, {latoItalic, latoRegular, latoSemiBold} from '../utils/Global';
import Images from '../utils/Images';
import {useDispatch} from 'react-redux';
import {hp, wp} from '../components/Responsive';
import {default as Ionicons} from 'react-native-vector-icons/Ionicons';
import WalletModal from '../components/WalletModal';
import Api from '../utils/Api';
import {setCoustmer, setUserInfo} from '../redux/reducer';
const Services = ({navigation}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {Services, userInfo, Coustmer} = dashboardReducer;
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const win = Dimensions.get('window');
  const [walletmodal, setwalletModal] = useState(false);
  let values = [];
  // Services.map((item, index) => {
  //   values[index] = new Animated.Value(0);
  // });
  useEffect(() => {
    setValues();
    if (userInfo) {
      // if (Coustmer != null) {
      //   return;
      // }
      Api.UpdateProfile(userInfo?.token, null, null)
        .then(res => {
          if (res.response == 101) {
            dispatch(setCoustmer(res.data));
          }
        })
        .catch(e => console.log(e));
    }
  }, [userInfo?.token, Services]);

  const setValues = () => {
    let c = [];
    Services.map((item, index) => {
      c[index] = true;
    });
    setCollapsed(c);
  };
  const renderServices = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductsListing', {
            serviceId: item.id,
            categoryId: item.categories[0].id,
            serviceName: item.name?.en,
          });
        }}
        key={item.id}>
        <ImageBackground
          style={{
            ...styles.fList,
            height: win.height / 3.2,
            width: win.width / 2.3,
          }}
          source={{uri: item.icon}}>
          <Text style={styles.srname}>
            {item.name?.en.replace(/Service/g, '')}
          </Text>
          <View style={styles.serView}>
            <Text style={{...styles.sTxt, left: 0}}>Service</Text>
            <Text style={styles.cLength}>{item.categories.length}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.White, alignItems: 'center'}}>
      <Text
        style={{
          ...styles.welcomtxt,
          marginTop: hp(2),
          width: wp(92),
        }}>
        Good Morning,
      </Text>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: hp(2.5),
          width: wp(92),
        }}>
        <Text
          style={{
            ...styles.welcomtxt,
            fontSize: 24,
            fontWeight: 'bold',
            width: wp(70),
          }}>
          Welcome Machinan
        </Text>
        {Coustmer && (
          <TouchableOpacity onPress={() => setwalletModal(!walletmodal)}>
            <Ionicons name="md-wallet" size={30} color={Colors.Black} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchView}>
        <Image source={Images.searchicon} style={styles.img} />
        <TextInput
          style={{height: '100%', width: wp(80)}}
          placeholder="Search Services"
        />
      </View>

      <Text style={styles.txt}>Choose the service you need</Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{
          alignSelf: 'center',
        }}
        numColumns={2}
        scrollEnabled
        data={Services}
        extraData={refresh}
        keyExtractor={item => item.id.toString()}
        renderItem={renderServices}
      />
      {walletmodal && (
        <WalletModal
          modalVisible={walletmodal}
          navigation={navigation}
          setModalVisible={setwalletModal}
          path={'Services'}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  welcomtxt: {
    color: Colors.Black,
    fontWeight: '400',
    fontSize: 18,
    fontFamily: latoSemiBold,
  },
  searchView: {
    width: wp(90),
    height: hp(6),
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginBottom: hp(2),
  },
  img: {
    width: 16,
    height: 16,
    marginHorizontal: 8,
  },
  sTxt: {
    color: '#6D6D78',
    fontSize: wp(4.2),
    left: 12,
    fontFamily: latoRegular,
  },
  txt: {
    color: '#000000',
    width: wp(90),
    fontSize: wp(4),
    fontWeight: '600',
    marginVertical: 10,
    marginBottom: hp(3),
    fontFamily: latoRegular,
  },
  fList: {
    // width: wp(45),
    // height: hp(31),
    borderRadius: 11,
    overflow: 'hidden',
    padding: 10,
    resizeMode: 'contain',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  srname: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: wp(4.5),
    fontFamily: latoRegular,
  },
  serView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cLength: {
    color: '#808191',
    fontWeight: 'bold',
    fontSize: wp(4),
    width: 25,
    height: 25,
    textAlign: 'center',
    borderRadius: 15,
    elevation: 3,
    backgroundColor: Colors.White,
    fontFamily: latoRegular,
  },
});
export default Services;
