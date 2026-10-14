# Components informed by Delightful Finance

Finance's integration identified repeated presentation needs. This specification keeps their reusable interfaces independent of Jazz, Zod, XState, routing and currency persistence. Callers supply translated text. Use native semantics, existing theme tokens and gap for spacing between elements. Implement and review one component at a time.

## StatusMessage — reviewed and verified

Expose a public Svelte 5 component with required string `text` and optional `variant`: `info` (default), `loading`, `success` or `error`. Forward native div attributes/events, class and style. Render visible text in all variants, with the existing compact LoadingSpinner only for loading. Use status semantics for info/loading/success and alert semantics for errors; allow an explicit native role override. The spinner is decorative, with no second announcement. LoadingSpinner renders hidden text only when supplied a nonempty text prop; omit it in this composition. Do not add state management, translations, retry actions, icons, timers or dismissal.

Use a flex row and configurable gap. Text wraps within the available width; the spinner retains its size. Error color uses the shared theme token. Native hidden behavior must be preserved. Reuse LoadingSpinner's reduced-motion behavior. Document announcement limitations of initially mounted live regions and recommend updating a mounted component for status changes.

Storybook covers each variant, constrained-width wrapping and an explicit role override. After implementation review, verify SSR text/roles/export/native attributes, one exposed live region, transitions while mounted, hidden state and reduced motion. Package validation, Storybook build, changed-file formatting and ESLint pass. Static checking reports no diagnostics in the new component or story, but the full command fails on five pre-existing typing errors in tests/popover.spec.js. After approval, all seven focused unit checks and three Chromium scenarios pass, including mounted state transitions, focus retention, hidden state, narrow wrapping, reduced motion and omitted spinner text.

Finance adoption is a later consumer change: replace QueryContent's composed spinner/message and suitable aggregate form feedback, preserving its loading/error precedence and caller-owned state. Its bundled package snapshot must be refreshed deliberately; this library change alone does not update Finance.

## FieldFeedback — reviewed and verified

Expose a standalone component with required caller-owned string `id` and optional `instructions` and `errorMessage` strings, aligned with TagInput's terminology. Both messages remain visible when supplied. Forward native div attributes/events, class and style; render no fallback text. Preserve the ID container when messages clear, but hide empty containers from layout. Use field typography, configurable gap and the shared error color; wrap long text without overflow.

Callers connect the ID through native `aria-describedby`, combining it with other description IDs if necessary, and set `aria-invalid` on the control. Keep validation, issue mapping, focus and announcements in the application. Add no automatic live region or change to existing input APIs. Compose with any existing native control or library input. Native role overrides remain caller-owned; avoid duplicate aggregate/field announcements.

Storybook covers instructions, error, both, empty, wrapping and an accessible input/feedback composition. After review, two unit checks and two Chromium scenarios pass for escaped text, both messages, stable IDs, native attributes, accessible descriptions, invalid state updates and empty feedback layout. Finance adoption and automatic input-level help/error props are separate future changes, requiring review before modifying multiple controls.

## Table — reviewed and verified

Finance's account and transaction lists repeat native table structure and need local responsive overflow. A small Table component is useful beyond global styles because it supplies that container and a visible caption. Require a caller-translated caption; name the focusable overflow region from its generated caption ID. Keep native table semantics, header scopes and caller-provided thead/tbody/tfoot markup. Forward native table attributes/events, class and style. Hidden tables must hide their container too.

The approved styling uses a continuous black header with white text, reversed in explicit dark mode, and thin lines between rows. Use collapsed native table borders and configurable internal cell padding; do not replace native table layout with grid. Keep sibling action spacing gap-based. Expose header colors, row-border width/color, cell padding, minimum-width and foreground tokens. Allow native horizontal keyboard scrolling within the focusable region, with visible focus styling. Do not add sorting, selection, pagination, row schemas, striping or sticky headers. Callers own formatting, alignment, row actions, state and permissions.

Storybook covers account rows/actions, transaction amounts with caller-owned alignment and a deliberately wide table in a narrow container. After implementation review, two unit checks and three Chromium scenarios pass for native caption/header/row semantics, attribute forwarding, hidden attributes, light/dark header colors, row separators, local overflow, keyboard scrolling and reachable row actions. Finance adoption requires a deliberate package refresh and separate consumer review.

## InputCurrency — reviewed and verified

First ship decimal-text entry with a caller-supplied currency label beside the input; keypad/device selection remains deferred, consistent with the Finance trial. Require label and currencyLabel strings. Reuse InputWrapper styling with gap-based entry layout. Use a native text input with decimal input mode and autocomplete off by default; accept native text constraints/callbacks and optional string value binding/defaults. Generate a unique currency description ID and combine it with caller-provided aria-describedby IDs.

Preserve raw drafts, including partial or comma-decimal text, native FormData and reset behavior. Submit only the amount text; callers explicitly submit currency separately when needed. Do not add a default pattern, locale/currency parsing, rounding, decimal precision, sign policy, min/max numeric enforcement or money conversion. Finance continues to own its non-negative USD pattern and integer-minor-unit parser. Existing NumberKeypad integration and caret/focus workflow need a separate consumer specification.

Storybook covers initial drafts, disabled/read-only fields, comma-decimal text, native form submission/reset and feedback composition. After review, two unit checks and three Chromium scenarios pass for combined currency/help descriptions, raw string defaults/drafts, native submission/reset, required-field behavior, comma decimals and disabled/read-only state. Optional parent binding and additional caller patterns remain candidates for consumer-specific coverage. No Finance package refresh or consumer changes are included in this library iteration.

## Navigation — implemented, awaiting review

Provide a small labelled native nav landmark with a vertical native list. Require a caller-translated label and accept caller-provided li/link children; forward native nav attributes/events, class and style. Use gap between links, reset list margins/padding and provide minimum link height/focus treatment through existing tokens. Emphasize links with caller-owned aria-current="page" through font weight.

Keep routing, active-route matching, permissions, workspace/filter state and responsive shell behavior application-owned. Do not introduce menu roles, custom keyboard navigation, route interception, generated links or data schemas. Multiple navigation landmarks need distinct labels. Native links preserve Enter activation, browser history and modified clicks.

Storybook covers Finance-style sidebar links, multiple labelled groups and wrapping labels. After review, verify landmark/list/link semantics, current-page attributes, native attribute forwarding, Tab/Enter behavior, focus visibility and narrow layouts. AppShell adoption requires a separate consumer change and package refresh; no new application shell or mobile workflow is included.
