import { Component, DOM as dom, createFactory } from "react";

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: this.props.hidden
    };
  }
  get hidden() {
    return this.state.hidden;
  }
  get className() {
    let names = ["dialog"];
    if (this.props.type === "warning") {
      names.push("warning");
    } else if (this.props.type === "error") {
      names.push("error");
    }
    if (this.hidden) {
      names.push("hidden");
    }
    return names.join(" ");
  }
  render() {
    return dom.div({ className: this.className },
      dom.span({ className: "message" }, this.props.message),
      dom.button({ onClick: e => this.setState({ hidden: true }) }, "OK")
    );
  }
}

const renderDialog = createFactory(Dialog);

export { Dialog as default };
export { Dialog, renderDialog };