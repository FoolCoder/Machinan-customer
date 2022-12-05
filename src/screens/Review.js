import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Global, {latoRegular} from '../utils/Global';
import Images from '../utils/Images';
import Modal from 'react-native-modal';
import Button from '../components/Button';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import ToggleSwitch from 'toggle-switch-react-native';
import {useSelector} from 'react-redux';
import {hp, wp} from '../components/Responsive';
import PassesView from '../components/PassesView';
import PassesViewB from '../components/PassViewB';

import {useRef} from 'react';
import {useIsFocused, CommonActions} from '@react-navigation/native';
import Loader from '../components/Loader';
import MyLoader from '../components/MyLoader';
import AlertModal from '../components/AlertModal';
import {NavigationActions, StackActions} from 'react-navigation';
import WalletModal from '../components/WalletModal';
const Review = ({navigation, route}) => {
  const modalizeRefA = useRef(null);
  const modalizeRefB = useRef(null);
  const {product, locationA, locationB, addressA, addressB} = route.params;
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Coustmer} = dashboardReducer;

  const [loading, setLoading] = useState(false);
  const [walletmodal, setwalletModal] = useState(false);
  const [passes, setPasses] = useState([]);
  const [title, setTitle] = useState('');
  const [passesA, setPassesA] = useState([]);
  const [passesB, setPassesB] = useState([]);
  const [showPasses, setShowPasses] = useState(false);
  const [price, setPrice] = useState(null);
  const [scheduled, setScheduled] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');

  const [scheduledStartDate, setScheduledStartDate] = useState(
    moment().toDate(),
  );
  const [scheduledStartTime, setScheduledStartTime] = useState(
    moment().toDate(),
  );
  const [scheduledEndDate, setScheduledEndDate] = useState(moment().toDate());
  const [scheduledEndTime, setScheduledEndTime] = useState(moment().toDate());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    Api.getPrices(product.id, locationA, locationB)
      .then(res => {
        console.log(res);
        if (res.response == 101) {
          setPrice(res.data);
        } else {
          Alert.alert('Error', res.message, [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(e => console.log(e));

    Api.getGatePasses(product.id)
      .then(res => {
        if (res.response == 101) {
          setPasses(res.data);
        }
      })
      .catch(e => console.log(e));
  }, [useIsFocused()]);

  const onVarifyNumber = item => {
    placeJob();
  };
  const setGatePassesA = item => {
    setPassesA(item);
    // passViewModal()
  };

  const setGatePassesB = item => {
    setPassesB(item);
  };

  const placeJob = () => {
    setLoading(true);
    let startDate = moment(scheduledStartDate);
    startDate.set('hour', moment(scheduledStartTime).hour());
    startDate.set('minute', moment(scheduledStartTime).minutes());
    startDate.set('second', moment(scheduledStartTime).seconds());

    let endDate = moment(scheduledEndDate);
    endDate.set('hour', moment(scheduledEndTime).hour());
    endDate.set('minute', moment(scheduledEndTime).minutes());
    endDate.set('second', moment(scheduledEndTime).seconds());
    // return
    Api.placeJob(
      userInfo.token,
      product,
      scheduled,
      locationA,
      locationB,
      passesA,
      passesB,
      addressA,
      addressB,
      moment(startDate).format('YYYY-MM-DD HH:MM'),
      moment(endDate).format('YYYY-MM-DD HH:MM'),
    )
      .then(res => {
        if (res.response == 101) {
          setLoading(false);
          setModalVisible(true);
          setStatus('Successful');
          setMalert('Job has been placed Successfully');
          setScreen('BookingsStack');
          return;
        }
        setScreen('');
        setLoading(false);
        setStatus('Failure');
        setModalVisible(true);
        setMalert(res.message);
      })
      .catch(e => {
        setLoading(false);
        setModalVisible(true);
        setStatus('Failure');
        setMalert(e.message);
        setScreen('');
      });
  };
  const AlertNav = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'BookingsStack'}],
      }),
    );
    // navigation.navigate('BookingsStack',{
    //   screen:'Bookings',
    //   params:{
    //     key:'onRefresh'
    //   }
    // })
  };
  const checkDisabled = () => {
    if (!price || loading) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={'#23262F'} />
        </TouchableOpacity>
        <Text style={styles.title}>Review</Text>
      </View>

      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
        <View style={styles.productInfo}>
          <Image
            style={{
              height: hp(16),
              width: 15,
            }}
            resizeMode="contain"
            source={Images.scp}
          />
          <View
            style={{
              left: 8,
              height: hp(14),
            }}>
            <View style={{...styles.pInfo}}>
              <Text style={{...styles.ptxt}}>Service</Text>

              <Text style={{...styles.ptxt}}>
                {product.service_name.en.replace(/Service/g, '')}
              </Text>
            </View>

            <View style={{...styles.pInfo, marginTop: 20}}>
              <Text style={{...styles.ptxt}}>Category</Text>

              <Text style={{...styles.ptxt}}>{product.category_name.en}</Text>
            </View>

            <View style={{...styles.pInfo, marginTop: 20}}>
              <Text style={{...styles.ptxt, fontWeight: '700'}}>Product</Text>

              <Text
                style={{
                  ...styles.ptxt,
                  fontWeight: '700',
                  textDecorationStyle: 'solid',
                  textDecorationColor: '#040415',
                }}>
                {product.name.en} {product.capacity} TON
              </Text>
            </View>
          </View>
        </View>
        {/* location View */}
        <View style={styles.locView}>
          <Text style={{...styles.loctxt, fontSize: wp(5), marginLeft: 15}}>
            Location
          </Text>

          <View
            style={{
              flexDirection: 'row',
              height: 'auto',
            }}>
            {locationB && (
              <View
                style={{
                  alignItems: 'center',
                  height: hp(40),
                  maxHeight: hp(80),
                  marginLeft: 12,
                  // borderWidth:1
                }}>
                <Image
                  style={{
                    height: 21,
                    width: 16.5,
                    top: 15,
                  }}
                  source={Images.loc}
                />
                <Image
                  style={{
                    height: passesA.length >= 1 ? hp(17.3) : hp(14),
                    width: 1,
                    marginTop: 20,
                    // minHeight:100
                  }}
                  source={Images.line}
                />
                <Image
                  style={{
                    height: 21,
                    width: 16.5,
                    top: 10,
                  }}
                  source={Images.loc}
                />
              </View>
            )}
            <View style={{width: 'auto'}}>
              <View
                style={{
                  width: wp(88),
                  marginLeft: locationB ? 10 : wp(8),
                }}>
                <Text style={{...styles.loctxt, marginTop: 10}}>
                  Location A
                </Text>
                <Text
                  lineBreakMode="tail"
                  numberOfLines={1}
                  style={styles.selecloctxt}>
                  {addressA}
                </Text>
                {product?.config.requires_gatepass &&
                  (passesA.length == 0 ? (
                    <TouchableOpacity
                      disabled={passes.length == 0 ? true : false}
                      style={{
                        ...styles.category,
                        marginBottom: locationB ? 0 : hp(5),
                      }}
                      onPress={() => {
                        navigation.navigate('SelectGatePasses', {
                          productId: product.id,
                          passes: passes,
                          onSelect: setPassesA,
                        });
                      }}>
                      <Image
                        style={{
                          right: 8,
                          height: 20,
                          width: 20,
                        }}
                        source={Images.plus}
                      />
                      <Text style={styles.gatePasstxt}>Add Gate Pass</Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '93%',
                      }}>
                      <View>
                        <View style={styles.passA}>
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              marginRight: 8,
                            }}
                            source={Images.check}
                          />
                          <Text style={styles.passName}>
                            {passesA[0]?.name}
                          </Text>
                        </View>
                        <View style={styles.passB}>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              marginRight: 8,
                            }}
                          />
                          <Text style={styles.passName}>
                            {passesA[1]?.name}
                          </Text>
                        </View>
                        {passesA[1] ? (
                          <TouchableOpacity
                            style={{marginLeft: 28}}
                            onPress={() => {
                              setTitle('Location A');
                              // setPassesA([...passesA]);
                              modalizeRefA.current?.open();
                            }}>
                            <Text style={styles.passviewall}>View All</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('SelectGatePasses', {
                            productId: product.id,
                            passes: passes,
                            previouspasses: passesA,
                            onSelect: setGatePassesA,
                          });
                        }}>
                        <Text
                          style={{...styles.passName, borderBottomWidth: 0.6}}>
                          Change
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
              {locationB && (
                <View
                  style={{
                    ...styles.seperator,
                    backgroundColor: '#E6E6E6',
                    width: wp(85),
                    top: 10,
                  }}
                />
              )}

              {locationB && (
                <View
                  style={{
                    width: wp(90),
                    marginLeft: 10,
                  }}>
                  <Text style={{...styles.loctxt, marginTop: 10}}>
                    Location B
                  </Text>
                  <Text
                    lineBreakMode="tail"
                    numberOfLines={1}
                    style={styles.selecloctxt}>
                    {addressB}
                  </Text>
                  {product.config.requires_gatepass &&
                    (passesB.length == 0 ? (
                      <TouchableOpacity
                        style={{
                          ...styles.category,
                          marginBottom: hp(8),
                          // justifyContent:'space-between'
                        }}
                        onPress={() => {
                          navigation.navigate('SelectGatePasses', {
                            productId: product.id,
                            passes: passes,
                            onSelect: setPassesB,
                          });
                        }}>
                        <Image
                          style={{
                            right: 8,
                            height: 20,
                            width: 20,
                          }}
                          source={Images.plus}
                        />
                        <Text style={styles.gatePasstxt}>Add Gate Pass</Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '93%',
                          height: hp(16),
                        }}>
                        <View>
                          <View style={styles.passA}>
                            <Image
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 8,
                              }}
                              source={Images.check}
                            />
                            <Text style={styles.passName}>
                              {passesB[0].name}
                            </Text>
                          </View>
                          <View style={styles.passB}>
                            <View
                              style={{
                                height: 20,
                                width: 20,
                                marginRight: 8,
                              }}
                            />
                            <Text style={styles.passName}>
                              {passesB[1]?.name}
                            </Text>
                          </View>
                          {passesB[1] ? (
                            <TouchableOpacity
                              style={{marginLeft: 28}}
                              onPress={() => {
                                setTitle('Location B');
                                // setPassesB(passesB);
                                modalizeRefB.current?.open();
                              }}>
                              <Text style={styles.passviewall}>View All</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('SelectGatePasses', {
                              productId: product.id,
                              passes: passes,
                              previouspasses: passesB,
                              onSelect: setGatePassesB,
                            });
                          }}>
                          <Text
                            style={{
                              ...styles.passName,
                              borderBottomWidth: 0.6,
                            }}>
                            Change
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.bottomView}>
          {product?.config.allows_scheduling && (
            <View style={styles.toogle}>
              <Text style={styles.gatePasstxt}>Scheduled</Text>
              <ToggleSwitch
                isOn={scheduled}
                onColor={Colors.Primary}
                offColor={Colors.Gray}
                size="medium"
                onToggle={isOn => setScheduled(isOn)}
              />
            </View>
          )}
          <View style={styles.seperator}>
            <View style={{borderWidth: 0.5}} />
          </View>

          <View style={styles.priceJobView}>
            <View>
              <Text style={{...styles.gatePasstxt, color: '#AFAFAF'}}>
                Estimated Price
              </Text>
              <Text style={styles.pricetxt}>
                {`QR${' '}${price?.min_price ? price?.min_price : 0} - ${
                  price?.max_price ? price?.max_price : 0
                }`}
              </Text>
            </View>
            <View style={{margin: 10}}>
              <TouchableOpacity
                disabled={checkDisabled()}
                style={styles.btn}
                onPress={() => {
                  if (userInfo) {
                    if (Coustmer.wallet_amount >= 0) {
                      return placeJob();
                    } else {
                      return Alert.alert(
                        'Error',
                        'Your Wallent Amount is less than 0, Please Add amount in Wallet ',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              setwalletModal(true);
                            },
                            style: 'cancel',
                          },
                        ],
                      );
                    }
                    // setModalVisible(true)
                  }
                  navigation.navigate('Register', {onSelect: onVarifyNumber});
                }}>
                <Text style={{...styles.gatePasstxt, color: '#040415'}}>
                  Place Job
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {scheduled && (
          <View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: Colors.White,
                padding: 10,
                borderRadius: 10,
                elevation: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>Start Time</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderColor: Colors.Gray,
                    padding: 5,
                    borderRadius: 10,
                  }}>
                  <Text>
                    {moment(scheduledStartDate).format('DD MMM YYYY')}
                  </Text>
                </TouchableOpacity>
                <View style={{flex: 0.1}}></View>
                <TouchableOpacity
                  onPress={() => setShowStartTimePicker(true)}
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderColor: Colors.Gray,
                    padding: 5,
                    borderRadius: 10,
                  }}>
                  <Text>{moment(scheduledStartTime).format('HH:MM')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: Colors.White,
                padding: 10,
                borderRadius: 10,
                elevation: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>End Time</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderColor: Colors.Gray,
                    padding: 5,
                    borderRadius: 10,
                  }}>
                  <Text>{moment(scheduledEndDate).format('DD MMM YYYY')}</Text>
                </TouchableOpacity>
                <View style={{flex: 0.1}}></View>
                <TouchableOpacity
                  onPress={() => setShowEndTimePicker(true)}
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderColor: Colors.Gray,
                    padding: 5,
                    borderRadius: 10,
                  }}>
                  <Text>{moment(scheduledEndTime).format('HH:MM')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {showStartDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={moment(scheduledStartDate).toDate()}
            mode={'date'}
            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
            style={{backgroundColor: 'white'}}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || scheduledStartDate;
              setShowStartDatePicker(Platform.OS === 'ios');
              setScheduledStartDate(currentDate);
            }}
          />
        )}

        {showStartTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={moment(scheduledStartTime).toDate()}
            mode={'time'}
            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
            style={{backgroundColor: 'white'}}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || scheduledStartTime;
              setShowStartTimePicker(Platform.OS === 'ios');
              setScheduledStartTime(currentDate);
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={moment(scheduledEndDate).toDate()}
            mode={'date'}
            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
            style={{backgroundColor: 'white'}}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || scheduledEndDate;
              setShowEndDatePicker(Platform.OS === 'ios');
              setScheduledEndDate(currentDate);
            }}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={moment(scheduledEndTime).toDate()}
            mode={'time'}
            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
            style={{backgroundColor: 'white'}}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || scheduledEndTime;
              setShowEndTimePicker(Platform.OS === 'ios');
              setScheduledEndTime(currentDate);
            }}
          />
        )}
      </ScrollView>
      {passesA?.length > 0 && (
        <PassesView passes={passesA} modalizeRef={modalizeRefA} />
      )}
      {passesB?.length > 0 && (
        <PassesViewB passes={passesB} modalizeRefB={modalizeRefB} />
      )}
      <AlertModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        navigation={AlertNav}
        screen={'BookingsStack'}
        msg={malert}
        status={status}
      />
      <WalletModal
        modalVisible={walletmodal}
        navigation={navigation}
        setModalVisible={setwalletModal}
        path={'Review'}
      />
      {loading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  passviewall: {
    color: '#FF6A3C',
    textDecorationLine: 'underline',
    width: wp(15),
  },
  passB: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    opacity: 0.1,
  },
  passA: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(93),
    marginTop: hp(4),
  },
  back: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#E6E8EC',
    width: 25,
    height: 25,
    borderRadius: 15,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#23262F',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: latoRegular,
  },
  pInfo: {
    flexDirection: 'row',
    width: wp(85),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ptxt: {
    fontWeight: '400',
    fontFamily: latoRegular,
    fontSize: wp(4.2),
    color: '#040415',
  },
  locView: {
    height: 'auto',
    backgroundColor: '#F5F5F5',
    elevation: 2,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: hp(3),
    minHeight: hp(47),
    maxHeight: hp(80),
  },
  loctxt: {
    fontWeight: '700',
    marginTop: 20,
    fontFamily: latoRegular,
    fontSize: wp(4.5),
    color: '#040415',
  },
  selecloctxt: {
    color: '#7F7F7F',
    marginTop: 5,
    fontSize: wp(4.5),
    fontWeight: '400',
    fontFamily: latoRegular,
    width: wp(85),
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    width: wp(40),
    marginTop: 8,
    backgroundColor: '#040415',
    flexDirection: 'row',
  },
  gatePasstxt: {
    fontWeight: '700',
    color: Colors.White,
    fontSize: 14,
    fontFamily: latoRegular,
  },
  bottomView: {
    backgroundColor: '#040415',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height: 'auto',
    marginTop: -20,
    minHeight: hp(25),
  },
  toogle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    flexDirection: 'row',
    width: wp(85),
    alignSelf: 'center',
    marginRight: 12,
  },
  btn: {
    width: wp(32),
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White,
    borderRadius: 28,
  },
  priceJobView: {
    width: wp(92),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricetxt: {
    fontSize: wp(6.5),
    fontFamily: latoRegular,
    color: Colors.White,
    fontWeight: '700',
  },
  seperator: {
    height: 1.5,
    marginVertical: 18,
    alignSelf: 'center',
    right: 10,
    width: wp(85),
    top: 10,
  },
  gatePass: {
    width: wp(85),
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 'auto',
    maxHeight: hp(25),
  },
  passName: {
    fontFamily: latoRegular,
    fontWeight: '700',
    fontSize: 14,
    color: '#040415',
  },
});

export default Review;
