module.exports = {
  siteMetadata: {
    siteUrl: "https://therussianend.com",
    siteName: "The Russian End",
    twitterUrl: "https://x.com/TheRussianEnd",
    siteEmail: "therussianend@gmail.com",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "cases",
        path: `${__dirname}/content/cases`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        allowDangerousHtml: true,
      },
    },
    "gatsby-plugin-sass",
  ],
};
