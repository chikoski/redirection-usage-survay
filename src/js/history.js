class History {
  constructor(id, longUrl) {
    this.shortUrl = new URL(id);
    this.longUrl = longUrl;
    this.id = this.shortUrl.pathname.substr(1);
    this.month = null;
  }
  loadAnalytics() {
    if (this.month != null) {
      return Promise.resolve(this);
    }
    return new Promise((resolve, reject) => {
      gapi.client.urlshortener.url.get({
        shortUrl: this.shortUrl,
        projection: "ANALYTICS_CLICKS"
      }).then(res => {
        this.month = res.result.analytics.month;
        resolve(this);
      }, reject)
    });
  }
  get clicks() {
    if (this.month == null) {
      return -1;
    }
    return this.month.shortUrlClicks;
  }
}
History.all = () => {
  return all().then(histories => histories.map(item => new History(item.id, item.longUrl)));
};

const list = (token = null) => {
  const result = gapi.client.urlshortener.url.list({
    "start-token": token
  });
  return new Promise((resolve, reject) => {
    result.then(resolve, reject)
  });
}

const all = (histories = [], token = null) => {
  return list(token).then(data => {
    histories = histories.concat(data.result.items);
    if (histories.length < data.result.totalItems) {
      return all(histories, data.result.nextPageToken);
    }
    return Promise.resolve(histories)
  });
}

export { History as default };
export { History };