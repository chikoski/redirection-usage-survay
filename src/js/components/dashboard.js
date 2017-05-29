import { Component, DOM as dom, createFactory } from "react";
import { History } from "./history";

const renderHistories = createFactory(History);

class DashBoard extends Component {
  renderControl() {
    return dom.div({ className: "controls" },
      dom.button({
        className: "primary",
        onClick: e => this.props.scene.export()
      }, "スプレッドシートへ出力")
    )
  }
  renderHeader() {
    return dom.header({},
      dom.h1({}, "転送先一覧"),
      this.renderControl()
    )
  }
  render() {
    return dom.article({ className: "dashboard" },
      this.renderHeader(),
      renderHistories({ histories: this.props.histories })
    )
  }
}

export { DashBoard as default };
export { DashBoard };