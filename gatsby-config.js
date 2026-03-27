module.exports = {
  siteMetadata: {
    siteUrl: "https://therussianend.net",
    siteName: "The Russian End",
    twitterUrl: "https://x.com/TheRussianEnd",
    siteEmail: "therussianend@gmail.com",
    description: "Documented suicides by Russian soldiers in Ukraine",
    ogDescription: "Documented self-inflicted deaths by Russian soldiers in Ukraine",
    keywords: "russian soldiers, russian suicides, ukraine war",
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
