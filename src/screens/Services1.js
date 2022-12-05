import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  PanResponder,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {useSelector} from 'react-redux';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import Images from '../utils/Images';

const Services1 = () => {
  // const services = useSelector(state => state.services)

  const [services, setServices] = useState([]);

  let animatedValue = new Animated.Value(0);
  // let value = 0
  let values = [];

  let frontInferpolate = [];
  let backInferpolate = [];
  let frontAnimatedStyle = [];
  let backAnimatedStyle = [];

  services.map((item, index) => {
    values[index] = new Animated.Value(0);

    frontInferpolate[index] = values[index].interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    backInferpolate[index] = values[index].interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
    frontAnimatedStyle[index] = {
      transform: [{rotateY: frontInferpolate[index]}],
    };
    backAnimatedStyle[index] = {
      transform: [{rotateY: backInferpolate[index]}],
    };
  });

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    Api.getServices()
      .then(res => {
        if (res.response == 101) {
          setServices(res.data);
        }
      })
      .catch(e => console.log(e));

    return () => {};
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          width: Global.SCREEN_WIDTH,
          height: Global.SCREEN_HEIGHT,
        }}>
        <View
          style={{
            width: Global.SCREEN_WIDTH,
            height: Global.SCREEN_HEIGHT * 0.3,
            backgroundColor: Colors.Primary,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}></View>
      </View>

      <Text
        style={{
          color: Colors.Black,
          fontWeight: 'bold',
          fontSize: 20,
          marginVertical: 20,
          marginHorizontal: 10,
        }}>
        Choose the service you need
      </Text>

      {services.map((item, index) => {
        return (
          <TouchableWithoutFeedback
            key={item.id}
            onPress={() => {
              // if (values[index].__getValue() > 90) {
              //     return
              // }
              Animated.spring(values[index], {
                toValue: values[index].__getValue() > 90 ? 0 : 180,
                friction: 8,
                tension: 10,
                useNativeDriver: false,
              }).start();
            }}
            style={{flex: 1}}>
            <View style={{flex: 1}}>
              <Animated.View
                style={[
                  frontAnimatedStyle[index],
                  {
                    flex: 1,
                    backgroundColor: Colors.White,
                    margin: 0,
                    padding: 10,
                    borderRadius: 0,
                    elevation: 5,
                    backfaceVisibility: 'hidden',
                  },
                ]}>
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                <Image
                  source={{uri: item.icon}}
                  resizeMode={'contain'}
                  style={{width: '100%', height: '100%'}}></Image>
              </Animated.View>

              <Animated.View
                style={[
                  backAnimatedStyle[index],
                  {
                    flex: 1,
                    margin: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 10,
                    borderRadius: 0,
                    backgroundColor: Colors.White,
                    elevation: 5,
                    backfaceVisibility: 'hidden',
                  },
                ]}>
                <Animated.FlatList
                  data={item.categories}
                  horizontal
                  // contentContainerStyle={{ flexGrow: 1 }}
                  // onLayout={() => onLayout}
                  renderItem={({item, index}) => (
                    <View style={{}}>
                      <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                      <Image
                        source={{uri: item.icon}}
                        resizeMode={'contain'}
                        style={{
                          width: Global.SCREEN_WIDTH * 0.6,
                          height: '80%',
                        }}></Image>
                    </View>
                  )}
                  keyExtractor={item => item.id.toString()}
                />
                {/* <View>
                                    <ScrollView onLayout={() => onLayout} horizontal style={{}}>
                                        {item.categories.map((item, index) => {
                                            return (
                                                <View style={{}}>
                                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                    <Image source={{ uri: item.icon }} resizeMode={'contain'} style={{ width: Global.SCREEN_WIDTH * 0.6, height: '80%' }}></Image>
                                                </View>
                                            )
                                        })}
                                    </ScrollView>
                                </View> */}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        );
      })}

      {/* <TouchableWithoutFeedback onPress={() => flipCard()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={[frontAnimatedStyle, { flex: 1, backgroundColor: Colors.White, margin: 0, padding: 10, borderRadius: 0, elevation: 5, backfaceVisibility: 'hidden' }]}>
                        <Text style={{ fontWeight: 'bold' }}>Moving Service</Text>
                        <Image source={Images.serviceOne} resizeMode={'contain'} style={{ width: '100%', height: '100%' }}></Image>
                    </Animated.View>

                    <Animated.View style={[backAnimatedStyle, { flex: 1, margin: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 10, borderRadius: 0, backgroundColor: Colors.White, elevation: 5, backfaceVisibility: 'hidden', }]}>
                        <Text>nnn</Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback> */}

      {/* <TouchableWithoutFeedback onPress={() => flipCard()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={[{ flex: 1, backgroundColor: Colors.White, margin: 0, padding: 10, borderRadius: 0, elevation: 5, backfaceVisibility: 'hidden' }]}>
                        <Text style={{ fontWeight: 'bold' }}>Lifting Service</Text>
                        <Image source={Images.serviceTwo} resizeMode={'contain'} style={{ width: '100%', height: '100%' }}></Image>
                    </Animated.View>

                    <Animated.View style={[{ flex: 1, margin: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 10, borderRadius: 0, backgroundColor: Colors.White, elevation: 5, backfaceVisibility: 'hidden', }]}>
                        <Text>nnn</Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback> */}

      {/* <TouchableWithoutFeedback onPress={() => flipCard()} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={[{ flex: 1, backgroundColor: Colors.White, margin: 0, padding: 10, borderRadius: 0, elevation: 5, backfaceVisibility: 'hidden' }]}>
                        <Text style={{ fontWeight: 'bold' }}>Recovery Service</Text>
                        <Image source={Images.serviceThree} resizeMode={'contain'} style={{ width: '100%', height: '100%' }}></Image>
                    </Animated.View>

                    <Animated.View style={[{ flex: 1, margin: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 10, borderRadius: 0, backgroundColor: Colors.White, elevation: 5, backfaceVisibility: 'hidden', }]}>
                        <Text>nnn</Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback> */}

      {/* <View style={{ flex: 1, margin: 5, padding: 10, borderRadius: 10, backgroundColor: Colors.White, elevation: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Lifting Service</Text>
                <Image source={Images.serviceTwo} resizeMode={'contain'} style={{ width: '100%', height: '100%' }}></Image>
            </View>
            <View style={{ flex: 1, margin: 5, padding: 10, borderRadius: 10, backgroundColor: Colors.White, elevation: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Recovery Service</Text>
                <Image source={Images.serviceThree} resizeMode={'contain'} style={{ width: '100%', height: '100%' }}></Image>
            </View> */}
    </SafeAreaView>
  );
};

export default Services1;
