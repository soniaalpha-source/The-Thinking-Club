# The Thinking Club — Clean Netlify Build

This is the canonical clean build. There are no App2/main2/index2 files and no redirect workaround.

## File chain

index.html
→ src/main.jsx
→ src/App.jsx

The frontend calls `/api/chat`, which is handled by:

netlify/functions/chat.mjs

## Netlify deploy settings

- Branch: main
- Base directory: blank
- Build command: npm run build
- Publish directory: dist

## Structure

```
index.html
package.json
vite.config.js
netlify.toml
README.md
src/
  App.jsx
  main.jsx
  styles.css
netlify/
  functions/
    chat.mjs
```

## Important

Use this as a fresh repository or replace the old repository contents with this exact structure.
Do not add index2.html, main2.jsx, App2.jsx, main.jsk, or a `_redirects` rule.
