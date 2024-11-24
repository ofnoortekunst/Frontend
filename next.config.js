module.exports = {
rewrites: async () => {
  return [
    {
      source: "/",
      destination: "/index.html",
    },
    {
      source: "/acc_page_interested",
      destination: "/acc_page_interested.html",
    },
    {
      source: "/acc_artist",
      destination: "/acc_page_artist.html",
    },
    {
      source: "/artist_page",
      destination: "/artist_page.html",
    },
    {
      source: "/artist_works",
      destination: "/artist_works.html",
    },
    {
      source: "/favourites_page",
      destination: "/favourites_page.html",
    },
    {
      source: "/help_page",
      destination: "/help_page.html",
    },
    {
      source: "/index",
      destination: "/index.html",
    },
    {
      source: "/login_register_page",
      destination: "/login_register_page.html",
    },
    {
      source: "/upload_work",
      destination: "/upload_work.html",
    },
    {
      source: "/work_opened",
      destination: "/work_opened.html",
    },
    {
      source: "/works",
      destination: "/works.html",
    },
    {
      source: "/new_password",
      destination: "/new_password.html",
    },
    {
      source: "/confirm_mail",
      destination: "/confirm_mail.html",
    },
    {
    source: '/public/:path*',
    destination: '/:path*',
    },
  ]
},
assetPrefix: "." 
}