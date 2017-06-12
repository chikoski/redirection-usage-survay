import { DOM as dom, Component, createFactory } from "react";

class Settings extends Component {
  render() {
    let value = this.props.spreadsheet;

    return dom.div({ className: "settings" },
      dom.div({},
        dom.h2({}, "記録するスプレッドシート"),
        dom.input({
          type: "text",
          placeholder: "Google スプレッドシートのURL",
          value: this.props.spreadsheet,
          onChange: e => value = e.target.value,
        })),
      dom.button({
        onClick: e => this.props.app.setConfig({
          spreadsheet: value
        })
      }, "保存")
    )
  }
}

const renderSttings = createFactory(Settings);

export { Settings as default };
export { Settings, renderSttings };