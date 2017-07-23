const fs = require("fs");
const path = require("path");
const shortener = require("./urlshortener");

const urlList = "etc/urllist.tsv";

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.toString());
    });
  });
}

function parse(data) {
  return Promise.resolve(data.split("\n")
    .map(line => line.split("\t").filter(item => item.length > 0))
    .filter(item => item.length > 0)
  );
}

function load() {
  return read(urlList).then(parse);
}

function update(auth, list) {
  const urlshortener = shortener.urlshortener({ version: "v1", auth: auth });
  console.log(urlshortener);
  return Promise.all(list.map(entry => {
    return new Promise((resolve, reject) => {
      const longUrl = entry[0];
      const alias = entry[1];
      setTimeout(() => {
        console.log(longUrl);
        urlshortener.url.insert({
          resource: {
            longUrl: longUrl
          }
        }, (err, result) => {
          if (err) {
            return reject(err);
          }
          console.log(result);
          return resolve([result, longUrl, alias]);
        });
      }, Math.floor(Math.random() * 500) + 500)
    });
  }));
}

function main() {
  Promise.all([shortener.signin(), load()]).then(params => {
    const auth = params[0];
    const list = params[1];
    return update(auth, list);
  }).then(results => {
    const csv = results.map(i => [`"${i[0].id}"`, `"${i[1]}"`, `"${i[2]}"`]).join("\n");
    fs.writeFileSync("out.csv", csv);
  }).catch(error => console.error(error));
}

main();