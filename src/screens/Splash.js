import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Image, Alert} from 'react-native';
import Colors from '../utils/Colors';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../utils/Images';

import auth from '@react-native-firebase/auth';
import Api from '../utils/Api';
import {CommonActions} from '@react-navigation/native';
import {setServices} from '../redux/reducer';

export default Splash = ({navigation}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {Services, userInfo, Coustmer} = dashboardReducer;
  const dispatch = useDispatch();
  useEffect(() => {
    if (Services.length == 0) {
      Api.getServices(navigation).catch(err => Alert.alert('Network error'));
      return;
    }
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'SelectLanguage'}],
        }),
      );
    }, 500);

    return () => {};
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image source={Images.logo} style={{width: 185, height: 150}} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.White,
  },
});
