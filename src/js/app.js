import { createFactory } from "react";
import ReactDOM from "react-dom";
import DashBoard from "./scenes/dashboard";
import SignIn from "./scenes/SignIn";
import Splash from "./components/splash";
import { DashBoard as DashBoardComponent } from "./components/dashboard";
import localforage from "localforage";

const renderSplash = createFactory(Splash);
const renderDashboard = createFactory(DashBoardComponent);

class App {
  constructor({ api, container, preference }) {
    this.api = api;
    this.container = container;
    this.scenes = {
      "dashboard": new DashBoard({ api: api, app: this, renderer: renderDashboard }),
      "signin": new SignIn({ api: api, app: this, renderer: renderSplash }),
    };
    this.preference = preference;
  }
  get isSignedIn() {
    return this.api.isSignedIn;
  }
  set scene(name) {
    const nextScene = this.scenes[name];
    if (!nextScene) {
      return;
    }
    this.currentScene = nextScene;
    this.currentScene.start();
  }
  get spreadsheetUrl() {
    return this.preference.spreadsheetUrl;
  }
  set spreadsheetUrl(newUrl) {
    console.log(newUrl);
    this.preference.spreadsheetUrl = newUrl;
    localforage.setItem("spreadsheetUrl", newUrl);
  }
  get spreadsheetId() {
    return this.spreadsheetUrl; // XXX
  }
  start() {
    if (this.signIn) {
      this.signIn();
    } else {
      this.scene = "signin";
      this.update();
    }
  }
  signIn() {
    this.api.signIn().then(api => this.list());
  }
  signout() {
    this.api.signOut().then(res => {
      this.scene = "signin";
      this.update();
    })
  }
  list() {
    this.scene = "dashboard";
  }
  update() {
    ReactDOM.render(this.currentScene.render(), this.container);
  }
}

export { App as default };
export { App };

