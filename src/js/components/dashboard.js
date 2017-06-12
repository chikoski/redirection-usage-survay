import { Component, DOM as dom, createFactory } from "react";
import { History } from "./history";
import { Settings } from "./settings";

const renderHistories = createFactory(History);
const renderSettings = createFactory(Settings);

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false
    };
  }
  renderControl() {
    return dom.div({ className: "controls" },
      dom.button({
        className: "primary",
        disabled: !this.props.exportable,
        onClick: e => this.props.scene.export()
      }, "スプレッドシートへ出力"),
      dom.button({
        onClick: e => this.props.scene.signout(),
      }, "サインアウト"),
      dom.button({
        onClick: e => {
          const nextState = !this.state.showSettings;
          this.setState({ showSettings: nextState })
        }
      }, "設定")
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
      dom.div({ className: "container" },
        renderHistories({ histories: this.props.histories }),
        this.state.showSettings ? renderSettings({ scene: this.props.scene }) : null,
      ),
    )
  }
}

export { DashBoard as default };
export { DashBoard };