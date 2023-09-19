<script>
	import clickOutside from '$lib/utils/clickOutside'

	export let title = ''
	export let opened = false
	export let positionAbsolutely = false
</script>

<details
	bind:open={opened}
	use:clickOutside
	on:clickoutside={() => (opened = false)}
>
	<summary>{title}</summary>
	<div class="details-content {positionAbsolutely && 'absolute'}">
		<slot />
	</div>
</details>

<style>
	.details-content {
		background-color: var(--color__background);
		padding: 1rem;
	}

	.absolute {
		position: absolute;
		width: 100vw;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
		z-index: 1;
	}
</style>
