# Components informed by Delightful Finance

Finance's integration identified repeated presentation needs. This specification keeps their reusable interfaces independent of Jazz, Zod, XState, routing and currency persistence. Callers supply translated text. Use native semantics, existing theme tokens and gap for spacing between elements. Implement and review one component at a time.

## StatusMessage — implemented, awaiting review

Expose a public Svelte 5 component with required string `text` and optional `variant`: `info` (default), `loading`, `success` or `error`. Forward native div attributes/events, class and style. Render visible text in all variants, with the existing compact LoadingSpinner only for loading. Use status semantics for info/loading/success and alert semantics for errors; allow an explicit native role override. The spinner is decorative, with no second announcement. LoadingSpinner renders hidden text only when supplied a nonempty text prop; omit it in this composition. Do not add state management, translations, retry actions, icons, timers or dismissal.

Use a flex row and configurable gap. Text wraps within the available width; the spinner retains its size. Error color uses the shared theme token. Native hidden behavior must be preserved. Reuse LoadingSpinner's reduced-motion behavior. Document announcement limitations of initially mounted live regions and recommend updating a mounted component for status changes.

Storybook covers each variant, constrained-width wrapping and an explicit role override. After implementation review, verify SSR text/roles/export/native attributes, one exposed live region, transitions while mounted, hidden state and reduced motion. Package validation, Storybook build, changed-file formatting and ESLint pass. Static checking reports no diagnostics in the new component or story, but the full command fails on five pre-existing typing errors in tests/popover.spec.js. Runtime tests follow implementation approval.

Finance adoption is a later consumer change: replace QueryContent's composed spinner/message and suitable aggregate form feedback, preserving its loading/error precedence and caller-owned state. Its bundled package snapshot must be refreshed deliberately; this library change alone does not update Finance.

## Field feedback — proposed next

Provide consistent visible help/error descriptions linked to native fields and invalid states across text, number, date, select and textarea controls. Align with TagInput's existing help/error behavior. Finance maps its own validation issues; the library must not require a validator or form machine. Decide the shared field API before changing existing controls.

## Table presentation — proposed

Style semantic native tables with responsive overflow and optional captions/header/row-action presentation. Keep queries, sorting state, currency formatting, row identity and permissions caller-owned. Determine whether shared CSS tokens suffice before introducing a DataTable component.

## Currency entry — proposed

Compose decimal-text entry, currency presentation and optional existing NumberKeypad. Keep draft editing, device/custom keyboard choice, focus/caret management and integer-money conversion application-owned. Preserve native FormData and reset behavior; do not substitute floating-point InputNumber values for money drafts. Specify the consumer workflow before adding an API.

## Navigation/layout — proposed

Consider primitives or tokens for native navigation links, selected-link presentation, shell spacing and filter grouping. Keep routing, workspace state and permissions application-owned. Use the existing responsive Finance shell as evidence rather than introducing a new visual direction.
