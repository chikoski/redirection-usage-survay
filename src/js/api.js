import SpreadSeet from "./models/spreadsheet";

const endPoints = {
  signIn: "https://apis.google.com/js/platform.js",
  api: "https://apis.google.com/js/api.js"
};
const discoveryDocs = [
  "https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest",
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/urlshortener",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file"
];

function load(url) {
  return new Promise((resolve, reject) => {
    const elm = document.createElement("script");
    elm.src = url;
    elm.addEventListener("load", e => {
      resolve(url);
    })
    window.document.body.appendChild(elm);
  });
}

class API {
  constructor(gapi, key, clientId) {
    this.api = gapi;
    this.key = key;
    this.clientId = clientId;
    this.auth = null;
  }
  get isSignedIn() {
    return this.auth && this.auth.isSignedIn.get();
  }
  get user() {
    return this.auth ? this.auth.currentUser.get() : null;
  }
  get client() {
    return this.api.client;
  }
  get spreadsheet() {
    return this.client.sheets.spreadsheets;
  }
  signIn() {
    this.auth = this.api.auth2.getAuthInstance();
    if (this.isSignedIn) {
      return Promise.resolve(this);
    }
    const ret = new Promise((resolve, reject) => {
      this.auth.isSignedIn.listen(state => {
        return resolve(this);
      });
    });
    this.auth.signIn();
    return ret;
  }
  signOut() {
    const auth = this.auth;
    return auth ? this.auth.signOut() : Promise.resolve();
  }
  list(startToken = null) {
    return Promise.resolve(this.api.client.urlshortener.url.list({
      startToken: startToken
    }));
  }
  loadAnalytics(item) {
    return new Promise((resolve, reject) => {
      this.api.client.urlshortener.url.get({
        shortUrl: item.shortUrl,
        projection: "FULL"
      }).then(res => {
        const stats = res.result.analytics.month;
        item.stats = stats;
        resolve(item)
      }, err => reject(err));
    });
  }
  create() {
    return this.spreadsheet
      .create()
      .then(response => {
        return SpreadSeet.create(response, this)
      });
  }
  open(spreadsheetId) {
    if (spreadsheetId) {
      return this.spreadsheet.get({ spreadsheetId: spreadsheetId })
        .then(res => SpreadSeet.create(res, this), res => this.create())
    } else {
      return this.create();
    }
  }
  static load({ key, clientId }) {
    return load(endPoints.api).then(() => {
      return new Promise((resolve, reject) => {
        gapi.load("client", () => resolve(gapi))
      });
    }).then(api => api.client.init({
      apiKey: key,
      clientId: clientId,
      scope: scope.join(" "),
      discoveryDocs: discoveryDocs
    })).then(() => new API(gapi, key, clientId));
  };
}

export { API as default };
export { API };