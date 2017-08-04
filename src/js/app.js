import EventQueue from "./event-queue";
import { Scene as SceneView, Dialog } from "./component";
import { Start, DashBoard, Signin, DataLoading } from "./scenes";
import { SCOPES } from "./constants";

const toA = list => Array.prototype.concat.apply([], list);

const promise = f => new Promise((resolve, reject) => f());

const createComponentMap = (base, queue) =>
  (selector, klass) => toA(base.querySelectorAll(selector)).reduce((map, el) => {
    const component = new klass({ el: el, eventQueue: queue });
    map.set(component.id, component);
    return map;
  }, new Map());

const associate = (table, eventQueue) => Object.keys(table).reduce((map, selector) => {
  const klass = table[selector];
  const conf = { el: document.querySelector(`#${selector}`), eventQueue: eventQueue };
  const obj = new klass(conf);
  map.set(selector, obj);
  return map;
}, new Map());

class App {
  constructor({ el, settings = {} }) {
    this.el = el;
    this.settings = settings;
    this.googleUser = null;

    this.queue = new EventQueue([
      "scene-transition",
      "show-dialog",
      "start",
      "signin",
      "signout",
      "ready",
      "data-ready",
      "dashboard-ready",
      "load-error",
      "data-load-error",
      "export-csv",
      "export-spreadsheet"
    ]);

    const createMap = createComponentMap(this.el, this.queue);
    this.dialogs = createMap(".dialog", Dialog);
    this.scenes = associate({
      "start": Start,
      "signin": Signin,
      "dashboard": DashBoard,
      "loading-data": DataLoading,
    }, this.queue);

    this.queue.subscribe("show-dialog", error => {
      let dialog = null;
      switch (error.type) {
        case "api-error":
          dialog = this.dialogs.get("api-load-error");
          break;
        case "load-error":
          dialog = this.dialogs.get("data-load-error");
        default:
      }
      if (dialog) {
        dialog.show();
      }
    });

    this.queue.subscribe("ready", data => {
      console.log("ready");
      return this.transite("signin")
        .then(app => console.log("signin"))
        .catch(error => console.error(error));
    });

    this.queue.subscribe("signin", data => {

    });

    this.queue.subscribe("data-ready", histories => {
      this.histories = histories;
    });

    this.queue.subscribe("dashboard-ready", dashboard => {
      this.transite("dashboard");
    });

    this.queue.subscribe("export-csv", histories => {
      const csv = histories
        .map(history => `"${history.longUrl}","${history.clicks}"`);
      csv.unshift("URL,count");
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csv.join("\r\n")], { type: "text/csv;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "利用履歴.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });

    window.onSignIn = googleUser => this.signin(googleUser);
  }
  start() {
    this.transite("start").then(result => console.log("Transite to start scene"));
    this.queue.publish("start", {});
  }
  signin(googleUser) {
    this.googleUser = googleUser;
    const options = new gapi.auth2.SigninOptionsBuilder({
      scope: SCOPES.join(" ")
    });
    return this.googleUser.grant(options)
      .then(success => {
        this.queue.publish("signin");
      }, fail => {
        this.queue.publish("api-load-error", fail);
      }); // XXX
  }
  transite(newScene) {
    console.log(`transite to ${newScene}`);
    return promise(() => {
      if (this.scenes.has(newScene)) {
        console.log(`A scene object associated with ${newScene} is found`);
        this.scene = this.scenes.get(newScene);
        this.queue.publish("scene-transition", this.scene);
        return Promise.resolve(this);
      }
      return Promise.reject(`No corresponding scene is available for ${newScene}`);
    });
  }
}

export { App as default };
export { App };