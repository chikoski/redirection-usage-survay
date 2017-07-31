const API = "https://apis.google.com/js/api.js";

const SCOPES = [
  "https://www.googleapis.com/auth/urlshortener",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file"
];

const DISCOVER_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest",
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];

export { API, SCOPES, DISCOVER_DOCS };