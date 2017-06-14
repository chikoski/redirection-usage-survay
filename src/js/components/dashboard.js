import { Component, DOM as dom, createFactory } from "react";
import { History } from "./history";
import { renderModalSettings } from "./modal-settings";
import { renderDialog } from "./dialog";

const renderHistories = createFactory(History);

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      meesage: ""
    };
  }
  get toRenderDialog() {
    return this.state.meesage.length > 0;
  }
  renderControl() {
    return dom.div({ className: "controls" },
      dom.button({
        onClick: e => this.props.scene.signout(),
      }, "サインアウト"),
      dom.button({
        onClick: e => this.setState({ showSettings: true })
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
      renderDialog({ hidden: !this.toRenderDialog, meesage: this.meesage }),
      this.renderHeader(),
      dom.div({ className: "container" },
        dom.button({
          className: "primary",
          disabled: !this.props.exportable,
          onClick: e => this.props.scene.export()
        }, "スプレッドシートへ出力"),
        renderHistories({ histories: this.props.histories }),
        renderModalSettings({
          hidden: !this.state.showSettings,
          scene: this.props.scene,
          spreadsheetUrl: this.props.app.spreadsheetUrl,
        })
      ),
    )
  }
}

export { DashBoard as default };
export { DashBoard };