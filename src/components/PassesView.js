import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useRef} from 'react';
import Colors from '../utils/Colors';
import Button from '../components/Button';
import {hp} from './Responsive';
import Images from '../utils/Images';
import {Modalize} from 'react-native-modalize';
import {useEffect} from 'react';

const PassesView = props => {
  const {passes, title, modalizeRef} = props;

  useEffect(() => {}, []);
  return (
    <Modalize
      ref={modalizeRef}
      // snapPoint={300}
      panGestureEnabled
      withHandle
      //onClosed={modalizeRef.current?.close()}
      // modalTopOffset={300}
      closeOnOverlayTap={false}
      modalHeight={hp(50)}
      keyboardAvoidingBehavior="height"
      // onPositionChange={c => setcheckP(c)}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'always',
        // contentContainerStyle: {height: '100%'},
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#040415',
      }}
      HeaderComponent={
        <>
          <View style={styles.headercomponent}>
            <Image source={Images.gatepass} style={styles.gateimg} />
            <Text style={{fontSize: 22, color: 'white'}}>{'Location A'}</Text>
            <Text style={{fontSize: 16, color: '#7F7F7F'}}>Gate Passes</Text>
          </View>
          <View
            style={{
              width: '93%',
              borderWidth: 0.5,
              borderColor: '#3F4044',
              alignSelf: 'center',
            }}
          />
        </>
      }>
      <View
        style={{
          backgroundColor: Colors.Black,
          padding: 10,
          borderRadius: 10,
        }}>
        <View style={{marginVertical: 30}}>
          {passes?.map((item, index) => (
            <View
              key={index}
              //   onPress={() => {
              //     // setSelectedDistance(item)
              //   }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                borderColor: Colors.LightGray,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={Images.greentick} style={styles.greentick} />
                <Text style={{color: 'white', fontSize: 14}}>{item.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    modalizeRef?.current?.close();
                  }}
                  style={{marginRight: 20}}>
                  <Text style={{color: 'white', fontSize: 14}}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={Images.deleteimg}
                    style={{height: 27, width: 27}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: hp(60),
    width: '100%',
    alignSelf: 'center',
  },
  gateimg: {
    width: 43,
    height: 43,
  },
  greentick: {
    height: 17,
    width: 17,
    marginRight: 10,
  },
  headercomponent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '35%',
  },
});

export default PassesView;
