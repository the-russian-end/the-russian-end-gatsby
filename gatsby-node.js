const path = require("path");

const ITEMS_PER_PAGE = 30;

function numberFromPath(fileAbsolutePath) {
  return parseInt(path.basename(fileAbsolutePath, ".md"), 10);
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          id
          fileAbsolutePath
          frontmatter {
            caption
            date
            nsfl
            method
            inconclusive
          }
        }
      }
      site {
        siteMetadata {
          siteName
        }
      }
    }
  `);

  const allCases = result.data.allMarkdownRemark.nodes
    .map((n) => ({ ...n, number: numberFromPath(n.fileAbsolutePath) }))
    .sort((a, b) => b.number - a.number);
  const listTemplate = path.resolve("src/templates/list.js");
  const caseTemplate = path.resolve("src/templates/case.js");

  // ── Individual case pages ─────────────────────────────────────────────────
  allCases.forEach((node, pos) => {
    createPage({
      path: `/${node.number}`,
      component: caseTemplate,
      context: {
        id: node.id,
        number: node.number,
        prevNumber: allCases[pos + 1] ? allCases[pos + 1].number : null,
        nextNumber: allCases[pos - 1] ? allCases[pos - 1].number : null,
      },
    });
  });

  // ── Stats sidebar data (small scalars only) ───────────────────────────────
  const stats = buildStats(allCases);

  // ── Card data: only the fields the list card needs ────────────────────────
  function cardData(node) {
    return {
      number: node.number,
      caption: node.frontmatter.caption,
      date: node.frontmatter.date,
      nsfl: node.frontmatter.nsfl || false,
      inconclusive: node.frontmatter.inconclusive || false,
    };
  }

  // ── Paginate a list of nodes, passing card data directly in pageContext ────
  function paginate(nodes, basePath, extraContext) {
    const totalPages = Math.max(1, Math.ceil(nodes.length / ITEMS_PER_PAGE));
    for (let i = 1; i <= totalPages; i++) {
      const slice = nodes.slice((i - 1) * ITEMS_PER_PAGE, i * ITEMS_PER_PAGE);
      const base = basePath === "/" ? "" : basePath;
      const pagePath = i === 1 ? (basePath === "/" ? "/" : basePath) : `${base}/page/${i}`;
      createPage({
        path: pagePath,
        component: listTemplate,
        context: {
          cases: slice.map(cardData),
          currentPage: i,
          totalPages,
          basePath,
          stats,
          siteName: result.data.site.siteMetadata.siteName,
          ...extraContext,
        },
      });
    }
  }

  // ── All ───────────────────────────────────────────────────────────────────
  paginate(allCases, "/", { filterType: null, filterValue: null });

  // ── Conclusive / Inconclusive ─────────────────────────────────────────────
  paginate(
    allCases.filter((n) => !n.frontmatter.inconclusive),
    "/conclusive",
    { filterType: "conclusive", filterValue: null }
  );
  paginate(
    allCases.filter((n) => !!n.frontmatter.inconclusive),
    "/inconclusive",
    { filterType: "inconclusive", filterValue: null }
  );

  // ── Methods ───────────────────────────────────────────────────────────────
  const methods = [...new Set(allCases.map((n) => n.frontmatter.method).filter(Boolean))];
  methods.forEach((method) => {
    paginate(
      allCases.filter((n) => n.frontmatter.method === method),
      `/method/${method}`,
      { filterType: "method", filterValue: method }
    );
  });

  // ── Years / Months ────────────────────────────────────────────────────────
  const yearMonthMap = {};
  allCases.forEach((n) => {
    if (!n.frontmatter.date) return;
    const parts = String(n.frontmatter.date).split("T")[0].split("-");
    const y = parts[0];
    const mo = parseInt(parts[1], 10).toString();
    if (!yearMonthMap[y]) yearMonthMap[y] = {};
    if (!yearMonthMap[y][mo]) yearMonthMap[y][mo] = [];
    yearMonthMap[y][mo].push(n);
  });

  Object.entries(yearMonthMap).forEach(([year, months]) => {
    const yearNodes = Object.values(months).flat()
      .sort((a, b) => b.number - a.number);
    paginate(yearNodes, `/${year}`, { filterType: "year", filterValue: year });

    Object.entries(months).forEach(([month, nodes]) => {
      const sorted = [...nodes].sort((a, b) => b.number - a.number);
      paginate(sorted, `/${year}/${month}`, { filterType: "month", filterValue: `${year}/${month}` });
    });
  });
};

function buildStats(allCases) {
  const conclusiveCount   = allCases.filter((n) => !n.frontmatter.inconclusive).length;
  const inconclusiveCount = allCases.filter((n) => !!n.frontmatter.inconclusive).length;

  const methodMap = {};
  allCases.forEach((n) => {
    if (n.frontmatter.method)
      methodMap[n.frontmatter.method] = (methodMap[n.frontmatter.method] || 0) + 1;
  });

  const yearMap = {};
  allCases.forEach((n) => {
    if (!n.frontmatter.date) return;
    const parts = String(n.frontmatter.date).split("T")[0].split("-");
    const y = parts[0];
    const mo = parseInt(parts[1], 10).toString();
    if (!yearMap[y]) yearMap[y] = { total: 0, months: {} };
    yearMap[y].total++;
    yearMap[y].months[mo] = (yearMap[y].months[mo] || 0) + 1;
  });

  return { conclusiveCount, inconclusiveCount, methodMap, yearMap };
}
