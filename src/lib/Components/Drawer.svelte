<script lang="ts">
	import { tick, untrack, type Snippet } from 'svelte'
	import type { HTMLAttributes, HTMLDialogAttributes } from 'svelte/elements'
	import Dialog from './Dialog.svelte'
	import Button from './Button.svelte'

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		heading: string | Snippet
		headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
		headingHidden?: boolean
		closeLabel: string
		side?: 'left' | 'right'
		mode?: 'overlay' | 'inline'
		triggerId?: string
		open?: boolean
		closedby?: HTMLDialogAttributes['closedby']
		children?: Snippet
	}

	const generatedId = $props.id()
	const inlineHeadingId = `${generatedId}-heading`
	let inlinePanel = $state<HTMLElement>()
	let inlineWasOpen = false
	let previousMode: 'overlay' | 'inline' | undefined
	let inlineInvoker: HTMLElement | undefined

	let {
		heading,
		headingLevel = 'h2',
		headingHidden = false,
		mode = 'overlay',
		triggerId,
		closeLabel,
		side = 'left',
		open = $bindable(false),
		closedby = 'any',
		children,
		class: className,
		...attributes
	}: Props = $props()

	let present = $state(untrack(() => open))

	function restoreInlineFocus() {
		if (!inlinePanel?.contains(document.activeElement)) return
		const trigger = triggerId
			? document.getElementById(triggerId)
			: inlineInvoker
		if (trigger?.isConnected) {
			// The caller may reveal its trigger only after the open binding changes.
			void tick().then(() => {
				if (!open && trigger.isConnected) trigger.focus()
			})
		}
	}

	$effect.pre(() => {
		if (open) present = true
	})

	// Retain the inert visual panel until its exit motion finishes. This also
	// works where discrete display transitions are unavailable.
	$effect(() => {
		if (open || !present) return
		const panel =
			mode === 'inline'
				? inlinePanel
				: document.getElementById(attributes.id ?? generatedId)
		if (!panel) return
		let cancelled = false
		const frame = requestAnimationFrame(() => {
			const animations = panel.getAnimations()
			void Promise.allSettled(
				animations.map((animation) => animation.finished)
			).then(() => {
				if (!cancelled) present = false
			})
		})
		return () => {
			cancelled = true
			cancelAnimationFrame(frame)
		}
	})

	// Restore focus when closing a focused sidebar.
	$effect.pre(() => {
		if (previousMode !== undefined && previousMode !== mode) {
			restoreInlineFocus()
			if (previousMode === 'overlay') {
				const dialog = document.getElementById(attributes.id ?? generatedId)
				if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close()
			}
			open = false
		}
		previousMode = mode
		if (mode !== 'inline') {
			inlineWasOpen = false
			return
		}
		if (open && !inlineWasOpen) {
			const active = document.activeElement
			inlineInvoker = active instanceof HTMLElement ? active : undefined
		}
		if (!open && inlineWasOpen) {
			if (inlinePanel) {
				inlinePanel.style.setProperty(
					'--_dui-drawer-panel-width',
					`${inlinePanel.getBoundingClientRect().width}px`
				)
			}
			restoreInlineFocus()
		}
		inlineWasOpen = open
	})

	$effect(() => {
		if (mode !== 'inline' || !open || !inlinePanel) return
		const panel = inlinePanel
		function dismiss(event: KeyboardEvent) {
			if (
				event.key === 'Escape' &&
				!event.defaultPrevented &&
				panel.contains(document.activeElement)
			) {
				open = false
			}
		}
		document.addEventListener('keydown', dismiss)
		return () => document.removeEventListener('keydown', dismiss)
	})
</script>

{#if mode === 'overlay'}
	<Dialog
		{...attributes}
		id={attributes.id ?? generatedId}
		{heading}
		{headingLevel}
		{closedby}
		bind:open
		class={['dui-drawer', className]}
		data-side={side}
		data-present={present}
		data-heading-hidden={headingHidden}
		inert={!open}
		aria-hidden={!open}
	>
		<div class="drawer-close">
			<Button
				type="button"
				appearance="flat"
				aria-label={closeLabel}
				onclick={() => (open = false)}><span aria-hidden="true">×</span></Button
			>
		</div>
		<div class="drawer-body">{@render children?.()}</div>
	</Dialog>
{:else}
	<aside
		{...attributes}
		bind:this={inlinePanel}
		class={['inline-drawer', className]}
		hidden={!present}
		inert={!open}
		aria-labelledby={inlineHeadingId}
		data-side={side}
		data-open={open}
		aria-hidden={!open}
	>
		<div class="inline-panel">
			<svelte:element
				this={headingLevel}
				id={inlineHeadingId}
				class={['inline-heading', { 'heading-hidden': headingHidden }]}
			>
				{#if typeof heading === 'string'}{heading}{:else}{@render heading()}{/if}
			</svelte:element>
			<div class="drawer-close">
				<Button
					type="button"
					appearance="flat"
					aria-label={closeLabel}
					onclick={() => (open = false)}
					><span aria-hidden="true">×</span></Button
				>
			</div>
			<div class="drawer-body">{@render children?.()}</div>
		</div>
	</aside>
{/if}

<style>
	.inline-drawer {
		position: sticky;
		inset-block-start: 0;
		block-size: var(--dui-drawer-height, 100dvh);
		flex: none;
		inline-size: min(var(--dui-drawer-width, 24rem), 100%);
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow: clip;
		transition: inline-size var(--dui-drawer-duration, 200ms) ease;
	}

	.inline-drawer[data-open='false'] {
		inline-size: 0;
	}

	.inline-drawer[hidden] {
		display: none;
	}

	.inline-panel {
		box-sizing: border-box;
		block-size: 100%;
		min-block-size: 0;
		overflow: hidden;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 2.75rem;
		grid-template-rows: auto minmax(0, 1fr);
		align-content: start;
		gap: var(--dui-drawer-gap, var(--dui-space-sm, 1rem));
		padding: var(--dui-dialog-padding, var(--dui-space-md, 1.5rem));
		color: var(--dui-dialog-color, var(--dui-color-foreground, inherit));
		background-color: var(
			--dui-dialog-background-color,
			var(--dui-color-background, transparent)
		);
		border: var(--dui-dialog-border-width, var(--dui-border-width, 2px)) solid
			var(--dui-dialog-border-color, var(--dui-color-foreground, currentColor));
	}

	.inline-drawer[data-open='false'] > .inline-panel {
		inline-size: var(--_dui-drawer-panel-width, var(--dui-drawer-width, 24rem));
	}

	.inline-heading {
		grid-column: 1;
		grid-row: 1;
		align-self: center;
		margin: 0;
		font-size: var(--dui-dialog-heading-font-size, 1.25rem);
		line-height: 1.25;
		overflow-wrap: anywhere;
	}

	:global(dialog.dui-drawer[data-side]) {
		--_dui-drawer-offset: -100%;
		position: fixed;
		inset-block: 0;
		left: 0;
		right: auto;
		margin: 0;
		inline-size: var(--dui-drawer-width, 24rem);
		max-inline-size: calc(100dvw - 2rem);
		block-size: var(--dui-drawer-height, 100dvh);
		max-block-size: 100dvh;
		overflow: hidden;
		grid-template-columns: minmax(0, 1fr) 2.75rem;
		grid-template-rows: auto minmax(0, 1fr);
		align-content: start;
		gap: var(--dui-drawer-gap, var(--dui-space-sm, 1rem));
		transform: translateX(var(--_dui-drawer-offset));
		transition:
			transform var(--dui-drawer-duration, 200ms) ease,
			display var(--dui-drawer-duration, 200ms) allow-discrete,
			overlay var(--dui-drawer-duration, 200ms) allow-discrete;
	}

	:global(dialog.dui-drawer[data-side][data-present='true']) {
		display: grid;
	}

	:global(dialog.dui-drawer[data-side]:not([open])) {
		z-index: 1000;
	}

	:global(dialog.dui-drawer[data-side='right']) {
		--_dui-drawer-offset: 100%;
		left: auto;
		right: 0;
	}

	:global(dialog.dui-drawer[data-side][open]) {
		display: grid;
		transform: translateX(0);
	}

	:global(dialog.dui-drawer[data-side] > .heading) {
		grid-column: 1;
		grid-row: 1;
		align-self: center;
		margin: 0;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.heading-hidden,
	:global(dialog.dui-drawer[data-heading-hidden='true'] > .heading) {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.drawer-close :global(button) {
		--dui-button-padding: 0;
		--dui-button-border-width: 0;
		inline-size: 2.75rem;
		block-size: 2.75rem;
		font-size: 1.5rem;
	}

	.drawer-close {
		grid-column: 2;
		grid-row: 1;
	}

	.drawer-body {
		grid-column: 1 / -1;
		grid-row: 2;
		min-inline-size: 0;
		min-block-size: 0;
		overflow: auto;
		overscroll-behavior: contain;
	}

	:global(dialog.dui-drawer[data-side]::backdrop) {
		opacity: 0;
		transition:
			opacity var(--dui-drawer-duration, 200ms) ease,
			display var(--dui-drawer-duration, 200ms) allow-discrete,
			overlay var(--dui-drawer-duration, 200ms) allow-discrete;
	}

	:global(dialog.dui-drawer[data-side][open]::backdrop) {
		opacity: var(--dui-dialog-backdrop-opacity, 0.5);
	}

	@starting-style {
		.inline-drawer:not([hidden]) {
			inline-size: 0;
		}
		:global(dialog.dui-drawer[data-side][open]) {
			transform: translateX(var(--_dui-drawer-offset));
		}
		:global(dialog.dui-drawer[data-side][open]::backdrop) {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.inline-drawer,
		:global(dialog.dui-drawer[data-side]),
		:global(dialog.dui-drawer[data-side]::backdrop) {
			transition: none;
		}
	}
</style>
