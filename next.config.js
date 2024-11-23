module.exports = {
rewrites: async () => {
  return [
    {
      source: "/",
      destination: "/home_page/index",
    },
    {
      source: "/acc_page_interested",
      destination: "/acc_interested/acc_page_interested",
    },
    {
      source: "/acc_artist",
      destination: "/acc_artist/acc_page_artist",
    },
    {
      source: "/artist_page",
      destination: "/artist-page/artist_page",
    },
    {
      source: "/artist_works",
      destination: "/artist_works/artist_works",
    },
    {
      source: "/favourites_page",
      destination: "/favourites_page/favourites_page",
    },
    {
      source: "/help_page",
      destination: "/help_page/help_page",
    },
    {
      source: "/index",
      destination: "/home_page/index",
    },
    {
      source: "/login_register_page",
      destination: "/login/login_register_page",
    },
    {
      source: "/upload_work",
      destination: "/upload_work/upload_work",
    },
    {
      source: "/work_opened",
      destination: "/work_opened/work_opened",
    },
    {
      source: "/works",
      destination: "/works_page/works",
    },
  ]
},
assetPrefix: "." 
}