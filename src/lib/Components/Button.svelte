<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'

	type Props = HTMLButtonAttributes & {
		text?: string
	}

	let {
		text = $bindable(''),
		type = $bindable('button'),
		disabled = $bindable(undefined),
		popovertarget = $bindable(undefined),
		class: className,
		onclick,
		children,
		...attributes
	}: Props = $props()
</script>

<button
	{...attributes}
	{type}
	{disabled}
	{popovertarget}
	class={['button', className]}
	{onclick}
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</button>

<style>
	.button {
		-webkit-appearance: none;
		appearance: none;
		box-sizing: border-box;
		font-family: var(
			--dui-button-font-family,
			var(--dui-font-family, 'Source Code Pro', monospace)
		);
		font-size: var(--dui-button-font-size, inherit);
		line-height: 1.25;
		padding: var(--dui-button-padding, 0.5rem 1rem);
		min-height: var(--dui-button-min-height, 44px);
		color: var(--dui-button-color, var(--dui-color-foreground, #000));
		background-color: var(
			--dui-button-background-color,
			var(--dui-color-background, #fff)
		);
		border-color: var(
			--dui-button-border-color,
			var(--dui-color-foreground, #000)
		);
		border-style: var(--dui-button-border-style, solid);
		border-width: var(--dui-button-border-width, var(--dui-border-width, 2px));
		border-radius: 0;
		box-shadow: var(
			--dui-button-box-shadow,
			var(--dui-shadow, 3px 3px 0 var(--dui-color-foreground, #000))
		);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s,
			transform 0.1s,
			box-shadow 0.1s;
	}

	.button:hover:not(:disabled) {
		color: var(--dui-button-color-hover, var(--dui-color-background, #fff));
		background-color: var(
			--dui-button-background-color-hover,
			var(--dui-color-foreground, #000)
		);
		border-color: var(
			--dui-button-border-color-hover,
			var(--dui-color-foreground, #000)
		);
	}

	.button:active:not(:disabled) {
		box-shadow: none;
		transform: translate(
			var(--dui-button-pressed-offset, var(--dui-pressed-offset, 3px)),
			var(--dui-button-pressed-offset, var(--dui-pressed-offset, 3px))
		);
	}

	.button:focus-visible {
		outline: 2px solid
			var(--dui-button-focus-color, var(--dui-color-focus, #2563eb));
		outline-offset: 4px;
	}

	.button:disabled {
		opacity: var(--dui-button-disabled-opacity, 0.5);
		cursor: not-allowed;
	}

	@media (prefers-reduced-motion: reduce) {
		.button {
			transition: none;
		}

		.button:active:not(:disabled) {
			transform: none;
		}
	}

	@media (forced-colors: active) {
		.button {
			box-shadow: none;
		}

		.button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
