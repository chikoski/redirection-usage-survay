import { DOM as dom, Component } from "react";

class Settings extends Component {
  render() {
    return dom.div({ className: "settings" },
      dom.div({},
        dom.h3({}, "記録するスプレッドシート"),
        dom.input({
          type: "text",
          placeholder: "Google スプレッドシートのURL",
          value: this.props.spreadsheet,
          onChange: e => this.setState({ spreadsheet: e.target.value })
        })),
      dom.button({
        onClick: e => this.props.app.setConfig({
          spreadsheet: this.state.spreadsheet,
        })
      }, "保存")
    )
  }
}

export { Settings as default };
export { Settings };