import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  Animated,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Api from '../utils/Api';
import Images from '../utils/Images';
import Global, {latoRegular} from '../utils/Global';
import Colors from '../utils/Colors';
import Button from '../components/Button';
import moment from 'moment';
import BookingsCard from '../components/BookingsCard';
import {wp, hp} from '../components/Responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AlertModal from '../components/AlertModal';
import Loader from '../components/Loader';
import MyLoader from '../components/MyLoader';
import {acc} from 'react-native-reanimated';
import {setBookings} from '../redux/reducer';
const Bookings = ({navigation, route}) => {
  const dispatch = useDispatch();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Coustmer} = dashboardReducer;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortArray, setsortArray] = useState([]);
  const [statusRefresh, setstatusRefresh] = useState(false);

  let optionHeight = [];
  bookings?.map((item, index) => {
    optionHeight[index] = new Animated.Value(0);
  });

  // useEffect(() => {
  //   let enableArray = [];
  //   let disableArray = [];
  //   bookings?.map((item, index) => {
  //     if (item?.supplier_status == 'Expired') {
  //       disableArray.push(item);
  //     } else {
  //       enableArray.push(item);
  //     }
  //   });
  //   setsortArray([...enableArray, ...disableArray]);
  // }, []);

  useEffect(() => {
    const ac = new AbortController();
    getBookings('useEffect');
    return () => {
      ac.abort();
    };
  }, [Coustmer]);

  const getBookings = callCheck => {
    let enableArray = [];
    let disableArray = [];
    if (Coustmer == null) {
      return;
    }
    if (callCheck == 'useEffect') {
      setLoading(true);
    }

    Api.getBookings(userInfo?.token)
      .then(res => {
        if (res.response == 101) {
          setLoading(false);
          setRefreshing(false);
          setstatusRefresh(false);

          res.data?.map((item, index) => {
            if (item?.status == 'Expired') {
              disableArray.push(item);
            } else {
              enableArray.push(item);
            }
          });
          // dispatch(setBookings([...enableArray, ...disableArray]))
          setBookings([...enableArray, ...disableArray]);
        }
      })
      .catch(e => {
        setLoading(false);
        setRefreshing(false);
        setstatusRefresh(false);
        Alert.alert('Error', e.message)
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getBookings('onRefresh');
  }, []);
  const changestatus = () => {
    getBookings('onRefresh');
  };
  if (userInfo == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginModal}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            You are not logged in
          </Text>
          <Text style={{marginTop: 10}}>
            Please create account or login to see bookings
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ServicesStack')}
          style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={'#23262F'} />
        </TouchableOpacity>
        <Text style={styles.title}>Bookings</Text>

        {Coustmer?.photo ? (
          <Image source={{uri: Coustmer?.photo}} style={styles.uImg} />
        ) : (
          <Image source={Images.Placeholder} style={styles.uImg} />
        )}
      </View>

      {loading ? (
        <MyLoader />
      ) : bookings?.length == 0 || bookings == null ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              color: Colors.Black,
              fontSize: hp(3),
              fontWeight: '500',
              fontFamily: latoRegular,
            }}>
            No available bookings
          </Text>
        </View>
      ) : (
        <FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          style={{margin: 10}}
          data={bookings}
          initialNumToRender={5}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
          windowSize={10}
          extraData={bookings}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.line} />}
          renderItem={({item, index}) => (
            <>
              <BookingsCard
                item={item}
                index={index}
                bookings={bookings}
                available={false}
                refresh={refreshing}
                setRefresh={setRefreshing}
                onRefresh={onRefresh}
                changestatus={changestatus}
                statusRefresh={statusRefresh}
                setstatusRefresh={setstatusRefresh}
              />
            </>
          )}
        />
      )}
      {statusRefresh && <Loader />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  line: {
    width: wp(90),
    borderWidth: 0.4,
    alignSelf: 'center',
    borderColor: Colors.LightGray,
    marginTop:4
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 15,
    // borderWidth:1,
    width: wp(92),
    alignSelf: 'center',
  },
  back: {
    // marginLeft: 10,
    backgroundColor: '#E6E8EC',
    width: 25,
    height: 25,
    borderRadius: 15,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingcard: {
    backgroundColor: Colors.White,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  img: {
    width: Global.SCREEN_WIDTH * 0.2,
    height: Global.SCREEN_WIDTH * 0.2,
    borderRadius: Global.SCREEN_WIDTH * 0.2,
  },
  uImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
  },
  statusView: {
    backgroundColor: Colors.Gray,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default Bookings;
