import React, {useEffect, useState, createRef, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  FlatList,
  Modal as ImageModal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Api from '../utils/Api';
import Global from '../utils/Global';
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import Button from '../components/Button';
import {default as MaterialIcons} from 'react-native-vector-icons/MaterialIcons';
import Loader from '../components/Loader';
import {hp, wp} from '../components/Responsive';
import {useSelector} from 'react-redux';
import AlertModal from '../components/AlertModal';
import {CommonActions} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import MyLoader from '../components/MyLoader';
import {FadeIn} from 'react-native-reanimated';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const BookingDetail = ({navigation, route}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(false);
  const [Id, setId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [onlinePaymet, setonlinePaymet] = useState(false);

  const modalizeRef = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const scrollViewRef = useRef();
  const BidsRef = useRef(null);

  const [currentLoc, setcurrentLoc] = useState(null);
  const [disAB, setdisAB] = useState(null);
  const [timeAB, settimeAB] = useState(null);
  const [currentdis, setcurrentdis] = useState(null);
  const [currenttime, setcurrenttime] = useState(null);
  const [bookedItem, setBookedItem] = useState(null);
  const [pagerModal, setpagerModal] = useState(false);
  const [showpayment, setShowpayment] = useState(false);
  var cdis;
  var cTime;
  const onRegionChangeComplete = () => {
    if (markerRef && markerRef.current && markerRef.current.showCallout) {
      markerRef.current.showCallout();
    }
  };
  useEffect(() => {
    const ac = new AbortController();
    requestLocationPermission();
    return () => ac.abort();
  }, []);
  useEffect(() => {
    Api.getBookingDetail(userInfo.token, route.params.booking.id)
      .then(res => {
        if (res.response == 101) {
          setBooking(res.data);
          res.data.bids.map((item, index) => {
            if (item.status === 'Accepted') setBookedItem(item);
          });
        }
      })
      .catch(e => console.log(e));

    return () => {};
  }, [route.params.booking.id]);
  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // setcurrentLoc({
        //   latitude: position?.coords.latitude,
        //   longitude: position?.coords.longitude,
        // });
        setcurrentLoc({
          latitude: 25.286106,
          longitude: 51.534817,
        });
        // placeBid(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Machinan needs Location Permission',
            message: 'Machinan needs access to your location.' + ' ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          console.log('Permission Not Granted');
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          getUserLocation();
        } else {
          console.log('Permission Not Granted');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const onOpen = () => {
    modalizeRef.current?.open();
    currentLoc && fittoCordinate(currentLoc);
  };

  const saddadPayment = async (id, online) => {
    BidsRef.current?.close();
    setonlinePaymet(true);
    const bId = Id ? Id : id;
    setModal(false);
    Api.acceptBid(userInfo.token, bId, online)
      .then(res => {
        if (res.response == 100) {
          setonlinePaymet(false);
          setMalert(res.data?.message ? res.data?.message : res.message);
          setStatus('Failure');
          setModalVisible(true);
        }
        if (res.response == 101) {
          setonlinePaymet(false);

          if (res.data?.cod) {
            //payment done from cod
            setMalert('You have to pay cash to the Operator');
            setStatus('Successful');
            setModalVisible(true);
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
            params: {url: res?.data?.url, path: 'BookingDetail'},
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
  const fittoCordinate = c3 => {
    let region =
      booking?.location_b_latitude && booking?.location_b_longitude
        ? [
            {
              latitude: booking?.location_a_latitude,
              longitude: booking?.location_a_longitude,
            },
            {
              latitude: booking?.location_b_latitude,
              longitude: booking?.location_b_longitude,
            },
            {
              latitude: c3.latitude,
              longitude: c3.longitude,
            },
          ]
        : [
            {
              latitude: booking?.location_a_latitude,
              longitude: booking?.location_a_longitude,
            },

            {
              latitude: c3.latitude,
              longitude: c3.longitude,
            },
          ];
    setTimeout(() => {
      map.current?.fitToCoordinates(region, {
        edgePadding: {
          bottom: 35,
          right: 20,
          top: 50,
          left: 20,
        },
        animated: true,
      });
    }, 1000);
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        key={item.booking_id}
        style={{
          flexDirection: 'row',
          width: wp(90),
          justifyContent: 'space-between',
          marginTop: 13,
          // backgroundColor: bookedItem.id == item.id ? Colors.Gray : null,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          disabled={
            //bookedItem ||
            booking?.status == 'Cancelled' || item?.status == 'Expired'
              ? true
              : false
          }
          onPress={() =>
            navigation.navigate('SuppierProfile', {
              booking: booking,
              bid: item.id,
            })
          }
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={
              item?.status == 'Accepted' ? Images.bidaccept : Images.hammer
            }
            style={styles.hammerImg}
          />
          <View>
            <Text
              style={{
                ...styles.requirementtxt,
                fontSize: 16,
                textAlign: 'left',
              }}>
              {item?.supplier.name}
            </Text>
            <Text
              lineBreakMode="tail"
              numberOfLines={1}
              style={{
                ...styles.requirementtxt,
                color: '#F39200',
                maxWidth: wp(40),
                textAlign: 'left',
              }}>
              {item?.equipment.info}
            </Text>
            {item?.status == 'Expired' && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                }}>
                Expired
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              ...styles.requirementtxt,
              marginRight: wp(10),
              fontSize: 16,
            }}>
            {item.price}
          </Text>
          <TouchableOpacity
            disabled={
              bookedItem ||
              booking?.status == 'Cancelled' ||
              item?.status == 'Expired'
                ? true
                : false
            }
            onPress={() => {
              if (booking?.product_upfront_payment) {
                Alert.alert(
                  'Accept Bid',
                  `Are you sure you want to Accept this bid?${'\n'}Amount will be deducted from wallet,${'\n'}Remaining amount goes to Sadad`,
                  [
                    {
                      text: 'No',
                    },

                    {
                      text: 'Yes',
                      onPress: () => saddadPayment(item?.id, true),
                    },
                  ],
                );
                // saddadPayment(item?.id, true);
              } else {
                setId(item?.id);
                setModal(true);
              }
            }}>
            <Image
              resizeMode="contain"
              source={Images.detailbid}
              style={{...styles.hammerImg, marginRight: 0}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Booking Detail</Text>
      </View>

      {booking ? (
        <>
          <ScrollView
            nestedScrollEnabled={true}
            ref={scrollViewRef}
            contentContainerStyle={{alignItems: 'center'}}
            style={{
              marginBottom: hp(8),
            }}
            showsVerticalScrollIndicator={false}>
            {booking.status != 'Open' && (
              <View style={styles.bookinginfoContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: wp(85),
                  }}>
                  <Text
                    style={{
                      ...styles.requirementtxt,
                      color: '#4E8B54',
                      fontWeight: '600',
                      marginBottom: 5,
                      left: 5,
                    }}>
                    {booking.status == 'Cancelled' || booking.status == 'Open'
                      ? `Booking: ${booking?.id}`
                      : 'Bid Accepted'}
                  </Text>

                  <View style={styles.statusBox}>
                    <Image
                      resizeMode="contain"
                      source={Images.whiteTick}
                      style={{width: hp(1.7), height: hp(1.7), marginRight: 4}}
                    />
                    <Text style={styles.requirementtxt}>
                      STATUS {booking.status.replace(/Pending/g, '')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SuppierProfile', {
                      booking: booking,
                      bid: bookedItem?.id,
                    })
                  }>
                  {booking.status == 'Cancelled' ? null : (
                    <Text
                      style={{
                        ...styles.requirementtxt,
                        color: '#7F7F7F',
                        textAlign: 'right',
                        textDecorationLine: 'underline',
                      }}>
                      Detail
                    </Text>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: -24,
                    left: 5,
                  }}>
                  {booking.status == 'Cancelled' ? null : (
                    <Text style={{fontWeight: '700'}}>
                      {bookedItem?.price}{' '}
                      <Text style={{fontSize: 12}}>Price</Text>
                    </Text>
                  )}
                  {booking.status == 'Cancelled' ? null : (
                    <Text style={{fontWeight: '700'}}>
                      E.T.A{' '}
                      <Text style={{fontSize: 12}}>
                        {moment(bookedItem?.eta).format('hh:mm')}
                      </Text>
                    </Text>
                  )}
                </View>
              </View>
            )}
            <View
              style={{
                ...styles.productContainer,
                height: 'auto',
                maxHeight:
                  bookedItem?.equipment?.images.length > 0 ? hp(26) : hp(15),
              }}>
              <View style={styles.productInfoContainer}>
                <View style={styles.productRight}>
                  <Text
                    style={{
                      marginTop: 10,
                      marginBottom: 12,
                      fontWeight: '600',
                      color: Colors.Gray,
                    }}>
                    Product Info
                  </Text>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {booking.equipment_icon
                      ? booking.product_name
                      : booking.product_name?.en}
                  </Text>
                </View>
                <View style={styles.productLeft}>
                  <Text style={{fontWeight: '700', fontSize: hp(3)}}>
                    {booking.product_capacity}
                  </Text>
                  <Text style={{color: Colors.Gray}}>TON</Text>
                </View>
              </View>
              {bookedItem && (
                <View style={{width: wp(87.5), alignSelf: 'center'}}>
                  <ScrollView
                    horizontal
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexDirection: 'row',
                      height: 'auto',
                      marginVertical: 5,
                    }}>
                    {bookedItem?.equipment?.images.length > 0
                      ? bookedItem?.equipment?.images?.map(item => {
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => setpagerModal(!pagerModal)}>
                              <FastImage
                                key={item.id}
                                style={{
                                  width: wp(18),
                                  height: wp(18),
                                  borderRadius: 10,
                                  marginLeft: 8,
                                }}
                                source={{
                                  uri: item?.url,
                                  priority: FastImage.priority.high,
                                }}
                              />
                              {/* <Image
                              key={item.id}
                              resizeMode="contain"
                              source={{uri: item?.url}}
                              style={{
                                width: wp(18),
                                height: wp(18),
                                borderRadius: 10,
                                marginLeft: 8,
                                top: 2,
                              }}
                            /> */}
                            </TouchableOpacity>
                          );
                        })
                      : null}
                  </ScrollView>
                </View>
              )}
            </View>
            <TouchableOpacity
              disabled={currentLoc ? false : true}
              style={styles.locationPContainer}
              onPress={() => onOpen()}>
              <Image
                source={
                  booking?.location_b_address ? Images.BidAB : Images.BidA
                }
                resizeMode="contain"
                style={
                  booking?.location_b_address
                    ? styles.locationABImage
                    : styles.locationAImage
                }
              />
              <View style={{flex: 1}}>
                <View style={{...styles.locationContainer, marginTop: hp(3)}}>
                  <View>
                    <Text style={styles.locationtxt}>Location A</Text>

                    <View style={{width: wp(50)}}>
                      <Text style={styles.locationaddres}>
                        {booking.location_a_address}
                      </Text>
                    </View>
                    {/* <MaterialCommunityIcons name='map-marker' size={20} color={Colors.Secondary} /> */}
                  </View>

                  <Image
                    source={Images.LocationA}
                    resizeMode="cover"
                    style={styles.locationImage}
                  />
                </View>

                {booking.location_b_address && (
                  <View
                    style={{
                      ...styles.locationContainer,
                      marginVertical: hp(2),
                    }}>
                    <View>
                      <Text style={styles.locationtxt}>Location B</Text>
                      <View style={{width: wp(50)}}>
                        <Text style={styles.locationaddres}>
                          {booking.location_b_address}
                        </Text>
                      </View>
                    </View>

                    <Image
                      source={Images.LocationB}
                      resizeMode="cover"
                      style={styles.locationImage}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {booking.type == 'Scheduled-Site' ||
            booking.type == 'Scheduled-Trip' ? (
              <View style={{...styles.operatorBox, width: '90%'}}>
                <Image
                  resizeMode="cover"
                  source={Images.timeicon}
                  style={styles.supliericon}
                />
                <View>
                  <Text style={{color: '#7F7F7F', fontSize: 16}}>
                    Schedule Time
                  </Text>
                  <Text style={{marginTop: 5}}>
                    <Text style={{fontWeight: '600'}}>Start time: </Text>
                    {moment(booking.scheduled_time_bracket_start).format(
                      'DD MMM YY hh:mm A',
                    )}
                  </Text>
                  <Text style={{marginTop: 5}}>
                    <Text style={{fontWeight: '600'}}>End time: </Text>
                    {moment(booking.scheduled_time_bracket_end).format(
                      'DD MMM YY hh:mm A',
                    )}
                  </Text>
                </View>
              </View>
            ) : null}

            {bookedItem && (
              <View style={{width: '90%'}}>
                <View style={styles.operatorBox}>
                  <Image
                    resizeMode="cover"
                    source={Images.opIcon}
                    style={styles.supliericon}
                  />
                  <View>
                    <Text style={{color: '#7F7F7F', fontSize: 16}}>
                      Operator Details
                    </Text>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Name: </Text>
                      {bookedItem.operator.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.operatorBox}>
                  <Image
                    resizeMode="cover"
                    source={Images.supIcon}
                    style={styles.supliericon}
                  />
                  <View>
                    <Text style={{color: '#7F7F7F', fontSize: 16}}>
                      Supplier Details
                    </Text>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Name: </Text>
                      {bookedItem.supplier.name}
                    </Text>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>
                        Equipment Reg. Number:{' '}
                      </Text>
                      {bookedItem.equipment.registration_number}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  disabled={booking?.payments ? false : true}
                  onPress={() => setShowpayment(!showpayment)}
                  style={styles.operatorBox}>
                  <Image
                    resizeMode="cover"
                    source={Images.payment}
                    style={styles.supliericon}
                  />
                  <View>
                    <Text style={{color: '#7F7F7F', fontSize: 16}}>
                      Payment Details
                    </Text>

                    {booking?.payments && (
                      <>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>
                            Pending Payable:{' '}
                          </Text>
                          {booking?.payments?.pending_payable}
                        </Text>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>
                            Pending Receivable:{' '}
                          </Text>
                          {booking?.payments?.pending_receivable}
                        </Text>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>
                            Total Payable:{' '}
                          </Text>
                          {booking?.payments?.total_payable}
                        </Text>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>
                            Total Receivable:{' '}
                          </Text>
                          {booking?.payments?.total_receivable}
                        </Text>
                      </>
                    )}
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Amount Payed: </Text>
                      {booking?.amount_payed}
                    </Text>
                    {booking?.final_price && (
                      <Text style={{marginTop: 5}}>
                        <Text style={{fontWeight: '600'}}>Final Price: </Text>
                        {booking?.final_price}
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    style={{
                      marginLeft: wp(20),
                      marginTop: 2,
                    }}
                    name={
                      showpayment
                        ? 'chevron-down-sharp'
                        : 'chevron-forward-sharp'
                    }
                    size={24}
                    color={'#23262F'}
                  />
                </TouchableOpacity>

                {showpayment &&
                  booking?.payments?.transactions?.map((item, index) => {
                    return (
                      <View key={index} style={styles.operatorBox}>
                        <View>
                          <Text style={styles.reqHeadtext}>
                            Payment {index + 1}
                          </Text>
                          <View style={{marginLeft: 10}}>
                            <Text style={{marginTop: 5}}>
                              <Text style={{fontWeight: '600'}}>Amount: </Text>
                              {item.amount}
                            </Text>
                            <Text style={{marginTop: 5}}>
                              <Text style={{fontWeight: '600'}}>Status: </Text>
                              {item.status}
                            </Text>
                            <Text style={{marginTop: 5}}>
                              <Text style={{fontWeight: '600'}}>
                                Clearance Date:{' '}
                              </Text>
                              {moment(item.clearence_time).format('DD MMMM')}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            disabled={booking?.bids?.length == 0 ? true : false}
            onPress={() => BidsRef.current?.open()}
            style={styles.bidsbtn}>
            <Text style={{color: 'white'}}>
              Bids{' '}
              {booking?.bids?.length == 0
                ? '00'
                : booking?.bids?.length < 10
                ? `0${booking?.bids?.length}`
                : booking?.bids?.length}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <MyLoader />
      )}

      <Modalize
        ref={BidsRef}
        panGestureEnabled={true}
        withHandle={true}
        closeOnOverlayTap={true}
        // onPositionChange={c => setcheckP(c)}
        modalHeight={hp(50)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        handleStyle={{
          alignSelf: 'center',
          width: 45,
          height: 5,
          borderRadius: 5,

          backgroundColor: 'black',
        }}
        modalStyle={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#040415',
        }}
        HeaderComponent={
          <View style={styles.bidHeader}>
            <Text style={styles.Allbids}>All Bids</Text>
            {bookedItem && (
              <View style={styles.Requirementbox}>
                <View>
                  <Text style={styles.reqHeadtext}>Fulfilled Requirement</Text>
                  <Text style={styles.requirementtxt}>
                    {bookedItem?.fulfilled_requirements}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reqHeadtext}>Total Requirement</Text>
                  <Text style={styles.requirementtxt}>
                    {bookedItem?.total_requirements}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.bidderType}>
              <Text style={styles.reqHeadtext}>Bider</Text>
              <Text style={styles.reqHeadtext}>Price</Text>
            </View>
          </View>
        }>
        {booking?.bids?.length > 0 && (
          <>
            <View style={styles.bidsView}>
              <FlatList
                data={booking?.bids}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
              {/* <ScrollView scrollEnabled={true}>
                  {booking?.bids?.map((item, index) => {
                    return renderItem({item, index});
                  })}
                </ScrollView> */}
            </View>
          </>
        )}
      </Modalize>

      <ImageModal
        animationType="slide"
        transparent={true}
        visible={pagerModal}
        onRequestClose={() => {
          setpagerModal(!pagerModal);
        }}>
        {/* {onPress={async () => await Linking.openURL(item?.url)}} */}

        {bookedItem?.equipment?.images.length > 0 && (
          <ImageViewer
            enableSwipeDown={true}
            onSwipeDown={() => {
              setpagerModal(!pagerModal);
            }}
            imageUrls={bookedItem?.equipment?.images}
          />
        )}
      </ImageModal>

      <AlertModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        msg={malert}
        status={status}
        navigation={AlertNav}
      />

      <Modalize
        ref={modalizeRef}
        panGestureEnabled={true}
        withHandle={true}
        closeOnOverlayTap={false}
        // onPositionChange={c => setcheckP(c)}
        modalHeight={hp(100)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        handleStyle={{
          alignSelf: 'center',
          width: 45,
          height: 5,
          borderRadius: 5,
          backgroundColor: '#040415',
        }}
        modalStyle={{
          flex: 1,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
          backgroundColor: '#040415',
        }}
        HeaderComponent={
          <View style={{...styles.modalHeader}}>
            <TouchableOpacity
              onPress={() => modalizeRef.current.close()}
              style={{}}>
              <Ionicons name="chevron-back" size={24} color={'#fff'} />
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.White,
                fontWeight: '700',
                fontSize: 16,
              }}>
              Location
            </Text>
          </View>
        }>
        <View
          style={{
            ...styles.mView,
          }}>
          {booking && (
            <MapView
              ref={map}
              onMapReady={r => console.log('e', r)}
              style={{
                height: hp(95),
              }}
              customMapStyle={mapstyle}
              scrollEnabled
              provider={'google'}
              initialRegion={{
                latitude: booking?.location_a_latitude,
                longitude: booking?.location_a_longitude,
                latitudeDelta: 0.4922,
                longitudeDelta: 0.4421,
              }}>
              {booking?.location_a_latitude && booking?.location_a_longitude && (
                <MapViewDirections
                  origin={currentLoc}
                  destination={{
                    latitude: booking?.location_a_latitude,
                    longitude: booking?.location_a_longitude,
                  }}
                  mode={'DRIVING'}
                  onReady={result => {
                    cdis = result.distance;
                    cTime = result.duration;
                    setcurrentdis(result.distance);
                    setcurrenttime(result.duration);
                  }}
                  apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
                  strokeWidth={5}
                  strokeColor={Colors.Green}
                />
              )}

              <Marker
                ref={markerRef}
                coordinate={{
                  latitude: booking?.location_a_latitude,
                  longitude: booking?.location_a_longitude,
                }}
                // title={`${cTime?.toFixed(1)} min `}
                // description={`${cdis?.toFixed(1)} KM`}
                image={Images.locA}
              />

              <Marker coordinate={currentLoc}>
                <View style={{alignItems: 'center'}}>
                  {/* <Text style={{fontWeight: 'bold'}}>{'currentLocation'}</Text> */}
                  <Ionicons name="location" color={Colors.Primary} size={20} />
                </View>
              </Marker>

              {booking?.location_b_latitude && booking?.location_b_longitude && (
                <>
                  <Marker
                    coordinate={{
                      latitude: booking?.location_b_latitude,
                      longitude: booking?.location_b_longitude,
                    }}
                    // title={`${timeAB?.toFixed(1)} min `}
                    // description={`${disAB?.toFixed(1)} KM`}
                    image={Images.locB}
                  />
                  {booking?.location_b_latitude &&
                    booking?.location_b_longitude && (
                      <MapViewDirections
                        origin={{
                          latitude: booking?.location_a_latitude,
                          longitude: booking?.location_a_longitude,
                        }}
                        destination={{
                          latitude: booking?.location_b_latitude,
                          longitude: booking?.location_b_longitude,
                        }}
                        onReady={result => {
                          setdisAB(result.distance);
                          settimeAB(result.duration);
                        }}
                        apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
                        strokeWidth={5}
                        strokeColor={'#F15223'}
                      />
                    )}
                </>
              )}
            </MapView>
          )}
          {currentLoc && fittoCordinate(currentLoc)}
        </View>
      </Modalize>

      <Modal
        isVisible={modal}
        onBackdropPress={() => setModal(false)}
        onBackButtonPress={() => setModal(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalheading}>Choose Payment Method</Text>
          <TouchableOpacity
            onPress={() => {
              saddadPayment(null, true);
            }}
            style={styles.plist}>
            <MaterialIcons name="payments" size={30} color={Colors.Black} />
            <Text style={styles.ptext}> With Saddad</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              saddadPayment(null, false);
            }}
            style={styles.plist}>
            <MaterialIcons
              name="account-balance-wallet"
              size={30}
              color={Colors.Black}
            />
            <Text style={{...styles.ptext, left: 15}}>Cash On delivery</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {onlinePaymet && <Loader />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  priceInput: {
    flex: 1,
    borderBottomWidth: 1,
    alignSelf: 'center',
    padding: 0,
    minWidth: 150,
    textAlign: 'center',
    fontSize: 22,
  },
  markerview: {
    width: wp(10),
    height: hp(4),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 20,
  },
  statusBox: {
    backgroundColor: '#4E8B54',
    borderRadius: 7,
    marginBottom: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productContainer: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E6E6E6',
    height: 'auto',
    maxHeight: hp(27),
  },
  bookinginfoContainer: {
    borderWidth: 0.1,
    borderLeftWidth: 3,
    borderColor: '#4E8B54',
    backgroundColor: '#E6F5EA',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    width: wp(90),
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  locationPContainer: {
    borderColor: '#E6E6E6',
    flexDirection: 'row',
    width: wp(90),
  },
  productInfoContainer: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAE5B8',
    borderRadius: 20,
  },
  productRight: {
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  productLeft: {
    height: hp(9),
    width: hp(9),
    borderWidth: 0.5,
    borderColor: Colors.Gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginRight: 20,
    borderRadius: hp(9) / 3.5,
    backgroundColor: 'white',
  },
  locationABImage: {
    height: hp(14.5),
    marginTop: hp(3),
    marginLeft: 10,
  },
  locationAImage: {
    height: hp(4),
    marginTop: hp(3),
    marginLeft: 10,
  },
  locationImage: {
    height: hp(10),
    width: hp(10),
  },
  bidsbtn: {
    backgroundColor: 'black',
    height: hp(7),
    width: wp(80),
    borderRadius: hp(7) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: hp(1),
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 13,
    marginLeft: 5,
  },
  locationtxt: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  locationaddres: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.Gray,
  },
  supliericon: {
    width: hp(8),
    height: hp(8),
    marginRight: 15,
  },
  operatorBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E6E8F0',
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    height: hp(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // borderWidth:1,
    borderColor: '#fff',
    top: hp(1.5),
    width: wp(56),
    left: 10,
  },
  mView: {
    alignSelf: 'center',
    width: wp(100),
    borderRadius: 30,
    overflow: 'hidden',
    top: hp(3),
  },
  loctxt: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: wp(4.5),
    marginLeft: wp(6),
    marginTop: 5,
    width: wp(65),
  },
  placeInput: {
    height: 'auto',
    width: wp(90),
    borderRadius: 15,
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  backButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  locationView: {
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
    width: wp(95),
    // height:hp(5)
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
    width: wp(95),
  },
  bidsView: {
    width: wp(100),
    height: 'auto',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  bidHeader: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  Requirementbox: {
    flexDirection: 'row',
    width: wp(100),
    marginTop: 20,
    justifyContent: 'space-around',
  },
  bidderType: {
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#3F4044',
    marginTop: 20,
    width: wp(90),
    alignSelf: 'center',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Allbids: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
  },
  reqHeadtext: {
    fontWeight: 'bold',
    color: '#7F7F7F',
  },
  hammerImg: {
    height: 30,
    width: 30,
    marginRight: wp(5),
  },
  requirementtxt: {
    color: 'white',
    textAlign: 'center',
  },
  Info: {
    width: wp(90),
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
  modal: {
    // flex:1,
    backgroundColor: '#fff',
    height: '40%',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalheading: {
    marginTop: 15,
    fontWeight: '700',
    fontSize: 15,
  },
  plist: {
    marginTop: 15,
    alignSelf: 'flex-start',
    left: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptext: {
    color: '#000',
    fontSize: 15,
    left: 8,
  },
});
export default BookingDetail;

const mapstyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];
