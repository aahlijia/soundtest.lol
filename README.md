# soundtest.lol

Static site, no build step required to view it — open any `.html` file directly.

`css/bundle.min.css` is a minified concatenation of `css/main.css`,
`css/retro-theme.css`, and `css/components.css`, rebuilt automatically by
CI (`.github/workflows/build-css.yml`) on every push to `main` that touches
source CSS. To preview your own CSS edits locally before pushing, regenerate
it with:

```
npm install
npm run build:css
```
