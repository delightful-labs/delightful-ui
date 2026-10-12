# Delightful UI

A Svelte 5 component library undergoing an API and styling migration. See the review documents in `docs` for breaking changes.

## Development

Use Node.js 22.17+ on the 22.x line, or Node.js 24+, and pnpm 10.22.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm build` builds the development app and the library. `pnpm package` generates `dist`, including declarations, and validates package metadata with publint. `pnpm check` runs static Svelte and TypeScript checks. `pnpm lint` checks formatting and ESLint; format only the files you change with `pnpm exec prettier --write <files>`.

The test scripts remain available, but tests require implementation review and approval before they are added or run.

## Theme

Import the optional global theme once in your application layout:

```js
import 'delightful-ui/theme.css'
```

The theme supplies green accents (`#94ff47`), light surfaces, shared spacing, and base typography/media/focus styles. Button hover uses green with dark text. Source Code Pro falls back to monospace; font files are not bundled. Without this import, components retain their own styling fallbacks.

For the dark theme, set `data-dui-theme="dark"` on the root `<html>` element; remove it or use `light` for light mode. The theme does not switch automatically. Override `--dui-*` properties on the root for application-wide theming, or `--dui-button-*` properties to customize Button.

The stylesheet uses the `dui-theme` cascade layer so ordinary application CSS can override its defaults. It is global when imported: it changes body margins, colors, fonts, box sizing, links, focus indicators, and native control fonts/accent colors. It contains no page layout, heading scale, or form-control replacement.

## InputText

Use a native name and optional default value for form submission without field state:

```svelte
<InputText
	label="Description"
	name="description"
	defaultValue="Groceries"
	required
/>
```

Native attributes and callbacks pass through. `bind:value` is optional. Use `label` for visible text, `id` for an explicit input ID, and a native datalist ID for `list`. See [InputText review](docs/svelte-5-input-text-review.md) for reset semantics and breaking changes from the old API.

## Storybook

Storybook is deferred to a separate migration review. Its configuration and stories remain in `.storybook` and `src/stories`; outdated Storybook dependencies and commands have been removed from the active toolchain. Storybook is currently unavailable.

## Packaging and publishing

Import components from `delightful-ui`: Button, Details, Dialog, InputText, InputNumber, LoadingSpinner, and ScreenReaderText.

The root package exports `dist/index.js` and `dist/index.d.ts`. Internal library aliases are rewritten by Svelte's package tooling. Consumers require Svelte 5.57.2 or newer within Svelte 5.

To prepare a local archive after building:

```sh
pnpm pack
```

Publishing requires explicit authorization. Run `pnpm publish` from the repository root when authorized; the package's `files` field includes `dist`. Do not publish the obsolete `package` directory.

Use https://www.conventionalcommits.org/en/v1.0.0/ for PR titles.
