const fetch = require('node-fetch');
const API_URL = 'https://order.dominos.com/power';
const orderTypes = {
  Delivery: 'Delivery',
  Carryout: 'Carryout',
};


async function getStoresNearAddress(orderType, cityStateZip = '', streetAddress = '') {
  const response = await fetch(`${API_URL}/store-locator?type=${orderType}&c=${cityStateZip}&s=${streetAddress}`);
  return response.json();
}

async function getNearestDeliveryStore(cityStateZip = '', streetAddress = '') {
  const storesResult = await getStoresNearAddress(orderTypes.Delivery, cityStateZip, streetAddress);
  return storesResult.Stores.find(store => store.IsDeliveryStore);
}

async function getStoreInfo(storeId) {
  const response = await fetch(`${API_URL}/store/${storeId}/profile`)
  return response.json();
}

async function getStoreMenu(storeId) {
  const response = await fetch(`${API_URL}/store/${storeId}/menu?lang=en&structured=true`)
  return response.json();
}

async function getStoreCoupon(storeId, couponId) {
  const response = await fetch(`${API_URL}/store/${storeId}/coupon/${couponId}?lang=en`)
  return response.json();
}

// getStoresNearAddress(orderTypes.Delivery, 'Murfreesboro, TN 37130', '1903 Cypress Drive')
//   .then(json => {
//     console.log(json.Stores[0]);
//   });

// (async () => {
//   const storeInfo = await getStoreInfo('5493');
//   console.log(storeInfo);
// })();

// (async () => {
//   const store = await getNearestDeliveryStore('Atlanta, GA 30324', '600 Garson Drive NE');
//   console.log(store);
// })();

(async () => {
  // const menu = await getStoreMenu('5493');
  // console.log(menu);
  const coupon = await getStoreCoupon('5493', '9193');
  console.log(coupon);
})();

//using IIFE (Imediately Invoked Function Expression) above instead of .then below
// getStoreInfo('5493')
//   .then(storeInfo => console.log(storeInfo)
//   );