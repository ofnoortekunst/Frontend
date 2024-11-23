module.exports = {
rewrites: async () => {
  return [
    {
      source: "/",
      destination: "/home-page/index.html",
    },
    {
      source: "/acc_page_interested",
      destination: "/acc-interested/acc-page-interested.html",
    },
    {
      source: "/acc_artist",
      destination: "/acc-artist/acc-page/artist.html",
    },
    {
      source: "/artist_page",
      destination: "/artist-page/artist-page.html",
    },
    {
      source: "/artist_works",
      destination: "/artist-works/artist-works.html",
    },
    {
      source: "/favourites_page",
      destination: "/fav-page/favourites_page.html",
    },
    {
      source: "/help_page",
      destination: "/help-page/help-page.html",
    },
    {
      source: "/index.html",
      destination: "/home-page/index.html",
    },
    {
      source: "/login",
      destination: "/login/login_register_page.html",
    },
    {
      source: "/upload_work",
      destination: "/upload_work/upload_work.html",
    },
    {
      source: "/work_opened",
      destination: "/work-opened/work-opened.html",
    },
    {
      source: "/works",
      destination: "/works-page/works.html",
    },
    {
      source: "/index.html",
      destination: "/",
    },
  ]
},
assetPrefix: "." 
}