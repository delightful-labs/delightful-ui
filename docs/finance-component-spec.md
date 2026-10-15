# Components informed by Delightful Finance

Finance's integration identified repeated presentation needs. This specification keeps their reusable interfaces independent of Jazz, Zod, XState, routing and currency persistence. Callers supply translated text. Use native semantics, existing theme tokens and gap for spacing between elements. Implement and review one component at a time.

## StatusMessage — reviewed and verified

Expose a public Svelte 5 component with required string `text` and optional `variant`: `info` (default), `loading`, `success` or `error`. Forward native div attributes/events, class and style. Render visible text in all variants, with the existing compact LoadingSpinner only for loading. Use status semantics for info/loading/success and alert semantics for errors; allow an explicit native role override. The spinner is decorative, with no second announcement. LoadingSpinner renders hidden text only when supplied a nonempty text prop; omit it in this composition. Do not add state management, translations, retry actions, icons, timers or dismissal.

Use a flex row and configurable gap. Text wraps within the available width; the spinner retains its size. Error color uses the shared theme token. Native hidden behavior must be preserved. Reuse LoadingSpinner's reduced-motion behavior. Document announcement limitations of initially mounted live regions and recommend updating a mounted component for status changes.

Storybook covers each variant, constrained-width wrapping and an explicit role override. After implementation review, verify SSR text/roles/export/native attributes, one exposed live region, transitions while mounted, hidden state and reduced motion. Package validation, Storybook build, changed-file formatting and ESLint pass. Full static checking now passes with zero errors and warnings after correcting the existing Popover test annotations and nullable geometry checks. After approval, all seven focused unit checks and three Chromium scenarios pass, including mounted state transitions, focus retention, hidden state, narrow wrapping, reduced motion and omitted spinner text.

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

## Navigation — reviewed and verified

Provide a small labelled native nav landmark with a native list and an orientation prop: vertical by default or horizontal with wrapping. Require a caller-translated label and accept caller-provided li/link children; forward native nav attributes/events, class and style. Use gap between links, reset list margins/padding and provide minimum link height/focus treatment through existing tokens. Emphasize links with caller-owned aria-current="page" through font weight. Style native popovertarget buttons like the surrounding underlined links; callers supply decorative disclosure markers and synchronize expanded state. Use the existing Popover for top-layer rendering, dismissal and supported CSS anchor positioning.

Keep routing, active-route matching, permissions, workspace/filter state and responsive shell behavior application-owned. Do not introduce menu roles, custom keyboard navigation, route interception, generated links or data schemas. Multiple navigation landmarks need distinct labels. Native links preserve Enter activation, browser history and modified clicks.

Storybook covers Finance-style sidebar links, horizontal links, horizontal wrapping, a Popover dropdown with a Clipper-style borderless underlined trigger, native links and selection dismissal, multiple labelled groups and wrapping labels. After review, two unit tests and five Chromium scenarios pass for landmark/list/link semantics, native attributes, current-page state, vertical/horizontal layouts, wrapping, Tab/Shift+Tab/Enter/Space, focus visibility and return, expanded state, nonmodal access, link selection and outside-click/Escape dismissal. Five existing Popover scenarios also pass for dismissal, multiple invokers, anchored geometry, scroll/resize, flip placement and centered fallback. AppShell adoption requires a separate consumer change and package refresh; no new application shell or mobile workflow is included.

### Accessibility verification limits

Treat the dropdown as disclosure navigation with ordinary lists and links, not an ARIA menu. See the [W3C disclosure-navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) and [HTML popover guidance](https://html.spec.whatwg.org/multipage/popover.html). These browser checks cover Chromium behavior; Firefox/WebKit runs and manual VoiceOver/Safari and NVDA checks remain outstanding. Passing browser tests does not establish screen-reader compatibility or a full accessibility audit.

## Drawer — implemented and tested

Provide overlay (default) and inline modes with optional open binding, required translated heading/close label and left/right placement. Forward native attributes/events to the active container. Close on mode changes rather than preserving an open modal's focus state in a different interaction context.

### Overlay accessibility and behavior

Compose native Dialog: initial focus within the dialog, focus containment, background inertness, Escape and native focus restoration. Use closedby=any for supported backdrop dismissal and keep an explicit close button. Render the labelled full-height side panel in the top layer, with viewport bounds and scrollable long content. Route/link selection dismissal remains application-owned. Follow [W3C's modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Inline accessibility and behavior

Render a labelled aside in normal flex/grid layout, reserving width alongside sibling page content. Do not apply a dialog/modal role, backdrop, background inertness or focus trap. Opening preserves toggle focus; Tab follows DOM order through the sidebar and content. The application supplies aria-controls/aria-expanded on its toggle. Optional triggerId supplies an explicit return target; otherwise capture the element focused on opening. Restore focus before hiding when closing while focus is within the sidebar; preserve external focus when it is already elsewhere. Escape is scoped to focus inside the sidebar; outside clicks do not dismiss it. Closing content becomes aria-hidden/inert immediately; its visual panel is hidden after exit animation. Follow [W3C's disclosure-navigation guidance](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).

The parent owns page layout, DOM order, responsive behavior and continued navigation state. Place right-side inline content after the main content in DOM order, without CSS order reversal. Demonstrate stacking at narrow widths; do not force page content into an unusable narrow column. Neither mode uses ARIA menu roles or custom link keyboard navigation.

### Presentation and verification

Use gap-based heading/control and sibling layouts, with internal Dialog padding. Overlay animates slide/fade and inline animates reserved width; both disable motion for reduced-motion preferences. Expose width/gap/duration tokens and reuse Dialog presentation tokens. No routing, swipe gestures or automatic breakpoints.

Storybook covers overlay left/right and inline left/right alongside editable content. Static/compiler/package/Storybook checks support implementation review. Three SSR unit tests and seven Chromium browser cases pass, covering names, opening/closing, focused closure, external closure, hidden descendants, Escape, native modal background focus exclusion versus inline page interaction, mode switching, narrow/long content, reduced motion and geometry. Mode changes close the native dialog before removal so its invoker regains focus. Manual VoiceOver/Safari and NVDA checks remain necessary; Chromium tests cannot establish full assistive-technology compatibility.

## LoadingScreen — implemented, awaiting review

Finance startup needs a single centered loading/error message. Provide required translated text and variant loading/error. Compose StatusMessage so there is a single status/alert message with a decorative spinner. Use a neutral div container, leaving main landmarks to the application. Forward native attributes, class and style. Center content horizontally and vertically with grid, bounded wrapping text, internal edge padding and a default minimum height of 100dvh. Let content grow rather than clip on small viewports. Expose minimum height, padding and content-width tokens for contained usage. Preserve hidden behavior. No focus movement/trapping, modal semantics, timers or application state.

Storybook demonstrates full-screen loading, errors and contained wrapping. Static/package/Storybook checks precede implementation review. After review, cover single-message semantics, single live region, hidden state, centered geometry, narrow/long content and reduced motion in focused tests.

### Drawer presentation refinement — awaiting review

Use one compact × close button, accessibly named by closeLabel, in a fixed-size header column. Wrap visible headings within the remaining column. Optional headingHidden retains the named heading for assistive technology while removing its visible heading row. Finance hides its external toggle while open. Keep the panel inert and aria-hidden immediately on close while retaining its visual presence until its own exit animations finish; cancel pending teardown when reopened. Inline exit preserves the panel's measured width to avoid reflow while the reserved space shrinks. Restore inline focus after caller-hidden triggers are revealed. Reduced-motion preferences remove transitions. Review this refinement before updating Drawer test assertions.

### Drawer height and shell stability — Finance adopted

Both variants default to 100dvh via --dui-drawer-height. Inline placement is sticky at the top of its containing page; overlay placement remains fixed. A constrained two-row grid keeps the close control visible while the body scrolls independently, with min-block-size zero and contained overscroll. Finance uses a persistent optional-sticky TopNavigation in the main content, with the Drawer toggle inside it. Keep the toggle available while open; the Drawer’s inline/overlay behavior and caller-owned `aria-expanded` communicate state. Finance supplies localized screen-reader-only toggle text and Drawer close text rather than hard-coded ARIA labels. The responsive mode choice and page layout remain Finance-owned.
