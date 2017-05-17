import Config from "./config";

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const elm = document.createElement("script");
    elm.src = url;
    elm.addEventListener("load", e => {
      resolve(url);
    })
    window.document.body.appendChild(elm);
  });
}

function initAPI() {
  return gapi.client.init(Config).then()
}

function initUI() {

}

function start() {
  return initAPI().then(initUI);
}

window.addEventListener("DOMContentLoaded", e => {
  return loadScript(Config.api).then(start)
});