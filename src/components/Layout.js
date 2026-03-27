import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export default function Layout({ children, filterType, isList }) {
  const data = useStaticQuery(graphql`
    query SiteMetaQuery {
      site {
        siteMetadata {
          siteName
          twitterUrl
          siteEmail
        }
      }
    }
  `);

  const { siteName, twitterUrl, siteEmail } = data.site.siteMetadata;
  const year = new Date().getFullYear();

  return (
    <>
      <nav className="my-4 row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          <div className="navbar">
            <a
              href="/"
              className={"position-absolute top-50 start-50 translate-middle text-nowrap fs-4 " + ((isList && !filterType) ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}
            >
              {siteName}
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="ms-auto icon-link twitter-x"
            >
              <span className="visually-hidden-focusable">X</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="mb-4">
        {children}
      </main>

      <footer className="row justify-content-center smaller mb-4">
        <div className="col-12 col-lg-10 col-xl-9">
          {year} – {siteName},{" "}
          <a
            href={`mailto:${siteEmail}`}
            className="link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2"
          >
            contact us
          </a>
          . Data sourced from Reddit, Twitter, Telegram among other places,
          courtesy of respective contributors.
        </div>
      </footer>
    </>
  );
}
