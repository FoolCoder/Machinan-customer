import {CommonActions, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useState, useCallback, useRef} from 'react';
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
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import {hp, wp} from './Responsive';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../components/Button';
import {default as MaterialIcons} from 'react-native-vector-icons/MaterialIcons';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import AlertModal from './AlertModal';

const BookingsCard = ({
  item,
  index,
  bookings,
  available,
  setRefresh,
  refresh,
  onRefresh,
  statusRefresh,
  setstatusRefresh,
  changestatus,
}) => {
  const navigation = useNavigation();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [modalVisible, setModalVisible] = useState(false);
  const [codmodalVisible, setcodModalVisible] = useState(false);
  const [coddata, setcodData] = useState(null);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');
  const [toggled, setToggled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  let optionHeight = [];
  const height = useRef(new Animated.Value(1)).current;

  bookings.map((item, index) => {
    optionHeight[index] = new Animated.Value(0);
  });
  const changeStatus = (id, status) => {
    setstatusRefresh(!statusRefresh);

    Api.changeBookingStatus(userInfo.token, id, status)
      .then(res => {
        if (res?.response == 101) {
          changestatus();
        }
      })
      .catch(e => console.log(e));
  };

  const saddadPayment = async (id, online) => {
    Api.finalPayment(userInfo.token, id, online)
      .then(res => {
        // console.log(res);
        if (res.response == 100) {
          setMalert(res.data.message);
          setStatus('Failure');
          setModalVisible(true);
        }
        if (res.response == 101) {
          if (res.data?.cod) {
            //payment done from cod
            setcodData(res.data);
            setcodModalVisible(true);
            return;
          }
          if (res.data?.payable == 0) {
            //payment done from walet
            setMalert(res.message);
            setStatus('Successful');
            setModalVisible(true);
            return;
          }
          //navigate to sadad with url
          navigation.navigate('SadaddCheckout', {
            params: {url: res?.data?.url, path: 'Bookings'},
          });
        }
      })
      .catch(e => console.log(e));
  };
  const AlertNav = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'BookingsStack'}, {name: 'BookingsStack'}],
      }),
    );
  };

  const actionButtons = item => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {item.status == 'Pending Arrival Confirmation' && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Approve'}
            outline
            onPress={() => changeStatus(item.id, 'Arrived')}></Button>
        )}
        {item.status == 'Pending Completion Confirmation' && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Approve'}
            outline
            onPress={() => changeStatus(item.id, 'Completed')}></Button>
        )}
        {item.status == 'Pending Payment Confirmation' && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Payment'}
            outline
            onPress={() => {
              if (item?.payment_mode == 'Online') {
                saddadPayment(item?.id, true);
              } else {
                Alert.alert('COD Payment ', 'Pay Operator in Cash!');
              }
            }}></Button>
        )}
        {item.status == 'Completed' && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Dispute'}
            outline
            onPress={() =>
              navigation.navigate('Dispute', {
                booking: item,
              })
            }></Button>
        )}
        {item.status == 'Disputed' && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Respond'}
            outline
            onPress={() =>
              navigation.navigate('Dispute', {booking: item})
            }></Button>
        )}
        {item.status == 'Cancelled' && bookings.bid_id != null && (
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
            label={'Dispute'}
            outline
            onPress={() =>
              navigation.navigate('Dispute', {booking: item})
            }></Button>
        )}
        {item.status !== 'Cancelled' &&
          item.status !== 'In Progress' &&
          item.status !== 'Pending Completion Confirmation' &&
          item.status !== 'Pending Payment Confirmation' &&
          item.status !== 'Completed' &&
          item.status !== 'Disputed' &&
          item.status !== 'Expired' &&
          item.status !== 'Breakdown' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Cancel'}
              outline
              onPress={() => {
                Alert.alert(
                  'Machinan',
                  'Are you sure you want to Cancel Booking?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => changeStatus(item.id, 'Cancelled'),
                    },
                    {text: 'No'},
                  ],
                );
              }}></Button>
          )}
        <Button
          style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 8}}
          label={'Details'}
          rightIcon
          outline
          onPress={() =>
            navigation.navigate('BookingDetail', {booking: item})
          }></Button>
      </View>
    );
  };

  const CheckStatus = (status, type) => {
    if (status == 'Disputed') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Booked') {
      if (type == 'bgc') {
        return '#FFF3DC';
      }
      return '#FF754C';
    }
    if (status == 'Open') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Cancelled') {
      if (type == 'bgc') {
        return '#e1f5e7';
      }
      return '#86d99c';
    }
    if (status == 'On My Way') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Pending Arrival Confirmation') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Arrived') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'In Progress') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Completed') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Pending Completion Confirmation') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Pending Payment Confirmation') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Breakdown') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Expired') {
      if (type == 'bgc') {
        return Colors.Gray;
      }
      return '#000';
    }
  };
  const cardPressed = useCallback(
    event => {
      setExpanded(!expanded),
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    [item, expanded],
  );
  return (
    <>
      <TouchableOpacity
        disabled={item?.status == 'Expired' ? true : false}
        unstable_pressDelay={0}
        onPress={() => {
          cardPressed();
          // setToggled(val => !val);
          // Animated.timing(optionHeight[index], {
          //   toValue: optionHeight[index].__getValue() == 0 ? 50 : 0, // the numeric value of not current
          //   duration: 350, // 2 secs
          //   useNativeDriver: false,
          // }).start();
        }}
        style={{
          backgroundColor: item?.status == 'Expired' ? '#E7E8E0' : Colors.White,
          alignSelf: 'center',
          width: item?.supplier_status == 'Disabled' ? wp(98) : wp(95),
          borderRadius: item?.supplier_status == 'Disabled' ? 12 : 0,
          top: item?.supplier_status == 'Disabled' ? 3.5 : 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: item.location_b_address ? -hp(2) : 0,
            width: item?.supplier_status == 'Disabled' ? wp(95) : 'auto',
            alignSelf: 'center',
            // borderWidth:1/
          }}>
          <View
            style={{
              ...styles.dateBox,
              borderColor:
                item?.supplier_status == 'Disabled' ? '#000' : '#E6E8F0',
            }}>
            <Text style={styles.month}>
              {moment(item.created_at).format('MMM')}
            </Text>
            <Text style={styles.day}>
              {moment(item.created_at).format('DD')}
            </Text>
            <View style={styles.timeBox}>
              <Text style={styles.time}>
                {moment(item.created_at).format('h:mm A')}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, padding: 10}}>
            <View style={styles.namecontainer}>
              <View
                style={{
                  ...styles.rightBox,
                  marginTop: item.location_b_address ? hp(3) : 0,
                }}>
                <View>
                  <Text style={styles.orderIdmain}>
                    Order ID: <Text style={styles.orderId}>{item.id}</Text>
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineBreakMode="tail"
                    style={styles.productname}>
                    {item.product_name.en
                      ? item.product_name.en
                      : item.product_name}{' '}
                    ({item.product_capacity} TON)
                  </Text>
                </View>
                {available == false ? (
                  <View
                    style={{
                      ...styles.statusview,
                      backgroundColor: CheckStatus(item.status, 'bgc'),
                    }}>
                    <Text
                      numberOfLines={1}
                      lineBreakMode="tail"
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        paddingLeft: 6,
                        paddingRight: 6,
                        color: CheckStatus(item.status, 'fc'),
                      }}>
                      {item.status.replace(/Pending/g, '')}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={item.location_b_address ? Images.AB : Images.A}
                  style={{
                    height: item.location_b_address ? 75 : 44,
                    width: item.location_b_address ? 15 : 20,
                  }}
                  resizeMode="contain"
                />
              </View>

              <View
                style={{
                  marginLeft: 5,
                  top: item.location_b_address ? hp(1) : hp(-0.5),
                }}>
                <Text
                  style={{
                    marginBottom: item.location_b_address ? hp(0.8) : hp(1.3),
                    fontWeight: '600',
                    fontSize: 10,
                  }}>
                  Location
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    ...styles.location_a_address,
                    textAlign: 'left',
                    marginBottom: item.location_b_address ? hp(0.52) : 0,
                  }}>
                  {item.location_a_address}
                </Text>

                {item.location_b_address && (
                  <Text
                    numberOfLines={1}
                    style={{...styles.location_a_address, textAlign: 'left'}}>
                    {item.location_b_address}
                  </Text>
                )}
              </View>
            </View>
            <Text style={{...styles.location_a_address, left: wp(7)}}>
              Bids:{' '}
              {item?.bids_count < 10
                ? `0${item?.bids_count}`
                : item?.bids_count}
            </Text>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              // height: optionHeight[index],
              // opacity: optionHeight[index],
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              // borderWidth: 1,
              width: wp(94),
              alignSelf: 'center',
            }}>
            {actionButtons(item)}
          </View>
        )}
      </TouchableOpacity>
      <AlertModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        msg={malert}
        status={status}
        navigation={AlertNav}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={codmodalVisible}
        onRequestClose={() => {
          setcodModalVisible(!codmodalVisible);
        }}>
        <View style={styles.modal}>
          <View style={styles.modalView}>
            <View style={styles.imagecontainer}>
              <View style={{width: 30}} />
              <Image
                resizeMode="contain"
                style={styles.img}
                source={Images.successful}
              />
              <TouchableOpacity
                onPress={() => {
                  setcodModalVisible(!codmodalVisible);
                }}>
                <Image source={Images.cross} style={styles.backPress} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Payment Info</Text>
            <View>
              <Text numberOfLines={1} style={{textAlign: 'left'}}>
                Initial Balance: {coddata?.initial_balance}
              </Text>
              <Text numberOfLines={1} style={{textAlign: 'left'}}>
                Payable: ${coddata?.payable}
              </Text>
              <Text numberOfLines={1} style={{textAlign: 'left'}}>
                Total Amount: ${coddata?.total_amount}
              </Text>
              <Text numberOfLines={1} style={{textAlign: 'left'}}>
                Wallet Deduction: ${coddata?.wallet_deduction}
              </Text>
            </View>

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setcodModalVisible(!codmodalVisible);
                  AlertNav();
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  namecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productname: {
    fontWeight: 'bold',
    fontSize: hp(2.3),
    width: wp(60),
  },
  orderIdmain: {color: '#8F95B2', marginBottom: 4, width: wp(30)},
  dateBox: {
    alignItems: 'center',
    borderWidth: 1,
    height: hp(13),
    paddingTop: 3,
    width: wp(18),
    borderRadius: 20,
    top: -3,
  },
  month: {
    color: '#8F95B2',
    fontWeight: '700',
    fontSize: hp(1.7),
    marginBottom: 1,
    top: 5,
  },
  day: {
    color: '#081735',
    fontWeight: '700',
    fontSize: hp(4),
    alignSelf: 'center',
    height: hp(6),
  },
  timeBox: {
    width: '100%',
    backgroundColor: '#000',
    height: hp(4),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: hp(1.5),
    color: 'white',
    fontWeight: '600',
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: '300',
    fontWeight: 'bold',
    color: 'black',
  },
  statusview: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    width: 'auto',
    alignSelf: 'flex-start',
    position: 'absolute',
    right: 0,
  },
  location_a_address: {
    fontWeight: '400',
    fontSize: 13,
    color: '#7F7F7F',
  },
  backPress: {width: 30, height: 30, bottom: 12, left: 10},
  imagecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: wp(80),
    height: hp(40),
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    width: wp(25),
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    fontSize: hp(1.4),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: hp(2.5),
    fontWeight: '700',
  },
  img: {
    height: 40,
    width: 40,
  },
});

export default memo(BookingsCard);
