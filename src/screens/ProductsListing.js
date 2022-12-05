import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Pressable,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp, wp} from '../components/Responsive';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import {Modalize} from 'react-native-modalize';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps';
import {latoRegular, latoSemiBold} from '../utils/Global';
import {
  getCenter,
  getBoundsOfDistance,
  getCenterOfBounds,
  getGreatCircleBearing,
  getBounds,
} from 'geolib';
import Geocoder from 'react-native-geocoding';
import LocationModal from '../components/LocationModal';
import MapViewDirections from 'react-native-maps-directions';
import MyLoader from '../components/MyLoader';

const ProductsListing = ({navigation, route}) => {
  //useREf
  const map = useRef(null);
  const modalizeRef = useRef(null);
  //Usestate
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setselectedService] = useState(null);
  const [selectedIndex, setselectedIndex] = useState(null);
  const [locationACord, setLocationACord] = useState(null);
  const [addressA, setAddressA] = useState('Search Places');
  const [addressB, setAddressB] = useState('Search Places');
  const [locationBCord, setLocationBCord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalA, setModalA] = useState(false);
  const [modalB, setModalB] = useState(false);
  const Google_Api_Key = 'AIzaSyBxbVAY91kc6Yno7KbB0VtxmviT4rtIxPI';
  const Anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const ac = new AbortController();
    Geocoder.init(Google_Api_Key);
    Api.getCategories(route.params.serviceId)
      .then(res => {
        if (res.response == 101) {
          setCategories(res.data);
          setSelectedCategory(res.data[0]);
          setLoading(false);
        }
      })
      .catch(e => console.log(e));

    return () => {
      ac.abort();
    };
  }, []);

  const renderGroup = ({item, index}) => {
    return (
      <>
        {item?.capacity ? (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setselectedService(item);
              setselectedIndex(index);
              onOpen();
            }}
            style={{
              ...styles.fList,
              borderColor:
                selectedIndex == index && selectedService == item
                  ? Colors.Primary
                  : '#E6E8EC',
            }}>
            {selectedIndex == index && selectedService == item && (
              <Image style={styles.tick} source={Images.tick} />
            )}

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: wp(5.8),
                color: Colors.Black,
              }}>
              {item?.capacity}
            </Text>
            <Text
              style={{
                fontFamily: latoRegular,
                fontWeight: '700',
                color: '#7F7F7F',
                fontSize: wp(4),
              }}>
              TON
            </Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };
  const fittoCordinate = (c1, c2) => {
    setTimeout(() => {
      map.current?.fitToCoordinates(
        [
          {
            latitude: c1.lat,
            longitude: c1.lon,
          },
          {
            latitude: c2.lat,
            longitude: c2.lon,
          },
        ],
        {
          edgePadding: {
            bottom: 20,
            right: 55,
            top: 40,
            left: 55,
          },
          animated: true,
        },
      );
    }, 1000);
  };

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const checkLocationType = type => {
    if (type == 'A') {
      if (
        selectedService?.config.location_type == 'A-B' ||
        selectedService?.config.location_type == 'A' ||
        selectedService?.config.location_type == 'A allow B'
      ) {
        return true;
      }
    }
    if (type == 'B') {
      if (
        selectedService?.config?.location_type == 'A-B' ||
        selectedService?.config?.location_type == 'B' ||
        selectedService?.config.location_type == 'A allow B'
      ) {
        return true;
      }
    }
    if (type == 'S') {
      if (
        selectedService?.config.location_type == 'A-B' ||
        selectedService?.config.location_type == 'A allow B'
      ) {
        return true;
      }
    }
    if ((type = 'A-B')) {
      if (selectedService?.config?.location_type == 'A-B') {
        if (locationACord == null || locationBCord == null) {
          return Alert.alert('Location A and B Required');
        }
        return true;
      }
    }
    if ((type = 'A allow B')) {
      if (selectedService?.config?.location_type == 'A allow B') {
        if (locationACord == null) {
          return Alert.alert('Location A Required');
        }
        return true;
      }
    }
  };
  const animateToCordRegion = (cord1, cord2) => {
    map.current?.animateToRegion(
      {
        latitude: cord1.lat,
        longitude: cord1.lon,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      },

      1500,
    );
  };

  const ContinueClick = () => {
    if (checkLocationType(selectedService?.config.location_type)) {
      navigation.navigate('Review', {
        product: selectedService,
        locationA: locationACord,
        locationB: locationBCord,
        addressA: addressA,
        addressB: addressB,
      });
      modalizeRef.current.close();
      setAddressA('Search Places');
      setAddressB('Search Places');
      setLocationACord(null);
      setLocationBCord(null);
    }
  };
  const ModalClose = (flag, loc, title) => {
    console.log(title);
    if (flag == 'Location A') {
      setModalA(!modalA);
      setAddressA(title);
      setLocationACord(loc);
    } else {
      setModalB(!modalB);
      setAddressB(title);
      setLocationBCord(loc);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={'#23262F'} />
        </TouchableOpacity>
        <Text style={styles.title}>{route.params.serviceName}</Text>
      </View>

      {loading ? (
        <MyLoader />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{...styles.sview, marginTop: 15}}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedCategory(item)}
                style={{
                  ...styles.category,
                  backgroundColor:
                    item.id == selectedCategory?.id ? Colors.Black : undefined,
                }}>
                <Text
                  style={{
                    ...styles.cName,
                    color:
                      item.id == selectedCategory?.id
                        ? Colors.White
                        : Colors.Black,
                  }}>
                  {item.name?.en}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedCategory?.groups.map((item, index) => {
            return (
              <View
                key={index}
                style={
                  {
                    // borderWidth:1
                  }
                }>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    color: Colors.Black,
                    left: wp(7),
                    marginTop: 30,
                  }}>
                  {item.name.en}
                </Text>
                <FlatList
                  style={{
                    marginLeft: wp(5),
                    marginTop: 15,
                  }}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={item.products}
                  renderItem={renderGroup}
                  ItemSeparatorComponent={() => <View style={{height: 10}} />}
                  keyExtractor={item => item.id.toString()}
                />
              </View>
            );
          })}
        </>
      )}
      <Modalize
        ref={modalizeRef}
        withHandle={false}
        closeOnOverlayTap={false}
        modalHeight={hp(100)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        panGestureEnabled={false}
        modalStyle={{
          flex: 1,
          backgroundColor: '#040415',
        }}
        HeaderComponent={
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => modalizeRef.current.close()}
              style={{}}>
              <Ionicons name="chevron-back" size={24} color={'#fff'} />
            </TouchableOpacity>
            <Text style={styles.locheading}>Select Your Location</Text>
          </View>
        }>
        <ScrollView>
          <View
            style={{
              ...styles.mView,
            }}>
            <MapView
              ref={map}
              style={{
                height: checkLocationType('B') ? hp(63) : hp(70),
              }}
              initialRegion={{
                latitude: 25.286106,
                longitude: 51.534817,
                latitudeDelta: 0.5922,
                longitudeDelta: 0.5421,
              }}
              paddingAdjustmentBehavior="automatic"
              fitToElements={true}
              zoomEnabled={true}
              minZoomLevel={0}
              maxZoomLevel={20}
              customMapStyle={mapstyle}
              scrollEnabled
              provider={'google'}
              zoomControlEnabled>
              {locationACord && (
                <Marker
                  coordinate={{
                    latitude: locationACord?.lat,
                    longitude: locationACord?.lon,
                  }}
                  centerOffset={{x: -18, y: -60}}
                  anchor={{x: 0.69, y: 1}}
                  image={Images.locA}
                  style={{
                    width: 30,
                    height: 35,
                    position: 'absolute',
                    zIndex: 2,
                  }}
                  draggable={true}
                />
              )}
              {locationBCord && (
                <Marker
                  coordinate={{
                    latitude: locationBCord?.lat,
                    longitude: locationBCord?.lon,
                  }}
                  centerOffset={{x: -18, y: -60}}
                  anchor={{x: 0.69, y: 1}}
                  image={Images.locB}
                  style={{width: 30, height: 35}}
                />
              )}
              {locationACord && locationBCord ? (
                <MapViewDirections
                  origin={{
                    latitude: locationACord.lat,
                    longitude: locationACord.lon,
                  }}
                  destination={{
                    latitude: locationBCord.lat,
                    longitude: locationBCord.lon,
                  }}
                  mode={'DRIVING'}
                  onReady={result => {
                    // setcurrentdis(result.distance);
                    // setcurrenttime(result.duration);
                  }}
                  apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
                  strokeWidth={5}
                  strokeColor={Colors.Green}
                />
              ) : null}
              {/* {bounds && (
              <Polygon
                coordinates={[
                  {
                    latitude: bounds.maxLat,
                    longitude: bounds.maxLng,
                  },
                  {
                    latitude: bounds.minLat,
                    longitude: bounds.minLng,
                  },
                ]}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeColor="rgba(0,0,0,0.5)"
                strokeWidth={2}
              />
            )} */}
            </MapView>
          </View>

          {locationACord && animateToCordRegion(locationACord)}
          {locationACord &&
            locationBCord &&
            fittoCordinate(locationACord, locationBCord)}

          {selectedService && (
            <View
              style={{
                ...styles.placeInput,
                height: checkLocationType('B') ? 'auto' : hp(20.5),

                // top: checkLocationType('B') ? hp(50) : hp(62),
              }}>
              {checkLocationType('B') && (
                <Image
                  style={{
                    width: 18,
                    height: hp(12),
                    top: hp(2.2),
                    left: 5,
                  }}
                  resizeMode="contain"
                  source={Images.locAB}
                />
              )}

              <View
                style={{
                  width: wp(82),
                  // borderWidth:1,
                  alignSelf: 'flex-end',
                }}>
                {checkLocationType('A') && (
                  <>
                    <Text
                      style={{
                        ...styles.loctxt,
                        marginTop: hp(1.3),
                      }}>
                      Location A
                    </Text>
                    <View
                      style={{
                        ...styles.addresView,
                      }}>
                      <TouchableOpacity
                        onPress={() => setModalA(true)}
                        style={{width: wp(65)}}>
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'left',
                          }}
                          numberOfLines={1}>
                          {addressA}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setAddressA('Search Places');
                          setLocationACord(null);
                        }}>
                        <Image
                          source={Images.cross}
                          style={{height: 20, width: 20, right: 0, top: -17}}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {checkLocationType('S') && (
                  <View style={styles.seprator}>
                    <View
                      style={{
                        height: 1.5,
                        backgroundColor: '#E6E6E6',
                        width: wp(65),
                        left: 12,
                      }}
                    />
                  </View>
                )}
                {checkLocationType('B') && (
                  <>
                    <Text style={{...styles.loctxt}}>Location B</Text>
                    <View
                      style={{
                        ...styles.addresView,
                      }}>
                      <TouchableOpacity
                        onPress={() => setModalB(true)}
                        style={{
                          // borderWidth:1,
                          width: wp(65),
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'left',
                          }}
                          numberOfLines={1}>
                          {addressB}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setAddressB('Search Places');
                          setLocationBCord(null);
                        }}>
                        <Image
                          source={Images.cross}
                          style={{height: 20, width: 20, right: 0, top: -17}}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  disabled={locationACord || locationBCord ? false : true}
                  onPress={() => ContinueClick()}
                  style={{
                    ...styles.btn,
                    marginLeft: checkLocationType('B') ? -hp(2) : 0,
                  }}>
                  <Text style={styles.btnTxt}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </Modalize>
      {modalA && (
        <LocationModal
          modalizeRefLoc={modalA}
          setModal={setModalA}
          ModalClose={ModalClose}
          flag={'Location A'}
        />
      )}
      {modalB && (
        <LocationModal
          modalizeRefLoc={modalB}
          setModal={setModalB}
          ModalClose={ModalClose}
          flag={'Location B'}
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
    // backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  back: {
    position: 'absolute',
    left: 20,
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sview: {
    borderWidth: 0.5,
    width: 'auto',
    borderRadius: 22,
    borderColor: '#E6E8EC',
    elevation: 1,
    backgroundColor: Colors.White,
    height: 'auto',
    alignSelf: 'center',
    marginTop: 5,
    maxWidth: wp(88),
    zIndex: 1,
    flexDirection: 'row',
    flexGrow: 0,
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: wp(20),
    marginLeft: 1,
    marginVertical: 2,
    maxWidth: wp(70),
    // borderWidth:1
  },
  cName: {
    fontWeight: '700',
    fontFamily: latoRegular,
    fontSize: 16,
    minWidth: wp(30),
    textAlign: 'center',
    maxWidth: wp(60),
    paddingLeft: 10,
    paddingRight: 10,
  },
  fList: {
    backgroundColor: Colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    height: hp(10),
    width: wp(22),
    borderWidth: 1,
    marginHorizontal: 5,
  },
  tick: {
    height: 15,
    width: 15,
    position: 'absolute',
    top: -1,
    right: 0,
  },
  mView: {
    alignSelf: 'center',
    width: wp(100),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    top: hp(3),
  },
  placeInput: {
    width: wp(100),
    // borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(3.2),
    borderWidth: 1,
  },
  gView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loctxt: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: wp(4.5),
    left: wp(6),
    marginTop: 5,
  },
  seprator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    alignSelf: 'center',
    top: 0,
    marginVertical: 5,
  },
  locheading: {
    color: Colors.White,
    fontWeight: '700',
    fontSize: wp(5),
    textAlign: 'center',
    // borderColor: '#fff',
    // height: hp(4),
    // marginTop: 12,
    fontFamily: latoSemiBold,
  },
  btn: {
    width: wp(70),
    backgroundColor: Colors.Black,
    borderRadius: hp(7) / 2,
    height: hp(7),
    alignSelf: 'center',
    marginVertical: hp(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: Colors.White,
    fontFamily: latoSemiBold,
    fontWeight: '600',
    fontSize: 15,
  },
  placeSearchView: {
    maxHeight: hp(40),
    width: wp(72),
    borderRadius: 5,
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'center',
    backgroundColor: '#fff',
    left: wp(10),
  },
  modalHeader: {
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // borderWidth:1,
    borderColor: '#fff',
    top: hp(1.5),
    width: wp(70),
    left: 10,
    // backgroundColor: 'red',
  },
  addresView: {
    // borderWidth: 1,
    width: wp(72),
    alignSelf: 'center',
    height: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default ProductsListing;

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
