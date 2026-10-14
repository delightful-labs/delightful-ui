<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes, HTMLDialogAttributes } from 'svelte/elements'
	import Dialog from './Dialog.svelte'
	import Button from './Button.svelte'

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		heading: string | Snippet
		headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
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

	function restoreInlineFocus() {
		if (!inlinePanel?.contains(document.activeElement)) return
		const trigger = triggerId
			? document.getElementById(triggerId)
			: inlineInvoker
		if (trigger?.isConnected) trigger.focus()
	}

	// Restore focus before hidden/inert removes a focused descendant.
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
		if (!open && inlineWasOpen) restoreInlineFocus()
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
	>
		<div class="drawer-close">
			<Button type="button" appearance="flat" onclick={() => (open = false)}
				>{closeLabel}</Button
			>
		</div>
		<div class="drawer-body">{@render children?.()}</div>
	</Dialog>
{:else}
	<aside
		{...attributes}
		bind:this={inlinePanel}
		class={['inline-drawer', className]}
		hidden={!open}
		inert={!open}
		aria-labelledby={inlineHeadingId}
		data-side={side}
	>
		<div class="inline-panel">
			<svelte:element
				this={headingLevel}
				id={inlineHeadingId}
				class="inline-heading"
			>
				{#if typeof heading === 'string'}{heading}{:else}{@render heading()}{/if}
			</svelte:element>
			<div class="drawer-close">
				<Button type="button" appearance="flat" onclick={() => (open = false)}
					>{closeLabel}</Button
				>
			</div>
			<div class="drawer-body">{@render children?.()}</div>
		</div>
	</aside>
{/if}

<style>
	.inline-drawer {
		flex: none;
		inline-size: min(var(--dui-drawer-width, 24rem), 100%);
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow: clip;
		transition:
			inline-size var(--dui-drawer-duration, 200ms) ease,
			display var(--dui-drawer-duration, 200ms) allow-discrete;
	}

	.inline-drawer[hidden] {
		display: none;
		inline-size: 0;
	}

	.inline-panel {
		box-sizing: border-box;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
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

	.inline-heading {
		grid-column: 1;
		grid-row: 1;
		align-self: center;
		margin: 0;
		font-size: var(--dui-dialog-heading-font-size, 1.25rem);
		line-height: 1.25;
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
		block-size: 100dvh;
		max-block-size: 100dvh;
		grid-template-columns: minmax(0, 1fr) auto;
		align-content: start;
		gap: var(--dui-drawer-gap, var(--dui-space-sm, 1rem));
		transform: translateX(var(--_dui-drawer-offset));
		transition:
			transform var(--dui-drawer-duration, 200ms) ease,
			display var(--dui-drawer-duration, 200ms) allow-discrete,
			overlay var(--dui-drawer-duration, 200ms) allow-discrete;
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
	}

	.drawer-close {
		grid-column: 2;
		grid-row: 1;
	}

	.drawer-body {
		grid-column: 1 / -1;
		min-inline-size: 0;
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
