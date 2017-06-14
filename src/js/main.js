import Bootloader from "./bootloader";

const selector = "#app";
const configFile = "config.json";
const localSettings = ["spreadsheetUrl"];

Bootloader.boot(configFile, selector, localSettings);