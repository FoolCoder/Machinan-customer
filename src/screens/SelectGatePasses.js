import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import {wp, hp} from '../components/Responsive';

const SelectGatePasses = ({navigation, route}) => {
  const {productId, passes, previouspasses} = route.params;
  // const [passes, setPasses] = useState([])
  const [refresh, setRefresh] = useState(false);
  const [locationIds, setLocationIds] = useState([]);

  const DATA = [];

  useEffect(() => {
    if (previouspasses) {
      setLocationIds(previouspasses);
    } else {
      setLocationIds([]);
    }
  }, []);

  const SelectPasses = item => {
    if (locationIds.some(e => e.id === item.id)) {
      const newList = locationIds.filter(i => i.id != item.id);
      setLocationIds(newList);
    } else {
      setLocationIds([...locationIds, item]);
    }
  };
  passes.map((item, index) => {
    DATA.push({title: item.name, data: item.gatepasses});
  });
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: Colors.Black,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => {
            // route.params.onSelect(locationIds);
            navigation.goBack();
          }}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} color={Colors.White} />
        </TouchableOpacity>
        <Text style={{color: Colors.White, fontWeight: 'bold', fontSize: 24}}>
          Select GatePasses
        </Text>
      </View>
      {DATA.length != 0 && (
        <SectionList
          style={{margin: 10, height: Global.SCREEN_HEIGHT - 200}}
          showsVerticalScrollIndicator={false}
          scrollEnabled
          sections={DATA}
          // sections={DATA1.filter((item, index) => moment(item.shift_date).isSame(moment(date), 'day'))}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => SelectPasses(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 5,
                  borderBottomWidth: 0.5,
                  borderColor: Colors.Gray,
                }}>
                <Text>{item.name}</Text>
                {locationIds.some(i => i.id == item.id) && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 10,
                      backgroundColor: Colors.Primary,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          extraData={refresh}
          renderSectionHeader={({section: {title, data}}) => (
            <View style={{paddingHorizontal: 10}}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, marginVertical: 10}}>
                {data.length == 0 ? '' : title}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
          keyExtractor={(item, index) => item?.id.toString()}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          route.params.onSelect(locationIds);
          navigation.goBack();
        }}
        style={styles.btn}>
        <Text style={styles.btnTxt}>Select</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: wp(80),
    backgroundColor: Colors.Black,
    borderRadius: hp(7) / 2,
    height: hp(7),
    alignSelf: 'center',
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: Colors.White,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SelectGatePasses;
