import { createFactory } from "react";
import { Settings } from "./settings";
import { makeModal } from "./modal";

const ModalSettings = makeModal(Settings);
const renderModalSettings = createFactory(ModalSettings);

export { ModalSettings as default };
export { ModalSettings, renderModalSettings };
