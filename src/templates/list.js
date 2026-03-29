import React from "react";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function Head({ pageContext }) {
  const { filterType, filterValue, siteName } = pageContext;
  let title = null;
  if (filterType === "conclusive") title = `Conclusive`;
  else if (filterType === "inconclusive") title = `Inconclusive `;
  else if (filterType === "method") title = `Method: ${filterValue}`;
  else if (filterType === "year") title = `${String(filterValue)}`;
  else if (filterType === "month") title = `${MONTH_NAMES[parseInt(filterValue.split("/")[1]) - 1]} ${filterValue.split("/")[0]}`;
  if (!title) {
    title = siteName;
  } else {
    title += ` – ${siteName}`;
  }
  return <title>{title}</title>;
}

export default function ListTemplate({ pageContext }) {
  const { cases, currentPage, totalPages, basePath, stats, filterType, filterValue } = pageContext;
  const { conclusiveCount, inconclusiveCount, methodMap, yearMap } = stats;
  const sortedYears = Object.keys(yearMap).sort((a, b) => a - b);

  return (
    <Layout filterType={filterType} isList={true}>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-lg-10 col-xl-9">
          <p>War in Ukraine revealed a great deal of documented self-inflicted deaths by Russian soldiers on the battlefield. As of today <b className="fw-bold text-light">{conclusiveCount} of them<sup>†</sup></b> arrived at suicide as the best possible outcome, and were filmed committing one. Puzzling to think about and terrible to watch, this phenomena seems increasingly characteristic for Russian army, truly unmatched in this grim respect.</p>

          <p>While everyone can conteplate the reasons, the goal of this page is to merely document these bizzare acts in light of their public significance. We're sourcing data from social media.</p>

          <div className="hstack flex-wrap gap-4 smaller mt-4">
            <ul className="list-unstyled hstack gap-4 m-0">
              <li className="vstack align-items-start gap-1">
                <span className={"d-block" + (filterType === "conclusive" ? " hl text-dark bg-warning fw-semibold" : "")}>† Conclusive</span>
                <a href="/conclusive" className={"fs-5 " + (filterType === "conclusive" ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}>
                  {conclusiveCount}
                </a>
              </li>
              <li className="vstack align-items-start gap-1">
                <span className={"d-block" + (filterType === "inconclusive" ? " hl text-dark bg-warning fw-semibold" : "")}>Inconclusive</span>
                <a href="/inconclusive" className={"fs-5 " + (filterType === "inconclusive" ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}>
                  {inconclusiveCount}
                </a>
              </li>
            </ul>

            <ul className="list-unstyled hstack gap-3 m-0">
              {Object.entries(methodMap).map(([method, count]) => (
                <li key={method} className="vstack align-items-start gap-1">
                  <span className={"d-block" + (filterType === "method" && filterValue === method ? " hl text-dark bg-warning fw-semibold" : "")}>
                    {method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}
                  </span>
                  <a href={`/method/${method}`} className={"fs-5 " + (filterType === "method" && filterValue === method ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}>
                    {count}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="list-unstyled hstack flex-wrap gap-4 m-0">
              {sortedYears.map((year) => {
                const yearData = yearMap[year];
                const sortedMonths = Object.keys(yearData.months).sort((a, b) => a - b);
                return (
                  <li key={year} className="vstack align-items-start gap-1 flex-grow-0">
                    <span className={"d-block" + (filterType === "year" && filterValue === `${year}` ? " hl text-dark bg-warning fw-semibold" : "")}>{year}</span>
                    <a href={`/${year}`} className={"fs-5 " + (filterType === "year" && filterValue === `${year}` ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}>
                      {yearData.total}
                    </a>
                    <ul className="list-unstyled hstack gap-3 m-0 mt-1">
                      {sortedMonths.map((month) => (
                        <li key={month} className="vstack align-items-start gap-1 flex-grow-0">
                          <span className={"d-block" + (filterType === "month" && filterValue === `${year}/${month}` ? " hl text-dark bg-warning fw-semibold" : "")}>
                            {MONTH_NAMES[parseInt(month) - 1]}
                          </span>
                          <a href={`/${year}/${month}`} className={"fs-6 " + (filterType === "month" && filterValue === `${year}/${month}` ? "hl text-dark bg-warning fw-semibold text-decoration-none" : "link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2")}>
                            {yearData.months[month]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>

          {totalPages > 1 && (
            <hr className="mt-4 mb-0" />
          )}
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />

      <ul className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 list-unstyled gy-4">
        {cases.map((c) => (
          <li key={c.number} className="col">
            <div className="card h-100">
              <a href={`/${c.number}`} className="d-block card-img-top">
                <img
                  src={`/images/${c.number}.jpg`}
                  className={`h-100 w-100${c.nsfl ? " nsfl" : ""}`}
                  alt={c.caption}
                />

                <div className="position-absolute top-0 start-0 m-3 hstack gap-2 align-items-start">
                  <span className="badge text-dark bg-white  fs-6 fw-semibold">
                    #{c.number}
                  </span>
                  {c.inconclusive && (
                    <span className="badge rounded-pill bg-secondary fw-medium">Inconclusive</span>
                  )}
                </div>

                {c.nsfl && (
                  <span className="position-absolute top-50 start-50 translate-middle badge bg-danger fs-5">NSFL</span>
                )}
              </a>
              <div className="card-body vstack justify-content-between">
                <h3 className="fs-6">
                  <a href={`/${c.number}`} className="d-block link-light link-underline-opacity-25 link-underline-opacity-50-hover link-offset-2">
                    {c.caption}
                  </a>
                </h3>
                <span className="text-lighter small">{formatDate(c.date)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
    </Layout>
  );
}
