import { Component, DOM as dom } from "react";

class Splash extends Component {
  render() {
    return dom.div({ className: "signin" },
      dom.button({
        className: "button",
        onClick: e => this.props.app.signIn()
      }, "サインイン")
    );
  }
}

export { Splash as default };
export { Splash };