class ShortUrl {
  constructor({ id, longUrl, history = [] }) {
    this.id = id;
    this.longUrl = longUrl;
    this.history = [];
    for (const item of history) {
      this.history.push([item.month, item.clicks]);
    }
  }
}

toArray = elementsList => Array.prototype.concat.apply([], elementsList);

class ShortUrlFactory {
  constructor(doc) {
    this.document = doc;
    this.product = null;
  }

  shortUrl() {
    return this.document.querySelector(".short-url").textContent;
  }

  longUrl() {
    return this.document.querySelector(".long-url > a").href;
  }

  history() {
    return toArray(this.document.querySelectorAll("table > tbody > tr")).map(i => {
      return {
        month: new Date(i.children[0].textContent),
        clicks: i.children[1].textContent
      };
    });
  }

  create() {
    if (this.product == null) {
      const epoc = new Date("2017-07-02T06:00:00.000Z");
      this.product = new ShortUrl({
        longUrl: this.longUrl(),
        id: this.shortUrl(),
        history: this.history().filter(i => i.month >= epoc)
      });
    }
    return this.product;
  }
}