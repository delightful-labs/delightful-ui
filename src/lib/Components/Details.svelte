<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLDetailsAttributes } from 'svelte/elements'

	type Props = Omit<HTMLDetailsAttributes, 'open'> & {
		summary: string | Snippet
		open?: boolean
		position?: 'inline' | 'absolute'
		align?: 'start' | 'end'
	}

	let {
		summary,
		open = $bindable(false),
		position = 'inline',
		align = 'start',
		onkeydown,
		children,
		...attributes
	}: Props = $props()
	let disclosure = $state<HTMLDetailsElement>()
	let summaryElement = $state<HTMLElement>()

	$effect(() => {
		if (position !== 'absolute' || !open || !disclosure) return

		const element = disclosure
		const controller = new AbortController()
		document.addEventListener(
			'pointerdown',
			(event) => {
				if (!event.composedPath().includes(element)) open = false
			},
			{ capture: true, signal: controller.signal }
		)
		return () => controller.abort()
	})
</script>

<details
	{...attributes}
	data-position={position}
	data-align={align}
	bind:this={disclosure}
	bind:open
	onkeydown={(event) => {
		onkeydown?.(event)
		if (
			position === 'absolute' &&
			open &&
			event.key === 'Escape' &&
			!event.defaultPrevented
		) {
			event.preventDefault()
			open = false
			summaryElement?.focus()
		}
	}}
>
	<summary bind:this={summaryElement}>
		{#if typeof summary === 'string'}
			{summary}
		{:else}
			{@render summary()}
		{/if}
	</summary>
	<div class="details-content">
		{@render children?.()}
	</div>
</details>

<style>
	details {
		box-sizing: border-box;
		min-width: 0;
		color: var(--dui-details-color, var(--dui-color-foreground, inherit));
		background-color: var(
			--dui-details-background-color,
			var(--dui-color-background, transparent)
		);
		border-color: var(
			--dui-details-border-color,
			var(--dui-color-foreground, currentColor)
		);
		border-style: solid;
		border-width: var(--dui-details-border-width, var(--dui-border-width, 2px));
		border-radius: 0;
	}

	summary {
		box-sizing: border-box;
		min-height: var(--dui-details-summary-min-height, 44px);
		padding: var(--dui-details-summary-padding, 0.5rem 1rem);
		font-family: var(
			--dui-details-summary-font-family,
			var(--dui-font-family, inherit)
		);
		font-size: var(--dui-details-summary-font-size, inherit);
		list-style-position: inside;
		cursor: pointer;
	}

	summary:hover {
		color: var(
			--dui-details-summary-color-hover,
			var(--dui-color-on-accent, #262626)
		);
		background-color: var(
			--dui-details-summary-background-color-hover,
			var(--dui-color-accent, #94ff47)
		);
	}

	summary:focus-visible {
		outline: 2px solid
			var(--dui-details-focus-color, var(--dui-color-focus, currentColor));
		outline-offset: 4px;
	}

	.details-content {
		padding: var(--dui-details-content-padding, var(--dui-space-sm, 1rem));
		border-top: var(--dui-details-content-border-width, 1px) solid;
		border-color: var(
			--dui-details-border-color,
			var(--dui-color-foreground, currentColor)
		);
	}

	details[data-position='absolute'] {
		position: relative;
		display: inline-block;
		max-inline-size: 100%;
		vertical-align: top;
	}

	details[data-position='absolute'] .details-content {
		position: absolute;
		inset-block-start: calc(100% + var(--dui-details-panel-offset, 0.25rem));
		inset-inline-start: 0;
		z-index: var(--dui-details-panel-z-index, 10);
		box-sizing: border-box;
		inline-size: var(--dui-details-panel-width, max-content);
		max-inline-size: var(
			--dui-details-panel-max-width,
			min(24rem, calc(100vw - 2rem))
		);
		max-block-size: var(--dui-details-panel-max-height, 70vh);
		overflow: auto;
		background-color: var(
			--dui-details-background-color,
			var(--dui-color-background, #fff)
		);
		border: var(--dui-details-border-width, var(--dui-border-width, 2px)) solid;
		border-color: var(
			--dui-details-border-color,
			var(--dui-color-foreground, currentColor)
		);
		box-shadow: var(
			--dui-details-panel-shadow,
			var(--dui-shadow, 3px 3px 0 currentColor)
		);
	}

	details[data-position='absolute'][data-align='end'] .details-content {
		inset-inline-start: auto;
		inset-inline-end: 0;
	}

	@media (forced-colors: active) {
		details[data-position='absolute'] .details-content {
			box-shadow: none;
		}

		summary:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
