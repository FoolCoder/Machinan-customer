import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Colors from '../utils/Colors';
import Constants from '../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../utils/Images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Api from '../utils/Api';
import Global from '../utils/Global';
import MyLoader from '../components/MyLoader';

const Notifications = ({navigation}) => {
  // const userInfo = useSelector(state => state.userInfo);
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Coustmer} = dashboardReducer;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.getNotifications(userInfo.token)
      .then(res => {
        setLoading(false);
        if (res.response == 101) {
          setNotifications(res.data.notifications.data);
        }
      })
      .catch(e => console.log(e));

    Api.readNotifications(userInfo.token)
      .then(res => {})
      .catch(e => console.log(e));
    return () => {};
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.nCards}>
        <Image
          source={Images.Placeholder}
          style={{
            width: Global.SCREEN_WIDTH * 0.2,
            height: Global.SCREEN_WIDTH * 0.2,
            borderRadius: Global.SCREEN_WIDTH * 0.2,
          }}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.title}</Text>
          <Text>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Image source={Images.Logo} resizeMode={'contain'} style={{ width: 100, height: 30 }}></Image> */}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={Colors.Primary} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Images.Placeholder} style={styles.img} />
          <Text
            style={{
              fontFamily: Constants.FontFranklinGothic,
              marginLeft: 5,
              fontSize: 16,
            }}>
            {Coustmer?.name}
          </Text>
        </View>
      </View>

      {loading ? (
        <MyLoader />
      ) : notifications.length == 0 ? (
        <View style={styles.loader}>
          <Text
            style={{fontFamily: Constants.FontSTCRegular, marginBottom: 10}}>
            No Notifications Yet
          </Text>
          <Ionicons
            name="notifications-off-outline"
            size={100}
            color={Colors.Primary}
          />
        </View>
      ) : (
        <FlatList
          style={{margin: 10}}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  img: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nCards: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
});

export default Notifications;
