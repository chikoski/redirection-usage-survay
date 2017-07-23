const shortener = require("./urlshortener");

function main() {
  let instance;
  shortener.createInstance()
    .then(obj => {
      instance = obj;
      return instance.list()
    }).then(list => {
      console.log(list);
      console.log(list.length);
    })
}

main();