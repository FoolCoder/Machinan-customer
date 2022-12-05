import React, {useEffect} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {Pusher} from '@pusher/pusher-websocket-react-native';

const ShowLive = props => {
  const {bId} = props.route.params;
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
        onSubscriptionSucceeded: (channelName, data) => {
          // console.log(`Subscribed to ${channelName}`);
          //   console.log(`I can now access me: ${myChannel.me}`);
          //   console.log(`And here are the channel members: ${myChannel.members}`);
        },
        onMemberAdded: member => {
          console.log(`Member added: ${member}`);
        },
        onMemberRemoved: member => {
          console.log(`Member removed: ${member}`);
        },
        // onSubscriptionError,
        // onDecryptionFailure,
      });

      await pusher.subscribe({channelName: `booking-${bId}`}); // booking id
      await pusher.connect();
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
  };

  return (
    <SafeAreaView>
      <Text>ccd{bId}</Text>
    </SafeAreaView>
  );
};

export default ShowLive;
