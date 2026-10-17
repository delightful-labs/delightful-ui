<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import StatusMessage from './StatusMessage.svelte'

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		text: string
		variant?: 'loading' | 'error'
	}

	let {
		text,
		variant = 'loading',
		class: className,
		...attributes
	}: Props = $props()
</script>

<div {...attributes} class={['loading-screen', className]}>
	<div class="content">
		<StatusMessage {variant} {text} />
	</div>
</div>

<style>
	.loading-screen {
		box-sizing: border-box;
		display: grid;
		place-items: center;
		min-block-size: var(--dui-loading-screen-min-height, 100dvh);
		padding: var(
			--dui-loading-screen-padding,
			var(--dui-space-md, var(--dui-spacing-lg, 1.5rem))
		);
		text-align: center;
	}

	.loading-screen[hidden]:not([hidden='until-found']) {
		display: none;
	}

	.content {
		display: grid;
		justify-items: center;
		min-inline-size: 0;
		max-inline-size: var(--dui-loading-screen-content-width, 40rem);
		overflow-wrap: anywhere;
	}
</style>
