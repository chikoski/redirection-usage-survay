const google = require("googleapis");
const readline = require("readline");
const fetch = require("node-fetch");

const auth = new google.auth.OAuth2(
  "915590772057-9ikbn384o45ecsk21nhgm88q51dv56da.apps.googleusercontent.com",
  "d2YK0qxwCQmf8tUN0EwFHbFV",
  "urn:ietf:wg:oauth:2.0:oob"
);

const scopes = [
  "https://www.googleapis.com/auth/urlshortener",
];

function codeDialog() {
  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    io.question(`Access ${url}\n\nEnter your code\n code = `, code => {
      io.close();
      return resolve(code);
    });
  });
}

function getToken(code) {
  return new Promise((resolve, reject) => {
    auth.getToken(code, (err, token) => {
      if (err) {
        return reject(err);
      }
      auth.credentials = token;
      return resolve(auth);
    });
  });
}

function signin() {
  return codeDialog().then(getToken).catch(error => {
    console.error(error);
    return Promise.reject(error);
  });
}

function listItems(urlshortener, list, nextPageToken, totalItems) {
  totalItems = totalItems ? totalItems : Number.MAX_VALUE;
  list = list ? list : [];
  if (list.length < totalItems) {
    return doListItems(urlshortener, nextPageToken).then(result => {
      nextPageToken = result.nextPageToken;
      totalItems = result.totalItems;
      list = list.concat(result.items);
      return listItems(urlshortener, list, nextPageToken, totalItems);
    });
  }
  return Promise.resolve(list);
}

function doListItems(urlshortener, nextPageToken) {
  return new Promise((resolve, reject) => {
    urlshortener.url.list({ "start-token": nextPageToken }, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  });
}

class shortner {
  constructor(urlshortener) {
    this.urlshortener = urlshortener;
    this.items = null;
  }
  list() {
    if (this.items) {
      return Promise.resolve(this.items);
    }
    return listItems(this.urlshortener).then(items => {
      this.items = items;
      return this.items;
    });
  }
  hide(shortUrl) {
    fetch("https://goo.gl/api/hide", {
      metod: "POST",
      body: `security_token=${this.urlshortener._options.auth.OAuth2Client.secret}`
    });
    return Promise.resolve(console.log(this.urlshortener));
  }
}

function createInstance() {
  return signin().then(auth => new shortner(google.urlshortener({ version: "v1", auth: auth })));
}

module.exports = {
  signin: signin,
  urlshortener: google.urlshortener,
  createInstance: createInstance
};