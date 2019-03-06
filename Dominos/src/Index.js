const fetch = require('node-fetch');
const API_URL = 'https://order.dominos.com/power/store-locator?';
const orderTypes = {
  Delivery: 'Delivery',
  Carryout: 'Carryout',
};


async function getStoresNearAddress(orderType, cityStateZip, streetAddress = '') {
  const response = await fetch(`${API_URL}type=${orderType}&c=${cityStateZip}&s=${streetAddress}`, {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
    },
    "referrer": "https://order.dominos.com/en/assets/build/xdomain/proxy.html",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
  });
  const json = await response.json();
  return (json);
}

getStoresNearAddress('Delivery', 'Murfreesboro, TN 37130', '1903 Cypress Drive')
  .then(json => console.log(json));