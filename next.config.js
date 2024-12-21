module.exports = {
  compiler: {
    styledComponents: true,
  },
  rewrites: async () => {
    const routes = [
      "/acc_page_interested",
      "/acc_page_artist",
      "/artist_page",
      "/artist_works",
      "/favourites_page",
      "/help_page",
      "/index",
      "/login_register_page",
      "/upload_work",
      "/work_opened",
      "/works",
      "/new_password",
      "/confirm_mail",
      "/privacy",
      "/upload_work_creating_acc",
      "/privacy_policy",
      "/followers_page",
    ];

    const dynamicRewrites = routes.map((route) => ({
      source: route,
      destination: `${route}.html`,
    }));
  
    const staticRewrites = [
      {
        source: "/public/:path*",
        destination: "/:path*",
      },
      {
        source: "/",
        destination: "/index.html"
      },
      {
        source: "/art/:path*",
        destination: "/images/art/:path*",
      },
    ];

    return [...dynamicRewrites, ...staticRewrites];
  },
  assetPrefix: ".",
};