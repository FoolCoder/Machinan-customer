import React, {useEffect, useState} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../utils/Colors';
import Account from '../screens/Account';
import Services from '../screens/Services';
import ProductsListing from '../screens/ProductsListing';
import Review from '../screens/Review';
import Register from '../screens/Register';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Bookings from '../screens/Bookings';
import CreateAccount from '../screens/CreateAccount';
import SelectGatePasses from '../screens/SelectGatePasses';
import BookingDetail from '../screens/BookingDetail';
import Dispute from '../screens/Dispute';
import Notifications from '../screens/Notifications';
import AllBids from '../screens/AllBids';
import SadaddCheckout from '../screens/SadaddCheckout';
import ShowLive from '../screens/ShowLive';
import {hp, wp} from '../components/Responsive';
import Images from '../utils/Images';
import {Image, View} from 'react-native';
import {BackHandler} from 'react-native';
import SuppierProfile from '../screens/SuppierProfile';

const ServicesStack = createNativeStackNavigator();
const ServicesStackScreens = () => (
  <ServicesStack.Navigator initialRouteName="Services">
    <ServicesStack.Screen
      name={'Services'}
      component={Services}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <ServicesStack.Screen
      name={'ProductsListing'}
      component={ProductsListing}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <ServicesStack.Screen
      name={'Review'}
      component={Review}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <ServicesStack.Screen
      name={'Register'}
      component={Register}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <ServicesStack.Screen
      name={'CreateAccount'}
      component={CreateAccount}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <ServicesStack.Screen
      name={'SelectGatePasses'}
      component={SelectGatePasses}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
  </ServicesStack.Navigator>
);

const BookingsStack = createNativeStackNavigator();
const BookingsStackScreens = () => (
  <BookingsStack.Navigator>
    <BookingsStack.Screen
      name={'Bookings'}
      bac
      component={Bookings}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'Register'}
      component={Register}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'CreateAccount'}
      component={CreateAccount}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'BookingDetail'}
      component={BookingDetail}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'Dispute'}
      component={Dispute}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'AllBids'}
      component={AllBids}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'SadaddCheckout'}
      component={SadaddCheckout}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'ShowLive'}
      component={ShowLive}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'SuppierProfile'}
      component={SuppierProfile}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
  </BookingsStack.Navigator>
);

const AccountStack = createNativeStackNavigator();
const AccountStackScreens = () => (
  <AccountStack.Navigator initialRouteName="Account">
    <AccountStack.Screen
      name={'Account'}
      component={Account}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></AccountStack.Screen>
    <AccountStack.Screen
      name={'Notifications'}
      component={Notifications}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></AccountStack.Screen>
    <AccountStack.Screen
      name={'Register'}
      component={Register}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></AccountStack.Screen>
    <AccountStack.Screen
      name={'CreateAccount'}
      component={CreateAccount}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></AccountStack.Screen>
  </AccountStack.Navigator>
);

function getTabBarVisibility(route) {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (
    routeName === 'Register' ||
    routeName === 'CreateAccount' ||
    routeName === 'ProductsListing' ||
    routeName === 'Review' ||
    routeName === 'SelectGatePasses' ||
    routeName === 'Dispute' ||
    routeName === 'SadaddCheckout' ||
    routeName === 'SuppierProfile' ||
    routeName === 'BookingDetail'
  ) {
    return 'none';
  }

  return 'flex';
}
const Tab = createBottomTabNavigator();
export default () => {
  return (
    <Tab.Navigator
      initialRouteName="ServicesStack"
      tabBar={props => (
        <BottomTabBar
          {...props}
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // marginTop: -20,
            position: 'absolute',
            // height: 50
          }}
        />
      )}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: hp(8),
          display: getTabBarVisibility(route),
          // height:'auto'
        },
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: Colors.LightGray,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let IconComponent = Feather;
          switch (route.name) {
            case 'ServicesStack':
              IconComponent = MaterialIcons;
              iconName = Images.home;
              break;

            case 'BookingsStack':
              IconComponent = MaterialCommunityIcons;
              iconName = Images.booking;
              break;
            case 'AccountStack':
              // IconComponent = FontAwesome;
              iconName = Images.account;
              break;
          }
          return (
            <View
              style={{
                width: wp(28),
                alignItems:
                  iconName == Images.home
                    ? 'center'
                    : iconName == Images.account
                    ? 'flex-start'
                    : 'flex-end',
              }}>
              <Image
                source={iconName}
                style={{
                  width: iconName == Images.home ? 40 : 22,
                  height:
                    iconName == Images.home
                      ? 40
                      : iconName == Images.booking
                      ? 23
                      : 22,
                  marginTop: focused ? 10 : 5,
                }}
              />
              {focused && (
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 3,
                    backgroundColor: Colors.Black,
                    top: 5,
                    marginRight: iconName == Images.booking ? 8 : null,
                    marginLeft: iconName == Images.account ? 8 : null,
                  }}
                />
              )}
            </View>
          );
        },
      })}>
      <Tab.Screen
        name={'BookingsStack'}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: '',
          tabBarLabelStyle: {fontSize: 12},
        })}
        component={BookingsStackScreens}
      />
      <Tab.Screen
        name={'ServicesStack'}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: '',
          tabBarLabelStyle: {fontSize: 12},
        })}
        component={ServicesStackScreens}
      />
      <Tab.Screen
        name={'AccountStack'}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: '',
          tabBarLabelStyle: {fontSize: 12},
        })}
        component={AccountStackScreens}
      />
    </Tab.Navigator>
  );
};
