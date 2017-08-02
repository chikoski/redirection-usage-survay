import { Scene } from "./scenes/base";
import { Start } from "./scenes/start";
import History from "./history";
import { DashBoard as View } from "./components/scene";

class Signin extends Scene {
}

class DashBoard extends Scene {
  constructor(conf) {
    super(conf);
    this.view = new View({ el: conf.el, eventQueue: conf.eventQueue });
    this.view.hide();
    this.histories = null;

    this.eventQueue.subscribe("signin", data => {
      History.all().then(histories => {
        return Promise.all(histories.map(item => item.loadAnalytics()));
      }).then(histories => {
        this.histories = histories;
        this.eventQueue.publish("data-ready", histories);
        this.view.update(this.histories);
        this.eventQueue.publish("dashboard-ready", this);
      }).catch(error => this.eventQueue.publish("data-load-error"));
    })
  }
}

export { Scene as default };
export { Scene, Start, Signin, DashBoard };