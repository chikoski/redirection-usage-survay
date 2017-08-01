import { Scene } from "./scenes/base";
import { Start } from "./scenes/start";
import History from "./history";

class Signin extends Scene {
}

class DashBoard extends Scene {
  constructor(conf) {
    super(conf);
    this.eventQueue.subscribe("signin", data => {
      History.all().then(histories => {
        console.log(histories);
      });
    })
  }
}

export { Scene as default };
export { Scene, Start, Signin, DashBoard };