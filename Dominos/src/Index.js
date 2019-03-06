const fetch = require('node-fetch');

async function getStoresNearAddress(zipCode, streetAddress) {
  const response = await fetch(`https://order.dominos.com/power/store-locator?type=Carryout&c=${zipCode}&s=${streetAddress}`, {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
    },
    "referrer": "https://order.dominos.com/en/assets/build/xdomain/proxy.html",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
  });
  const json = await response.json();
  console.log(json);
}

getStoresNearAddress('37130', '');