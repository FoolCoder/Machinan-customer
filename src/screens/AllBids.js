import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  Alert,
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
import Button from '../components/Button';

const AllBids = ({navigation, route}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Splash, Coustmer} = dashboardReducer;
  const [bids, setBids] = useState(route.params.bids);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setLoading(true)
    // Api.getNotifications(userInfo.token).then((res) => {
    //     setLoading(false)
    //     if (res.response == 101) {
    //         setNotifications(res.data.notifications.data)
    //         console.log(res.data.notifications.data[0])
    //     }
    // }).catch((e) => console.log(e))

    return () => {};
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.bids}>
        <Text style={{fontWeight: 'bold'}}>
          Total requirements:{' '}
          <Text style={{fontWeight: '300'}}>{item.total_requirements}</Text>
        </Text>
        <Text style={{fontWeight: 'bold'}}>
          Fulfilled requirements:{' '}
          <Text style={{fontWeight: '300'}}>{item.fulfilled_requirements}</Text>
        </Text>
        <Text style={{fontWeight: 'bold'}}>
          Price: <Text style={{fontWeight: '300'}}>{item.price}</Text>
        </Text>
        <Text style={{fontWeight: 'bold'}}>
          Status: <Text style={{fontWeight: '300'}}>{item.status}</Text>
        </Text>

        {item.status == 'Applied' && (
          <Button
            label="Accept"
            onPress={() => {
              setLoading(true);
              Api.acceptBid(userInfo.token, item.id)
                .then(res => {
                  setLoading(false);
                  if (res.response == 101) {
                    Alert.alert('Machinan', res.message, [
                      {text: 'OK', onPress: () => navigation.goBack()},
                    ]);
                  }
                })
                .catch(e => console.log(e));
            }}
            style={{alignSelf: 'flex-end'}}></Button>
        )}
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
          <Image source={Images.Placeholder} style={styles.img}></Image>
          <Text style={styles.name}>{Coustmer?.name}</Text>
        </View>
      </View>

      <FlatList
        style={{margin: 10}}
        data={bids}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
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
  name: {
    fontFamily: Constants.FontFranklinGothic,
    marginLeft: 5,
    fontSize: 16,
  },
  bids: {
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
});
export default AllBids;
