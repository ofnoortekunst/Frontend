module.exports = {
rewrites: async () => {
  return [
    {
      source: "/",
      destination: "/home-page/index.html",
    },
    {
      source: "/acc-page-interested.html",
      destination: "/acc-interested/acc-page-interested.html",
    },
    {
      source: "/acc-artist.html",
      destination: "/acc-artist/acc-page/artist.html",
    },
    {
      source: "/artist-page.html",
      destination: "/artist-page/artist-page.html",
    },
    {
      source: "/artist-works.html",
      destination: "/artist-works/artist-works.html",
    },
    {
      source: "/fav-page.html",
      destination: "/fav-page/favourites_page.html",
    },
    {
      source: "/help-page.html",
      destination: "/help-page/help-page.html",
    },
    {
      source: "/index.html",
      destination: "/home-page/index.html",
    },
    {
      source: "/login.html",
      destination: "/login/login_register_page.html",
    },
    {
      source: "/upload_work.html",
      destination: "/upload_work/upload_work.html",
    },
    {
      source: "/work-opened.html",
      destination: "/work-opened/work-opened.html",
    },
    {
      source: "/works-page.html",
      destination: "/works-page/works.html",
    },
  ]
},
assetPrefix: "." 
}