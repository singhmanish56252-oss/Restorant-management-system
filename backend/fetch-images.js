import https from 'https';

const items = [
  "Chilli paneer",
  "Fish finger",
  "Kebab", 
  "Spring roll",
  "Chicken tikka",
  "Paneer tikka",
  "Fish head curry",
  "Corona (beer)",
  "Pilsner",
  "Champagne",
  "Chardonnay",
  "Fruit tart",
  "Cheesecake",
  "Gulab jamun"
];

async function fetchImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve('No image found');
          }
        } catch(e) {
          resolve('Error');
        }
      });
    });
  });
}

async function main() {
  for (const item of items) {
    const img = await fetchImage(item);
    console.log(`${item} -> ${img}`);
  }
}
main();
