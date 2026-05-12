const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PAD = 40;

const colors = [
  { name: 'magenta', color: '#FF00FF' },
  { name: 'green',   color: '#00FF00' },
  { name: 'blue',    color: '#4488FF' },
  { name: 'cyan',    color: '#00FFFF' },
  { name: 'yellow',  color: '#FFFF00' },
  { name: 'red',     color: '#FF2222' },
  { name: 'orange',  color: '#FF6600' },
  { name: 'purple',  color: '#AA00FF' },
  { name: 'pink',    color: '#FF44AA' },
  { name: 'gold',    color: '#FFD700' },
  { name: 'teal',    color: '#00CCAA' },
  { name: 'white',   color: '#FFFFFF' },
];

// logos/{color}/{variant}.png
// Variants: white, black, transparent, thin-outline
const solidFills = [
  { variant: 'white',       fill: '#FFFFFF' },
  { variant: 'black',       fill: '#000000' },
  { variant: 'transparent', fill: 'transparent' },
];

function makeSolidHtml(borderColor, fillColor) {
  const o = 3;
  const dirs = [`${o}px ${o}px`, `${o}px -${o}px`, `-${o}px ${o}px`, `-${o}px -${o}px`,
                `${o}px 0`, `-${o}px 0`, `0 ${o}px`, `0 -${o}px`];
  const shadow = dirs.map(d => `${d} 0 ${borderColor}`).join(', ');
  return makeShell(`color: ${fillColor}; text-shadow: ${shadow};`);
}

function makeThinHtml(borderColor) {
  return makeShell(`color: transparent; -webkit-text-stroke: 1.5px ${borderColor};`);
}

function makeShell(extraCss) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: transparent; width: max-content; height: max-content; }
  .wrapper { padding: ${PAD}px; display: inline-flex; align-items: center; justify-content: center; }
  .logo {
    font-family: 'Press Start 2P', monospace;
    font-size: 72px;
    line-height: 1;
    white-space: nowrap;
    letter-spacing: 2px;
    display: inline-block;
    ${extraCss}
  }
</style>
</head>
<body>
  <div class="wrapper"><div class="logo">SOUND/TEST</div></div>
</body>
</html>`;
}

async function render(browser, html, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2000, height: 400 });
  await page.setContent(html, { waitUntil: 'networkidle2' });
  const box = await (await page.$('body')).boundingBox();
  const w = Math.ceil(box.width);
  const h = Math.ceil(box.height);
  await page.setViewport({ width: w, height: h });
  await page.screenshot({ path: outPath, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(path.relative(process.cwd(), outPath));
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  for (const { name, color } of colors) {
    const dir = path.join(__dirname, 'logos', name);
    fs.mkdirSync(dir, { recursive: true });

    // Solid fill variants
    for (const { variant, fill } of solidFills) {
      // skip white border on white fill — invisible
      if (name === 'white' && variant === 'white') continue;
      await render(browser, makeSolidHtml(color, fill), path.join(dir, `${variant}.png`));
    }

    // Thin outline variant
    await render(browser, makeThinHtml(color), path.join(dir, 'thin-outline.png'));
  }

  await browser.close();
  console.log('Done.');
})();
