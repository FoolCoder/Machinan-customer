import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {applyMiddleware} from 'redux';
import {setServices, setSplash} from '../redux/reducer';
import store from '../redux/store';
const getRedux = () => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  // console.log('dashboardReducer', dashboardReducer);
  return dashboardReducer;
};
const getServices = async navigation => {
  const URL = apiBaseUrl + `services`;
  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    body: null,
  });
  const result_1 = await res.json();
  store.dispatch(setServices(result_1.data)),
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'MainNavigator'}],
        }),
      );
    }, 500);
};

const getCategories = serviceId => {
  const URL = apiBaseUrl + `categories?service_id=${serviceId}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    body: null,
  }).then(res => res.json());
};
const getPrices = (productId, locationA, locationB) => {
  let URL;
  if (locationA && locationB) {
    URL =
      apiBaseUrl +
      `bookings/get-price?product_id=${productId}&location_a_latitude=${locationA.lat}&location_a_longitude=${locationA.lon}&location_b_latitude=${locationB.lat}&location_b_longitude=${locationB.lon}`;
  } else {
    URL =
      apiBaseUrl +
      `bookings/get-price?product_id=${productId}&location_a_latitude=${locationA.lat}&location_a_longitude=${locationA.lon}`;
  }
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    body: null,
  }).then(res => res.json());
};

const getGatePasses = productId => {
  const URL = apiBaseUrl + `bookings/get-gatepasses?product_id=${productId}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    body: null,
  }).then(res => res.json());
};

const getBookings = token => {
  const URL = apiBaseUrl + `bookings`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getBookingDetail = (token, id) => {
  const URL = apiBaseUrl + `bookings/detail?booking_id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const checkPhone = phone => {
  const URL = apiBaseUrl + `customer/phone-check`;

  const formData = new FormData();

  formData.append('phone', phone);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).then(res => res.json());
};

const createAccount = (name, email, phone, id, platform) => {
  const URL = apiBaseUrl + `customer/register`;

  const formData = new FormData();

  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('device_token', id);
  formData.append('device_info', platform);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).then(res => res.json());
};

const placeJob = (
  token,
  product,
  scheduled,
  locationA,
  locationB,
  passesA,
  passesB,
  addressA,
  addressB,
  startTime,
  endTime,
) => {
  const URL = apiBaseUrl + `bookings/store`;

  const formData = new FormData();

  formData.append('product_id', product.id);
  formData.append('type', scheduled ? 'SCHEDULED' : 'INSTANT');
  formData.append('location_a_latitude', locationA.lat);
  formData.append('location_a_longitude', locationA.lon);
  formData.append('location_a_address', addressA);

  if (locationB) {
    formData.append('location_b_latitude', locationB.lat);
    formData.append('location_b_longitude', locationB.lon);
    formData.append('location_b_address', addressB);
  }

  {
    passesA.map((item, index) => {
      formData.append('gatepass_ids_location_a[]', item.id);
    });
  }
  {
    passesB.map((item, index) =>
      formData.append('gatepass_ids_location_b[]', item.id),
    );
  }

  {
    scheduled && formData.append('scheduled_time_bracket_start', startTime);
  }
  {
    scheduled && formData.append('scheduled_time_bracket_end', endTime);
  }

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const acceptBid = (token, id, online) => {
  // console.log(online);
  const URL = apiBaseUrl + `bookings/bids/accept?bid_id=${id}&online=${online}`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const changeBookingStatus = (token, bookingId, status) => {
  const URL =
    apiBaseUrl +
    `bookings/change-status?booking_id=${bookingId}&status=${status}`;

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getDisputeData = (token, id) => {
  const URL = apiBaseUrl + `bookings/dispute/show?booking_id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const createDispute = (token, bookingId, message) => {
  const URL = apiBaseUrl + `bookings/dispute/store`;

  const formData = new FormData();

  formData.append('booking_id', bookingId);
  formData.append('message', message);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const replyDispute = (token, disputeId, message) => {
  const URL = apiBaseUrl + `bookings/dispute/reply/store`;

  const formData = new FormData();

  formData.append('dispute_id', disputeId);
  formData.append('message', message);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const getNotifications = token => {
  const URL = apiBaseUrl + `notifications`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const readNotifications = token => {
  const URL = apiBaseUrl + `notifications/mark-read`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const InitaitePayment = (token, amount) => {
  const URL = apiBaseUrl + `initiate-wallet-payment?amount=${amount}`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const getCoustmer = token => {
  const URL = apiBaseUrl + 'profile';
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const finalPayment = (token, id, online) => {
  const URL =
    apiBaseUrl +
    `customer/booking/payment/final?booking_id=${id}&online=${online}`;
  // console.log(URL);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getSupplierProfile = (id, lat, lng, token) => {
  const URL = apiBaseUrl + `bids/detail?id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const UpdateProfile = (token, image, pay) => {
  const URL = apiBaseUrl + `customer/profile/update`;
  const formData = new FormData();

  {
    image && formData.append('photo', image);
  }
  {
    pay !== null && formData.append('pay_from_wallet', pay);
  }
  console.log(formData);
  // formData.append('pay_from_wallet', pay);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: image || pay !== null ? formData : null,
  }).then(res => res.json());
};
export default {
  UpdateProfile,
  apiBaseUrl,
  assetsBaseUrl,
  getSupplierProfile,
  finalPayment,
  getServices,
  getCategories,
  getPrices,
  getGatePasses,
  placeJob,
  checkPhone,
  createAccount,
  getBookings,
  getBookingDetail,
  acceptBid,
  changeBookingStatus,
  getDisputeData,
  createDispute,
  replyDispute,
  getNotifications,
  readNotifications,
  getCoustmer,
  InitaitePayment,
};
