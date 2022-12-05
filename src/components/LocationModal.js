import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, {Marker} from 'react-native-maps';
import {Modalize} from 'react-native-modalize';
import Colors from '../utils/Colors';
import {latoRegular, latoSemiBold} from '../utils/Global';
import Images from '../utils/Images';
import {hp, wp} from './Responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRef} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
const Google_Api_Key = 'AIzaSyBxbVAY91kc6Yno7KbB0VtxmviT4rtIxPI';

function LocationModal(props) {
  const {modalizeRefLoc, flag, setModal, ModalClose} = props;
  const map = useRef(null);
  const [mapModal, setmapModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [detaillocation, setDetailLocation] = useState(null);
  const [address, setaddress] = useState('Search Places');
  useEffect(() => {
    Geocoder.init(Google_Api_Key);
  }, []);

  const GooglePlacesComplete = props => {
    return (
      <View style={styles.gView}>
        <GooglePlacesAutocomplete
          // ref={ref}
          placeholder={address}
          fetchDetails={true}
          onPress={(data, details = null) => {
            setLocation({
              lat: details.geometry.location.lat,
              lon: details.geometry.location.lng,
            });
            setaddress(data.description);
          }}
          query={{
            key: Google_Api_Key,
            language: 'en',
            components: 'country:qa',
          }}
          textInputProps={{
            defaultValue: address,
            editable: true,
          }}
          styles={{
            container: {
              flex: 1,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            textInputContainer: {
              width: wp(85),
              alignSelf: 'center',
            },
            listView: {
              position: 'absolute',
              height: hp(20),
              backgroundColor: Colors.White,
              zIndex: 2,
              top: hp(6),
            },
            row: {
              backgroundColor: '#FFFFFF',
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: '#c8c7cc',
            },
            textInput: {
              marginLeft: 4,
              marginRight: 0,
              height: 38,
              color: '#000',
              fontSize: 16,
              borderBottomWidth: 1,
              marginTop: 8,
            },
          }}
        />
        <TouchableOpacity
          style={{width: 25, alignSelf: 'flex-end', top: -15}}
          onPress={() => {
            setaddress('Search Places');
            setLocation(null);
          }}>
          <Image source={Images.cross} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
    );
  };
  const Geocoding = (lat, lon) => {
    Geocoder.from(lat, lon)
      .then(json => {
        var addressComponent = json.results[0]?.address_components[1]?.long_name
          ? json.results[0]?.address_components[1]?.long_name
          : json.results[1]?.formatted_address;
        // console.log(addressComponent);
        setaddress(addressComponent);
      })
      .catch(error => console.warn(error));
  };
  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // setcurrentLoc({
        //   latitude: position?.coords.latitude,
        //   longitude: position?.coords.longitude,
        // });
        const cords = position?.coords;
        // console.log(cords);
        setLocation({
          lat: cords?.latitude,
          lon: cords?.longitude,
        });
        Geocoding(cords?.latitude, cords?.longitude);
        let r = {
          latitude: cords?.latitude,
          longitude: cords?.longitude,
          latitudeDelta: 0.5922,
          longitudeDelta: 0.5421,
        };

        map.current.animateToRegion(r, 1000);
        // ModalClose(flag, location, address);
        // placeBid(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  return (
    <>
      <Modal
        visible={modalizeRefLoc}
        animationType="slide"
        style={{
          height: hp(100),
          backgroundColor: '#040415',
          flex: 1,
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
          <View
            style={{
              backgroundColor: '#040415',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                width: wp(95),
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 8,
                height: hp(3),
              }}>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Ionicons name="chevron-back" size={24} color={'#fff'} />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: hp(2.5),
                  fontWeight: '700',
                  fontFamily: latoSemiBold,
                  color: '#fff',
                }}>
                {`Choose ${flag}`}
              </Text>
              <View style={{width: 24}} />
            </View>

            <View
              style={{
                ...styles.placeInput,
              }}>
              <View
                style={{
                  width: wp(98),
                  alignItems: 'center',
                }}>
                {/* <Text
                  style={{
                    ...styles.loctxt,
                  }}>
                  {flag}
                </Text> */}

                <GooglePlacesComplete status={'loc A'} />
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: wp(38),
                    alignSelf: 'flex-start',
                    left: wp(5),
                    marginTop: 8,
                  }}
                  onPress={() => {
                    setmapModal(true);
                  }}>
                  <MaterialCommunityIcons
                    name="google-maps"
                    size={30}
                    color="#000"
                  />
                  <Text
                    style={{
                      fontFamily: latoSemiBold,
                      fontWeight: '700',

                      fontSize: wp(4),
                    }}>
                    Choose on Map
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={location ? false : true}
                  onPress={() => ModalClose(flag, location, address)}
                  style={{
                    ...styles.btn,
                    marginTop: hp(5),
                    backgroundColor: location ? Colors.Black : Colors.Gray,
                  }}>
                  <Text style={styles.btnTxt}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={mapModal} animationType="slide">
        <View
          style={{
            ...styles.mView,
          }}>
          <MapView
            ref={map}
            style={{
              height: hp(100),
            }}
            onRegionChange={() => setaddress('Search Places')}
            onRegionChangeComplete={e => {
              setLocation({
                lat: e.latitude,
                lon: e.longitude,
              });
              Geocoding(e.latitude, e.longitude);
            }}
            maxZoomLevel={15}
            customMapStyle={mapstyle}
            scrollEnabled
            provider={'google'}
            initialRegion={{
              latitude: 25.286106,
              longitude: 51.534817,
              latitudeDelta: 0.5922,
              longitudeDelta: 0.5421,
            }}>
            {location && (
              <Marker
                coordinate={{
                  latitude: location?.lat,
                  longitude: location?.lon,
                }}
                centerOffset={{x: -18, y: -60}}
                anchor={{x: 0.69, y: 1}}
                image={flag == 'Location A' ? Images.locA : Images.locB}
                style={{
                  width: 30,
                  height: 35,
                  position: 'absolute',
                  zIndex: 2,
                }}
              />
            )}
          </MapView>
        </View>
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -wp(5),
            marginTop: -hp(5),
            // zIndex:1
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={Images.pin}
          />
        </View>
        <TouchableOpacity
          onPress={() => setmapModal(false)}
          style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={'#23262F'} />
        </TouchableOpacity>
        {address != 'Search Places' && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: wp(-15),
              marginTop: hp(-12),
              width: 'auto',
              height: hp(6),
              backgroundColor: Colors.White,
              borderRadius: 8,
              // zIndex:1
            }}>
            <Text
              style={{
                padding: 10,
              }}>
              {address}
            </Text>
          </View>
        )}
        <TouchableOpacity
          // disabled={location && address != 'Search Places' ? false : true}
          onPress={() => {
            getUserLocation();
          }}
          style={{
            ...styles.btn,
            width: wp(10),
            height: wp(10),
            // marginTop: hp(5),
            backgroundColor: Colors.Black,
            // location && address != 'Search Places'
            //   ? Colors.Black
            //   : Colors.Gray,
            position: 'absolute',
            bottom: 90,
            right: 20,
          }}>
          <Ionicons name="locate" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={location && address != 'Search Places' ? false : true}
          onPress={() => ModalClose(flag, location, address)}
          style={{
            ...styles.btn,
            // marginTop: hp(5),
            backgroundColor:
              location && address != 'Search Places'
                ? Colors.Black
                : Colors.Gray,
            position: 'absolute',
            bottom: 20,
          }}>
          <Text style={styles.btnTxt}>Done</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  gView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mView: {
    alignSelf: 'center',
    width: wp(100),
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    overflow: 'hidden',
    top: hp(2),
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
    top: hp(4),
  },
  placeInput: {
    height: hp(25),
    width: wp(100),
    // borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(3.2),
    // position:'absolute'
  },

  loctxt: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: wp(4.5),
    left: wp(6),
    marginTop: 5,
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

  addresView: {
    width: wp(72),
    alignSelf: 'center',
    height: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default LocationModal;
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
