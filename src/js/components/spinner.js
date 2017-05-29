import { React, Dom as dom, Component } from "react";

class Spinner extends Component {
  render() {
    return dom.div({ className: "spinner" },
      dom.div({ className: "rect1" }),
      dom.div({ className: "rect2" }),
      dom.div({ className: "rect3" }),
      dom.div({ className: "rect4" }),
      dom.div({ className: "rect5" })
    )
  }
}

export { Spinner as default };
export { Spinner };