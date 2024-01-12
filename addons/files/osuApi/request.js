const axios = require("axios");

const clientId = process.env.OSUAPI_CLIENT_ID;
const clientSecret = process.env.OSUAPI_CLIENT_SECRET;

let oAuthToken = "";
let expiresAt = 0;

const auth = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "https://osu.ppy.sh/oauth/token",
      data: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope: "public"
      }
    }).then((res) => {
      oAuthToken = res.data.access_token;
      expiresAt = Date.now() + (res.data.expires_in - 1800) * 1000;
      resolve();
    }).catch(reject);
  });
};

module.exports = (interaction, requestData) => {
  return new Promise((resolve, reject) => {
    if (!requestData || !requestData.url || !requestData.method) {
      return reject("Bad RequestData");
    }
    if (!oAuthToken || Date.now() > expiresAt) {
      auth().then(() => {
        return module.exports(interaction, requestData).then(resolve).catch(reject);
      }).catch(reject);
    } else {
      axios({
        method: requestData.method,
        url: requestData.url,
        data: requestData.data || {},
        headers: Object.assign(requestData.headers || {}, {
          Authorization: `Bearer ${oAuthToken}`
        })
      }).then((res) => {
        resolve(res.data);
      }).catch(reject);
    }
  });
};
