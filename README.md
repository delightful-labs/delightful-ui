# Delightful UI

A Svelte 5 component library undergoing an API and styling migration. See [breaking changes](docs/svelte-5-breaking-changes.md) for the current migration reference.

## Development

Use Node.js 22.17+ on the 22.x line, or Node.js 24+, and pnpm 10.22.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm build` builds the development app and the library. `pnpm package` generates `dist`, including declarations, and validates package metadata with publint. `pnpm check` runs static Svelte and TypeScript checks. `pnpm lint` checks formatting and ESLint; format only the files you change with `pnpm exec prettier --write <files>`.

Tests require implementation review and approval before they are added or run. After approval, use `pnpm test:unit --run` for SSR/unit checks and `pnpm test` to build current source and run Chromium scenarios against a temporary production preview on port 4174.

Source imports use `#lib` and `#lib/*`, declared in `package.json`. Public package imports remain `delightful-ui` and `delightful-ui/theme.css`.

## Theme

Import the optional global theme once in your application layout:

```js
import 'delightful-ui/theme.css'
```

The theme supplies green accents (`#94ff47`), light surfaces, shared spacing, and base typography/media/focus styles. Button hover uses green with dark text. Source Code Pro falls back to monospace; font files are not bundled. Without this import, components retain their own styling fallbacks.

For the dark theme, set `data-dui-theme="dark"` on the root `<html>` element; remove it or use `light` for light mode. The theme does not switch automatically. Override `--dui-*` properties on the root for application-wide theming, or `--dui-button-*` properties to customize Button.

The stylesheet uses the `dui-theme` cascade layer so ordinary application CSS can override its defaults. It is global when imported: it changes body margins, colors, fonts, box sizing, links, focus indicators, and native control fonts/accent colors. It contains no page layout, heading scale, or form-control replacement.

## Button

```svelte
<Button>{saveLabel}</Button>
<Button text={cancelLabel} />
```

Labels are caller-provided strings or child snippets. Button no longer accepts locale objects or reads UIProvider; absent content has no generic English fallback. Provide an accessible label for every button.

Field labels render exactly as supplied. Native `required` validation remains; supply your own translated visible marker in the label when needed. Shared `--dui-color-error` adapts invalid styling to the explicit light/dark themes.

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

Native attributes and callbacks pass through. `bind:value` is optional. Use `label` for visible text, `id` for an explicit input ID, and a native datalist ID for `list`.

## InputNumber

```svelte
<InputNumber
	label="Quantity"
	name="quantity"
	defaultValue={1}
	min={0}
	step={1}
	required
/>
```

Native numeric constraints and callbacks pass through. Optional `bind:value` yields a number or undefined; FormData still yields strings. Use `min`, `max`, and `step` rather than character-length truncation.

## InputDate

```svelte
<InputDate label="Date" name="date" defaultValue="2026-10-13" />
```

Values stay as date-only strings; the library performs no Date or timezone conversion. Native `min`, `max`, and `step` constraints pass through. `bind:value` is optional, and `defaultValue` supplies initial/reset text.

## Select

```svelte
<Select label="Category" name="category" defaultValue="personal">
	<option value="personal">Personal</option>
	<option value="work">Work</option>
</Select>
```

Options and groups use native markup. Native attributes pass through; `bind:value` is optional. Use strings for single-select values/defaults, or string arrays with `multiple`. Styling shares the field/input tokens and keeps native browser appearance.

## Textarea

```svelte
<Textarea label="Notes" name="notes" defaultValue="First line" rows={4} />
```

Native multiline editing, attributes, and callbacks pass through. `bind:value` is optional; `defaultValue` supplies initial/reset text. Styling shares the field/input tokens, with vertical resizing by default through `--dui-textarea-resize`.

## Checkbox

```svelte
<Checkbox label="Receive updates" name="updates" value="yes" defaultChecked />
```

The native control submits its value only when checked and enabled. `bind:checked` is optional; `defaultChecked` supplies initial/reset state. The clickable label and native checkbox use green accent and explicit focus styling.

## Details

```svelte
<Details summary="Filters" position="absolute" align="end">
	<form><!-- native controls --></form>
</Details>
```

Inline is the default. Absolute mode anchors a bounded panel to its summary and supports outside-pointer and Escape dismissal. Use native attributes/callbacks and optional `bind:open`.

## Dialog

```svelte
<Button onclick={() => (dialogOpen = true)}>Edit item</Button>
<Dialog heading="Edit item" bind:open={dialogOpen}>
	<form method="dialog">
		<Button type="submit" value="cancel" formnovalidate>Cancel</Button>
	</form>
</Dialog>
```

Initialize dialogOpen as a Svelte boolean state. Dialog uses native modal behavior and callbacks; triggers and close controls belong to the caller. Required headings accept caller-translated strings or snippets. Locale objects and UIProvider have been removed.

## LoadingSpinner

```svelte
<LoadingSpinner text="Saving changes" />
```

The hidden status text defaults to Loading. Native div attributes and callbacks pass through. Customize `--dui-loading-spinner-size`, `--dui-loading-spinner-color`, and `--dui-loading-spinner-border-width`; defaults retain the 80px current-color ripple. Reduced-motion mode shows one static ring.

## ScreenReaderText

```svelte
<Button>Save <ScreenReaderText>changes to this item</ScreenReaderText></Button>
```

Children supply visually hidden supplementary text. Native span attributes pass through, including `id` for accessible description references. Keep interactive controls outside this component.

## Storybook

Storybook uses the latest stable compatible toolchain verified for this migration: Storybook 10.6.2 and Svelte CSF addon 5.1.5. It runs independently of the SvelteKit demo using the Svelte/Vite framework. Stories cover all eleven public components with the optional theme applied.

```sh
pnpm storybook
pnpm build-storybook
```

The development command uses http://127.0.0.1:6006 with a strict port. The static build writes `storybook-static`, which is ignored by git and excluded from the published library. Stories and configuration participate in static checking and linting.

After reviewing implementation, `pnpm test:storybook` builds a test-only Storybook and runs Select, Textarea, Checkbox, and InputDate Chromium scenarios on temporary preview port 6007. It includes binding fixtures without adding them to the normal Storybook.

## Packaging and publishing

Import components from `delightful-ui`: Button, Details, Dialog, InputText, InputNumber, InputDate, Select, Textarea, Checkbox, LoadingSpinner, and ScreenReaderText.

The root package exports `dist/index.js` and `dist/index.d.ts`. Internal library aliases are rewritten by Svelte's package tooling. Consumers require Svelte 5.57.2 or newer within Svelte 5.

To prepare a local archive after building:

```sh
pnpm pack
```

Publishing requires explicit authorization. Run `pnpm publish` from the repository root when authorized; the package's `files` field includes `dist`. Do not publish the obsolete `package` directory.

Use https://www.conventionalcommits.org/en/v1.0.0/ for PR titles.
