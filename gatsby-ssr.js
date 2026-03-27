const React = require("react");

exports.onRenderBody = function({ setBodyAttributes, setHtmlAttributes, setHeadComponents }) {
  setHtmlAttributes({ lang: "en" });
  setBodyAttributes({ className: "container" });
  setHeadComponents([
    React.createElement("link", {
      key: "bootstrap-css",
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css",
      crossOrigin: "anonymous",
    }),
  ]);
};