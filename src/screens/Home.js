import React, {useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const Home = () => {
  useEffect(() => {
    connect();
    return () => {};
  }, []);

  const connect = async () => {
    const pusher = Pusher.getInstance();
    // console.log('pusher', pusher);
    try {
      await pusher.init({
        apiKey: 'd4bb157e5fda4f14ec24',
        cluster: 'ap2',
        // authEndpoint: '<YOUR ENDPOINT URI>',
        // onConnectionStateChange,
        // onError,
        onEvent: event => {
          // console.log(`onEvent: ${event}`);
        },
        // onSubscriptionSucceeded,
        // onSubscriptionError,
        // onDecryptionFailure,
        // onMemberAdded,
        // onMemberRemoved,
      });

      await pusher.subscribe({channelName: 'booking-1'});
      await pusher.connect();
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <Text>Home</Text> */}

      {/* <GooglePlacesAutocomplete
                placeholder='Search'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                }}
                query={{
                    key: 'AIzaSyBxbVAY91kc6Yno7KbB0VtxmviT4rtIxPI',
                    language: 'en',
                }}
                styles={{
                    container: {
                        flex: 1
                    },
                    textInputContainer: {
                        flex: 1,
                        width: 250,
                        // backgroundColor: 'white',
                        // borderRadius: 10,
                        // borderWidth: 0.5,
                        // margin: 10,
                    },
                }}
            /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContent: {
    flexDirection: 'row',
    margin: 16,
  },
  movieContent: {
    margin: 8,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  imagew: {
    width: 80,
    height: 80,
  },
  mcontent: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default Home;
