<script>
	/**
	 * @type {string}
	 */
	export let title

	/**
	 * @type {boolean}
	 */
	export let required = false

	/**
	 * @type {string}
	 */
	export let key
</script>

<div class="wrapper">
	<label for={key}>{title}{required ? ' (required)' : ''}</label>
	<slot />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.wrapper :global(input) {
		font-family: var(--input-font-family, inherit);
		font-size: var(--input-font-size, inherit);
		box-sizing: border-box;
		padding: var(--input-padding, 1rem);
		color: var(--input-color, inherit);
		min-height: var(--input-min-height, 48px);
		border-color: var(--input-border-color, currentColor);
		border-style: var(--input-border-style, solid);
		border-width: var(--input-border-width, 1px);
		background-color: var(--input-background-color, transparent);
	}

	.wrapper :global(input[size]) {
		align-self: start;
	}

	.wrapper :global(input[data-valid='false']) {
		--input-border-color: red;
	}
</style>
