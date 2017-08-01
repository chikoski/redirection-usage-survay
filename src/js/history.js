class History {
  constructor(id, longUrl) {
    this.id = id;
    this.longUrl = longUrl;
  }
}
History.all = () => all().then(histories => {
  const set = new Set();
  for (const item of histories) {
    set.add(new History(item.id, item.longUrl));
  }
  return set;
});

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