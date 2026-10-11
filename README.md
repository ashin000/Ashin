# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Cloudflare Pages and private admin

The public portfolio remains a static Vite site. Its private content editor is at `/admin` and uses Pages Functions plus Cloudflare D1 for server-side authentication and persistent content. Do not put admin credentials in `VITE_*` variables or source files.

Before deploying the admin editor:

1. A D1 database named `portfolio-content-db` is configured in `wrangler.jsonc` with binding `CONTENT_DB` (ID `7ab37d61-6db0-477b-a4d3-88a1cc5b7632`). Ensure the same binding is available to the Cloudflare Pages project under **Settings → Functions → D1 database bindings** if your Pages setup does not consume the Wrangler config binding automatically.
2. The migration in `migrations/0001_portfolio_content.sql` has been applied to the remote database. To apply future migrations, run `npx wrangler d1 migrations apply portfolio-content-db --remote`.
3. Use `.env.example` as the variable-name template, then add the values as separate variables/secrets to the Pages project for both Production and Preview as appropriate: `ADMIN_USERNAME` (set to `ashin`), `ADMIN_PASSWORD` (use a strong, unique password; do not use the example password shared in chat), and `SESSION_SECRET` (a long random secret, at least 32 random bytes). Cloudflare Pages does not automatically import this example file; enter the values in its dashboard. Keep any populated local `.env` file private and uncommitted.
4. Deploy the latest commit. Open `/admin`, sign in, edit the sections, and choose **Save and publish**. The bundled current portfolio content is the starting content until the first save.

Login sessions use a signed, HTTP-only, secure, same-site cookie and expire after eight hours. Login attempts are rate-limited using the D1 table. The content API rejects unauthenticated writes. Without the Cloudflare D1 binding, migration, and secrets, the admin API intentionally stays unavailable; the public site still renders its bundled content.
