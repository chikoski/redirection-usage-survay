const Chromy = require("chromy");

const list = ["https://goo.gl/info/hvLXFX", "https://goo.gl/info/D2qJWJ", "https://goo.gl/info/1cwn4B", "https://goo.gl/info/D7RVtY", "https://goo.gl/info/VG3a6z", "https://goo.gl/info/RvjM7e", "https://goo.gl/info/DWH49U", "https://goo.gl/info/zuekBL", "https://goo.gl/info/4MUYy6", "https://goo.gl/info/VcXeQQ", "https://goo.gl/info/zvdJe1", "https://goo.gl/info/YHgXYk", "https://goo.gl/info/aaEwfT", "https://goo.gl/info/LjBeAy", "https://goo.gl/info/thpsTe", "https://goo.gl/info/PCA1UG", "https://goo.gl/info/m2i3Wy", "https://goo.gl/info/8rREyX", "https://goo.gl/info/J6q7hL", "https://goo.gl/info/EY3MgP", "https://goo.gl/info/qYaAEV", "https://goo.gl/info/buj7GX", "https://goo.gl/info/VphPgB", "https://goo.gl/info/eNCNu7", "https://goo.gl/info/UQ1beJ", "https://goo.gl/info/r5FcmG", "https://goo.gl/info/HvZGYk", "https://goo.gl/info/Gk6Avu", "https://goo.gl/info/Zj63Mj", "https://goo.gl/info/8xizLd", "https://goo.gl/info/c987BV", "https://goo.gl/info/er8ZGh", "https://goo.gl/info/CHv5qf", "https://goo.gl/info/uXseZM", "https://goo.gl/info/CeD2FP", "https://goo.gl/info/psJKLJ", "https://goo.gl/info/THGpNj", "https://goo.gl/info/S6Knqh", "https://goo.gl/info/8h4nmT", "https://goo.gl/info/JntRZ7", "https://goo.gl/info/B3JeEG", "https://goo.gl/info/XJCqpd", "https://goo.gl/info/U4Lr2z", "https://goo.gl/info/2b9z3c", "https://goo.gl/info/GSjFqB", "https://goo.gl/info/Bhbuvf", "https://goo.gl/info/dS9fLN", "https://goo.gl/info/5Z824z", "https://goo.gl/info/j4azp1", "https://goo.gl/info/rNwGXG", "https://goo.gl/info/VunJzp", "https://goo.gl/info/e4QoTM", "https://goo.gl/info/AoJTX4", "https://goo.gl/info/YkrQoY", "https://goo.gl/info/5bxUed", "https://goo.gl/info/7UQgLM", "https://goo.gl/info/9gVRBw", "https://goo.gl/info/fBpcNE", "https://goo.gl/info/Lc36Np", "https://goo.gl/info/wBLgtP", "https://goo.gl/info/7FWDTB", "https://goo.gl/info/sbNZLP", "https://goo.gl/info/3Qp5Tb", "https://goo.gl/info/yvDsBQ", "https://goo.gl/info/c2PK9t", "https://goo.gl/info/wDBXMZ", "https://goo.gl/info/NjPhbC", "https://goo.gl/info/QnZZW3", "https://goo.gl/info/6rMeg7", "https://goo.gl/info/ZbBdzZ", "https://goo.gl/info/oq3zPJ", "https://goo.gl/info/1CLj1d", "https://goo.gl/info/ioTqWg", "https://goo.gl/info/P3iuvH", "https://goo.gl/info/LL82NJ", "https://goo.gl/info/mntX5U", "https://goo.gl/info/7cSdr3", "https://goo.gl/info/qqvYZz", "https://goo.gl/info/5oD4Jo", "https://goo.gl/info/C1ajNC", "https://goo.gl/info/hKBvcT", "https://goo.gl/info/aNXMxw", "https://goo.gl/info/fKDm9p", "https://goo.gl/info/vwH8wP", "https://goo.gl/info/6D6G18", "https://goo.gl/info/scZYUU", "https://goo.gl/info/mjZ1Sw", "https://goo.gl/info/NHdY2Y", "https://goo.gl/info/eeVoJc", "https://goo.gl/info/xpZgng", "https://goo.gl/info/7DbXWy", "https://goo.gl/info/i5rWaA", "https://goo.gl/info/w42T8k"];

const print = msg => process.stdout.write(msg + "\n");
const log = msg => process.stderr.write(msg + "\n");

const scrape = (chrome, url) => new Promise((resolve, reject) => {
  log(`vist to ${url}`);
  let row = null;
  const header = []
  chrome.chain()
    .goto(url)
    .wait("table")
    .inject("js", __dirname + "/inject.js")
    .evaluate(() => {
      const factory = new ShortUrlFactory(document);
      return factory.create();
    })
    .result(page => {
      row = [page.id, page.longUrl];
      for (const [key, value] of page.history) {
        row.push(value);
        header.push(key);
      }
    })
    .end()
    .then(() => resolve({ header: header, row: row }))
    .catch(error => reject(error));
});

const defineScraper = url => chrome => scrape(chrome, url);

const run = (chrome, scrapers, table) => {
  if (scrapers.length <= 0) {
    return Promise.resolve(table);
  }
  const scraper = scrapers.shift();
  return scraper(chrome).then(({ header, row }) => {
    if (table.header == null) {
      table.header = header;
    }
    table.rows.push(row);
    return run(chrome, scrapers, table);
  }).catch(error => log(error));
}

const formatDate = dateString => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
};

const escape = str => `"${str}"`

const main = function () {
  const epoc = new Date("2017-07-01T06:00:00.000Z");
  const chrome = new Chromy();
  const scrapers = list.map(url => defineScraper(url));
  run(chrome, scrapers, { header: null, rows: [] }).then(table => {
    print(table.header.map(i => escape(formatDate(i))).join(","));
    print(table.rows.map(row => row.map(escape).join(",")).join("\n"));
    chrome.close();
  }).catch(err => {
    log(err);
    chrome.close();
  });
};

main();