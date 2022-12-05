import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import Api from '../utils/Api';
import MyLoader from '../components/MyLoader';
import Loader from '../components/Loader';

const Dispute = ({navigation, route}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, Splash} = dashboardReducer;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const {booking} = route.params;
  const [notes, setNotes] = useState('');
  const [disputeData, setDisputeData] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    Api.getDisputeData(userInfo?.token, booking?.id)
      .then(res => {
        setLoadingData(false);
        if (res?.response == 101) {
          setDisputeData(res?.data);
        }
      })
      .catch(e => console.log(e));

    return () => {};
  }, []);

  const createDispute = () => {
    if (notes == '') {
      Alert.alert('Machinan', 'Please enter some details');
      return;
    }
    setLoading(true);
    Api.createDispute(userInfo.token, booking.id, notes)
      .then(res => {
        setLoading(false);
        setNotes('');
        if (res.response == 101) {
          Alert.alert('SmartShifts', res.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
          return;
        }
        if (res.response == 100) {
          Alert.alert('SmartShifts', res.message);
        }
      })
      .catch(e => console.log(e));
  };

  const respondDispute = () => {
    if (notes == '') {
      Alert.alert('Machinan', 'Please enter some details');
      return;
    }
    setLoading(true);
    Api.replyDispute(userInfo.token, disputeData.id, notes)
      .then(res => {
        setLoading(false);
        setNotes('');
        if (res.response == 101) {
          Alert.alert('SmartShifts', res.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
          return;
        }
        if (res.response == 100) {
          Alert.alert('SmartShifts', res.message);
        }
      })
      .catch(e => console.log(e));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Dispute</Text>
      </View>

      <View style={{margin: 20}}>
        {/* <Text style={{ fontSize: 18 }}>Create Dispute</Text> */}
        <Text style={{marginTop: 10}}>
          We're sorry to hear that you have a problem with this job. Please use
          the form below to tell us a little about the issue.
        </Text>
      </View>

      {loadingData ? (
        <MyLoader />
      ) : (
        <>
          {disputeData && (
            <>
              <View style={{margin: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {disputeData?.from?.name}
                </Text>
                <Text>{disputeData?.complain?.message}</Text>
              </View>

              {disputeData.reply && (
                <View style={{margin: 10, marginTop: 20}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {disputeData?.against?.name}
                  </Text>
                  <Text>{disputeData?.reply?.message}</Text>
                </View>
              )}
            </>
          )}

          {(!disputeData || (disputeData && disputeData?.need_reply)) && (
            <TextInput
              placeholder="Enter details"
              value={notes}
              onChangeText={val => setNotes(val)}
              textAlignVertical="top"
              style={styles.input}
            />
          )}

          {(!disputeData || (disputeData && disputeData?.need_reply)) && (
            <Button
              label={'Send Message'}
              //loading={loading}
              style={styles.btn}
              onPress={() => {
                disputeData ? respondDispute() : createDispute();
              }}></Button>
          )}
        </>
      )}
      {loading && <Loader />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    minHeight: 150,
  },
  btn: {marginTop: 20, marginRight: 10, alignSelf: 'flex-end'},
});

export default Dispute;
