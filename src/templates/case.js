import React, { useEffect, useRef } from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function HtmlContent({ html }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("script").forEach((originalScript) => {
      const script = document.createElement("script");
      Array.from(originalScript.attributes).forEach((attr) =>
        script.setAttribute(attr.name, attr.value)
      );
      script.textContent = originalScript.textContent;
      originalScript.replaceWith(script);
    });
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Head({ data, pageContext }) {
  const { number } = pageContext;
  const { caption } = data.markdownRemark.frontmatter;
  return <title>#{number} – {caption}</title>;
}

export default function CaseTemplate({ data, pageContext }) {
  const { number, prevNumber, nextNumber } = pageContext;
  const { frontmatter, html } = data.markdownRemark;
  const {
    caption,
    date,
    location,
    unit,
    source,
    timecode,
    inconclusive,
    comment,
  } = frontmatter;

  return (
    <Layout isList={false}>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="vstack align-items-start gap-2 mb-4">
            <div className="hstack justify-content-center gap-3 mb-2">
              {prevNumber ? (
                <a href={`/${prevNumber}`} className="icon-link arrow-left link-secondary">
                  <span className="visually-hidden-focusable">Previous</span>
                </a>
              ) : (
                <span className="icon-link arrow-left disabled" aria-disabled="true">
                  <span className="visually-hidden-focusable">Previous</span>
                </span>
              )}

              <span className="badge bg-warning text-dark fs-5 fw-semibold">
                #{number}
              </span>

              {nextNumber ? (
                <a href={`/${nextNumber}`} className="icon-link arrow-right link-secondary">
                  <span className="visually-hidden-focusable">Next</span>
                </a>
              ) : (
                <span className="icon-link arrow-right disabled" aria-disabled="true">
                  <span className="visually-hidden-focusable">Next</span>
                </span>
              )}
            </div>

            <h1 className="text-white fs-5">{caption}</h1>

            <div className="small">
              {inconclusive && (
                <p className="mb-3">
                  <span className="d-inline-block align-text-bottom badge rounded-pill text-bg-secondary fw-medium">Inconclusive</span> {comment}
                </p>
              )}

              <div className="hstack gap-3 align-items-start">
                <p>
                  Date: <span className="fw-semibold text-lighter text-nowrap">{formatDate(date)}</span>
                </p>
                {location && (
                  <p>
                    Location: <span className="fw-semibold text-lighter">{location}</span>
                  </p>
                )}
              </div>

              {unit && (
                <p>
                  Filmed by: <span className="fw-semibold text-lighter">{unit}</span>
                </p>
              )}

              <div className="hstack gap-3">
                {source && (
                  <a
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                    className="link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2"
                  >
                    Source
                  </a>
                )}
                {timecode && (
                  <p className="mb-0">
                    Timecode: <span className="fw-semibold text-lighter">{timecode}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <HtmlContent html={html} />
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query CaseById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date
        location
        unit
        source
        caption
        timecode
        method
        nsfl
        inconclusive
        comment
      }
    }
  }
`;
