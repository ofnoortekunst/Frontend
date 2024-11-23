// import

import fs from 'fs';

// vars

const filename = './pages/home-page/home_page';

// export

export default async function api(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(await fs.readFileSync(filename, 'utf-8'));
  res.end();
}


