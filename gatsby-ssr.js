const React = require("react");
const { siteMetadata } = require("./gatsby-config");

const { siteName, siteUrl, description, ogDescription, keywords } = siteMetadata;

exports.onRenderBody = function({ setBodyAttributes, setHtmlAttributes, setHeadComponents }) {
  setHtmlAttributes({ lang: "en" });
  setBodyAttributes({ className: "container" });
  setHeadComponents([
    React.createElement("meta", { key: "description", name: "description", content: description }),
    React.createElement("meta", { key: "keywords", name: "keywords", content: keywords }),
    React.createElement("meta", { key: "og:title", property: "og:title", content: siteName }),
    React.createElement("meta", { key: "og:type", property: "og:type", content: "website" }),
    React.createElement("meta", { key: "og:url", property: "og:url", content: siteUrl }),
    React.createElement("meta", { key: "og:description", property: "og:description", content: ogDescription }),
    React.createElement("meta", { key: "og:image", property: "og:image", content: `${siteUrl}/cover.png` }),
    React.createElement("meta", { key: "theme-color", name: "theme-color", content: "#102026" }),
    React.createElement("link", { key: "favicon", rel: "icon shortcut", sizes: "32x32", href: "/icon.png" }),
    React.createElement("link", { key: "apple-touch-icon", rel: "apple-touch-icon", href: "/icon_192.png" }),
    React.createElement("link", { key: "bootstrap-css", rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css", crossOrigin: "anonymous" }),
  ]);
};