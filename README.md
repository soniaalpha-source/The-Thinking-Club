# The Thinking Club — Netlify Live AI Build

This is the first **real live-AI** Thinking Club prototype.

## What changed

- Ask about anything the model can discuss.
- One shared conversation.
- Five learner-controlled characters:
  - 🎓 Professor Elm — explain
  - 🔎 Detective Vale — investigate evidence
  - 🤨 The Sceptic — challenge assumptions
  - 😈 Mischief — plant plausible reasoning errors
  - 🌿 Tutor Moss — scaffold when stuck
- Switch characters by pressing their buttons or typing their names.
- Permanent **Clue / Bigger clue / Show answer** controls.
- "Give me the answer" means answer immediately.
- Mobile-first interface.
- No Anthropic/OpenAI API key has to be put in the browser.

## Why Netlify

This build uses a Netlify Function plus **Netlify AI Gateway**. Netlify's AI Gateway can route to an AI provider without you creating or exposing a provider API key.

## Deploy

### Recommended: GitHub → Netlify

1. Put this whole folder into a GitHub repository.
2. In Netlify choose **Add new project → Import an existing project**.
3. Choose GitHub and select the repository.
4. Netlify should read `netlify.toml` automatically.
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy.
8. AI Gateway requires a current Netlify credit-based plan (free or paid) and at least one production deploy.
9. Once the production deploy is complete, open the site and test.

The project uses Netlify's OpenAI-compatible AI Gateway and `gpt-5-mini`.

## Local development

Install Node.js and Netlify CLI, then:

```bash
npm install
netlify dev
```

## Important prototype notes

This is still a prototype, not a production child-safety system. Before public release to children, add appropriate authentication, usage controls, privacy design, moderation/monitoring decisions, abuse protection, and a proper safeguarding review.

The current app sends the most recent 20 conversation messages to the server function to keep context and control token usage.
