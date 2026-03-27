import React from "react";

export default function Pagination({ currentPage, totalPages, basePath }) {
  if (totalPages <= 1) return null;

  const getPagePath = (page) => {
    if (page === 1) return basePath === "/" ? "/" : basePath;
    return `${basePath === "/" ? "" : basePath}/page/${page}`;
  };

  return (
    <div className="row justify-content-center my-4">
      <div className="col-12 col-lg-10 col-xl-9">
        <ul className="list-unstyled hstack gap-3 flex-wrap m-0">
          {currentPage > 1 ? (
            <li>
              <a
                href={getPagePath(currentPage - 1)}
                className="link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2"
              >
                ←
              </a>
            </li>
          ) : (
            <span>←</span>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              {page === currentPage ? (
                <span className="bg-warning hl text-dark fw-semibold">{page}</span>
              ) : (
                <a
                  href={getPagePath(page)}
                  className="link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2"
                >
                  {page}
                </a>
              )}
            </li>
          ))}
          {currentPage < totalPages ? (
            <li>
              <a
                href={getPagePath(currentPage + 1)}
                className="link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2"
              >
                →
              </a>
            </li>
          ) : (
            <span>→</span>
          )}
        </ul>
      </div>
    </div>
  );
}
