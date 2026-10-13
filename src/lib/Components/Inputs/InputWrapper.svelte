<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		title: string
		key: string
		children: Snippet
	}

	let { title, key, children }: Props = $props()
</script>

<div class="wrapper">
	<label for={key}>{title}</label>
	{@render children()}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--dui-field-gap, 0.25rem);
		min-width: 0;
	}

	label {
		font-family: var(--dui-field-font-family, var(--dui-font-family, inherit));
		font-size: var(--dui-field-font-size, inherit);
		color: var(--dui-field-color, var(--dui-color-foreground, inherit));
	}

	.wrapper :global(:is(input, select, textarea)) {
		font-family: var(--dui-input-font-family, var(--dui-font-family, inherit));
		font-size: var(--dui-input-font-size, inherit);
		line-height: 1.25;
		box-sizing: border-box;
		padding: var(--dui-input-padding, 0.5rem 1rem);
		color: var(--dui-input-color, var(--dui-color-foreground, inherit));
		min-height: var(--dui-input-min-height, 44px);
		min-width: 0;
		border-color: var(
			--dui-input-border-color,
			var(--dui-color-foreground, currentColor)
		);
		border-style: var(--dui-input-border-style, solid);
		border-width: var(--dui-input-border-width, var(--dui-border-width, 2px));
		border-radius: 0;
		background-color: var(
			--dui-input-background-color,
			var(--dui-color-background, transparent)
		);
	}

	.wrapper :global(:is(input, select)[size]) {
		align-self: start;
		max-width: 100%;
	}

	.wrapper
		:global(
			:is(input, select, textarea):hover:not(:disabled):not([readonly]):not(
					[data-valid='false']
				):not([aria-invalid='true']):not(:user-invalid)
		) {
		border-color: var(
			--dui-input-border-color-hover,
			var(--dui-color-accent, currentColor)
		);
	}

	.wrapper :global(:is(input, select, textarea):focus-visible) {
		outline: 2px solid
			var(--dui-input-focus-color, var(--dui-color-focus, currentColor));
		outline-offset: 4px;
	}

	.wrapper :global(:is(input, select, textarea)[data-valid='false']),
	.wrapper :global(:is(input, select, textarea)[aria-invalid='true']),
	.wrapper :global(:is(input, select, textarea):user-invalid) {
		border-color: var(--dui-input-error-color, var(--dui-color-error, #b91c1c));
	}

	.wrapper :global(:is(input, select, textarea):disabled) {
		opacity: var(--dui-input-disabled-opacity, 0.5);
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		.wrapper :global(:is(input, select, textarea):focus-visible) {
			outline-color: Highlight;
		}
	}
</style>
