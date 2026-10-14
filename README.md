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

Field labels use the shared `--dui-font-size-sm` token (`0.875rem`, with the same fallback without the theme). Override `--dui-field-font-size` to customize label size independently of input text.

For the dark theme, set `data-dui-theme="dark"` on the root `<html>` element; remove it or use `light` for light mode. The theme does not switch automatically. Override `--dui-*` properties on the root for application-wide theming, or `--dui-button-*` properties to customize Button.

The stylesheet uses the `dui-theme` cascade layer so ordinary application CSS can override its defaults. It is global when imported: it changes body margins, colors, fonts, box sizing, links, focus indicators, and native control fonts/accent colors. It contains no page layout, heading scale, or form-control replacement.

## Button

```svelte
<Button>{saveLabel}</Button>
<Button text={cancelLabel} />
```

Labels are caller-provided strings or child snippets. Button no longer accepts locale objects or reads UIProvider; absent content has no generic English fallback. Provide an accessible label for every button.

Field labels render exactly as supplied. Native `required` validation remains; supply your own translated visible marker in the label when needed. Shared `--dui-color-error` adapts invalid styling to the explicit light/dark themes.

Button defaults to `variant="raised"`. Use `variant="flat"` for square bordered controls with no default shadow or pressed movement. Flat pressed colors can be customized with `--dui-button-color-active` and `--dui-button-background-color-active`.

## NumberKeypad

```svelte
<NumberKeypad
	label="Amount keypad"
	decimalLabel="Decimal separator"
	backspaceLabel="Delete last digit"
	nextLabel="Next"
	onkey={handleKey}
/>
```

`handleKey` receives a `NumberKeypadKey`: a digit string (`'0'`–`'9'`), `'decimal'`, `'backspace'`, or `'next'`. Import that type from `delightful-ui` when typing your handler. All keys are native `type="button"` controls; the keypad does not edit a value, submit a form, parse money, navigate, or listen for physical number keys.

Supply translated labels from the application. `decimalSeparator` changes the displayed character (default `.`) while its command remains `'decimal'`. `disabled` disables every key; `nextDisabled` disables Next independently. Native group attributes, class, and style pass through.

The three-column grid fills its container, with a full-width Next button. Keys use flat Buttons and responsive `--dui-number-keypad-key-aspect-ratio` (default `1`). Override it with `3 / 2` for rectangular keys. Other properties are `--dui-number-keypad-gap` (default `0.5rem`), `--dui-number-keypad-key-min-height` (default `64px`), and `--dui-number-keypad-font-size` (default `1.5rem`). Minimum height and content size take precedence when space is tight. The application owns width, screen placement, amount drafts, caret/focus management, and custom/device keyboard selection.

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

## TagInput

```svelte
<TagInput
	label="Tags"
	name="tags"
	addLabel="Add tag"
	removeLabel={(tag) => `Remove ${tag}`}
	selectedTagsLabel="Selected tags"
	addedMessage={(tag) => `${tag} added`}
	removedMessage={(tag) => `${tag} removed`}
	duplicateMessage={(tag) => `${tag} is already added`}
	instructions="Press Enter to add a tag. Use Arrow keys to choose a suggestion."
	defaultValue={['Work']}
	suggestions={['Work', 'Personal', 'Recipes']}
/>
```

This custom component has no tag-input dependency. Enter or the Add button adds a trimmed tag; empty values and case-insensitive duplicates are rejected. Commas remain part of tag text. Duplicate drafts remain available for correction, and blur does not commit a draft. Optional `suggestions` appear in a native popover filtered by the draft, excluding tags already selected. Clicking a suggestion adds it immediately. Arrow keys select an option, Enter adds it, and Escape dismisses the list; typing again reopens it. Focus stays in the input. The list follows the input on scroll and resize, opens above it when space below is limited, and stays within the viewport. Browsers without the Popover API retain free-text entry and the Add button.

Optional `bind:value` reads and updates a string array. `defaultValue` defaults to an empty array and supplies initial/reset tags; reset also clears the draft. Caller-supplied arrays are copied when edited. Supply translated `addLabel`, `removeLabel(tag)`, `selectedTagsLabel`, `addedMessage(tag)`, `removedMessage(tag)`, and `duplicateMessage(tag)` text. These labels and message callbacks are required. `id` and `placeholder` are optional.

Committed tags render as a named list. Additions and removals are announced through a polite status region; duplicate feedback is also visible and leaves the draft intact. Editing the draft or resetting clears feedback. After removal, focus moves to the next remove button, then the previous one if the last tag was removed, or to the input when no tags remain.

Optional `instructions` and `errorMessage` render visible text linked to the input. `errorMessage` marks the input invalid by default; an explicit `aria-invalid` takes precedence. `aria-describedby` accepts IDs for application-provided descriptions and is combined with internal help, error, and duplicate-feedback IDs. The application owns validation; no minimum tag count is enforced.

Chips and the entry controls share a wrapping row, with compact borderless remove buttons and 48px minimum heights. Customize `--dui-tag-gap`, `--dui-tag-entry-gap`, `--dui-tag-min-height`, `--dui-tag-color`, `--dui-tag-background-color`, and `--dui-tag-remove-background-color-hover`; input styling uses the shared input tokens.

Inside a form, each committed tag submits a separate field under `name`; read tags with `new FormData(form).getAll('tags')`. Draft text is excluded, and an empty array submits no fields. `disabled` prevents editing and submission; `readonly` prevents editing but submits existing tags. The component contains no nested form.

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

## Popover

```svelte
<Button popovertarget="amount-info">About amounts</Button>
<Popover id="amount-info">
	<p>Enter the total amount, including tax.</p>
</Popover>
```

Supply a unique `id` and caller-owned, accessibly named trigger. Rich children and native div attributes/callbacks pass through, including `onbeforetoggle` and `ontoggle`. Popover always uses native auto behavior: the trigger toggles it, outside clicks and Escape dismiss it, and opening another unrelated auto popover closes it. There is no `bind:open`, modal focus trap, or default tooltip/dialog role. Callers provide translated content, headings, and optional close buttons using `popovertargetaction="hide"`.

CSS anchor positioning places the panel below the invoking button with a 4px gap and alternative placements when space is limited. Browsers without CSS anchor positioning retain centered native placement. Native Popover API support is required; no polyfill is included. The panel defaults to 24rem, bounded by the viewport with scrollable overflow. Customize `--dui-popover-width`, `--dui-popover-gap`, `--dui-popover-padding`, `--dui-popover-color`, `--dui-popover-background-color`, `--dui-popover-border-width`, `--dui-popover-border-color`, and `--dui-popover-shadow`; shared theme tokens supply defaults.

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

Screen-reader text renders only when a nonempty `text` is supplied; there is no default message. Supply translated text for standalone status spinners. For decorative use alongside an existing message, omit `text` and set `role="presentation"` and `aria-hidden="true"` (or hide its wrapper). Native div attributes and callbacks pass through. Customize `--dui-loading-spinner-size`, `--dui-loading-spinner-color`, and `--dui-loading-spinner-border-width`; defaults retain the 80px current-color ripple. Reduced-motion mode shows one static ring.

## StatusMessage

See the [Finance-driven component specification](docs/finance-component-spec.md) for requirements and proposed follow-up components.

```svelte
<StatusMessage variant="loading" text={loadingMessage} />
<StatusMessage variant="success" text={savedMessage} />
<StatusMessage variant="error" text={saveError} />
```

Required `text` is caller-owned and visible. `variant` defaults to `info`; `loading` adds a compact decorative LoadingSpinner, while `success` and `info` show text alone. Errors use `role="alert"` and the shared error color; other variants use `role="status"`. The spinner is excluded from the accessibility tree, leaving one live region. Native div attributes and callbacks, class, and style pass through. Override `role` or `aria-live` when the application supplies announcement behavior; avoid nesting inside another live region. For announcements of updates, keep the component mounted and update its text/variant rather than relying on initially rendered status text being announced.

The application owns visibility, loading/save state, translations, retry actions, and error mapping. The component accepts plain text and adds no dismissal, timer, form logic, or generic fallback messages. Spacing uses `gap`, and long text wraps. Customize `--dui-status-message-gap`, `--dui-status-message-color`, `--dui-status-message-error-color`, `--dui-status-message-spinner-size` (default `1.5rem`), and `--dui-status-message-spinner-border-width` (default `2px`). Loading animation and reduced-motion behavior come from LoadingSpinner.

## ScreenReaderText

```svelte
<Button>Save <ScreenReaderText>changes to this item</ScreenReaderText></Button>
```

Children supply visually hidden supplementary text. Native span attributes pass through, including `id` for accessible description references. Keep interactive controls outside this component.

## Storybook

Storybook uses the latest stable compatible toolchain verified for this migration: Storybook 10.6.2 and Svelte CSF addon 5.1.5. It runs independently of the SvelteKit demo using the Svelte/Vite framework. Stories cover all fifteen public components with the optional theme applied.

```sh
pnpm storybook
pnpm build-storybook
```

The development command uses http://127.0.0.1:6006 with a strict port. The static build writes `storybook-static`, which is ignored by git and excluded from the published library. Stories and configuration participate in static checking and linting.

After reviewing implementation, `pnpm test:storybook` builds a test-only Storybook and runs Select, Textarea, Checkbox, and InputDate Chromium scenarios on temporary preview port 6007. It includes binding fixtures without adding them to the normal Storybook.

## Packaging and publishing

Import components from `delightful-ui`: Button, NumberKeypad, Details, Dialog, Popover, InputText, InputNumber, InputDate, Select, Textarea, Checkbox, TagInput, LoadingSpinner, StatusMessage, and ScreenReaderText.

The root package exports `dist/index.js` and `dist/index.d.ts`. Internal library aliases are rewritten by Svelte's package tooling. Consumers require Svelte 5.57.2 or newer within Svelte 5.

To prepare a local archive after building:

```sh
pnpm pack
```

Publishing requires explicit authorization. Run `pnpm publish` from the repository root when authorized; the package's `files` field includes `dist`. Do not publish the obsolete `package` directory.

Use https://www.conventionalcommits.org/en/v1.0.0/ for PR titles.
