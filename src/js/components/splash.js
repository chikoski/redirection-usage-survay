import { Component, DOM as dom } from "react";
import { renderIcon } from "./icon";

class Splash extends Component {
  render() {
    return dom.div({ className: "signin" },
      dom.button({
        className: "button",
        onClick: e => this.props.app.signIn()
      },
        renderIcon({ name: "account_box" }),
        "サインイン")
    );
  }
}

export { Splash as default };
export { Splash };