class ShortUrl {
  constructor({ id, longUrl, status }) {
    this.id = id;
    this.longUrl = longUrl;
    this.status = status;
    this.stats = null;
  }
  get shortUrl() {
    return this.id;
  }
  get hasStats() {
    return this.stats;
  }
  get visits() {
    return this.hasStats ? this.stats.shortUrlClicks : NaN;
  }
}

export { ShortUrl as default };
export { ShortUrl };