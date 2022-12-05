import {Dimensions, useWindowDimensions} from 'react-native';
// import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

// const LeftRightTransition = {
//     gestureDirection: 'horizontal',
//     transitionSpec: {
//         open: TransitionSpecs.TransitionIOSSpec,
//         close: TransitionSpecs.TransitionIOSSpec,
//     },
//     headerStyleInterpolator: HeaderStyleInterpolators.forFade,
//     cardStyleInterpolator: ({ current, next, layouts }) => {
//         return {
//             cardStyle: {
//                 transform: [
//                     {
//                         translateX: current.progress.interpolate({
//                             inputRange: [0, 1],
//                             outputRange: [layouts.screen.width, 0],
//                         }),
//                     },
//                     {
//                         scale: next
//                             ? next.progress.interpolate({
//                                 inputRange: [0, 1],
//                                 outputRange: [1, 1],
//                             })
//                             : 1,
//                     },
//                 ],
//             },
//             overlayStyle: {
//                 opacity: current.progress.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0, 0.5],
//                 }),
//             },
//         };
//     },
// }

const validateEmail = email => {
  const expression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return expression.test(String(email).toLowerCase());
};
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 3958.8; // miles
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.round(d * 100) / 100;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}
export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  // LeftRightTransition,
  validateEmail,
  calcCrow,
};
export const latoSemiBold='Lato-SemiBold'
export const latoBold ='Lato-Bold'
export const latoMedium= 'Lato-Medium'
export const latoRegular='Lato-Regular'