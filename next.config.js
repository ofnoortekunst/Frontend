module.exports = {
rewrites: async () => {
  return [
    {
      source: "/",
      destination: "/home_page/index.html",
    },
    {
      source: "/acc_page_interested",
      destination: "/acc_interested/acc_page_interested.html",
    },
    {
      source: "/acc_artist",
      destination: "/acc_artist/acc_page_artist.html",
    },
    {
      source: "/artist_page",
      destination: "/artist-page/artist_page.html",
    },
    {
      source: "/artist_works",
      destination: "/artist_works/artist_works.html",
    },
    {
      source: "/favourites_page",
      destination: "/favourites_page/favourites_page.html",
    },
    {
      source: "/help_page",
      destination: "/help_page/help_page.html",
    },
    {
      source: "/index",
      destination: "/home_page/index.html",
    },
    {
      source: "/login_register_page",
      destination: "/login/login_register_page.html",
    },
    {
      source: "/upload_work",
      destination: "/upload_work/upload_work.html",
    },
    {
      source: "/work_opened",
      destination: "/work_opened/work_opened.html",
    },
    {
      source: "/works",
      destination: "/works_page/works.html",
    },
  ]
},
assetPrefix: "." 
}