<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import LoadingSpinner from './LoadingSpinner.svelte'

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		text: string
		variant?: 'info' | 'loading' | 'success' | 'error'
	}

	let {
		text,
		variant = 'info',
		role,
		class: className,
		...attributes
	}: Props = $props()
</script>

<div
	{...attributes}
	role={role ?? (variant === 'error' ? 'alert' : 'status')}
	class={['status-message', className, { error: variant === 'error' }]}
>
	{#if variant === 'loading'}
		<div class="spinner" aria-hidden="true">
			<LoadingSpinner role="presentation" />
		</div>
	{/if}
	<span class="message">{text}</span>
</div>

<style>
	.status-message {
		display: flex;
		align-items: center;
		gap: var(--dui-status-message-gap, var(--dui-space-xs, 0.5rem));
		color: var(
			--dui-status-message-color,
			var(--dui-color-foreground, inherit)
		);
	}

	.status-message[hidden]:not([hidden='until-found']) {
		display: none;
	}

	.error {
		color: var(
			--dui-status-message-error-color,
			var(--dui-color-error, #b91c1c)
		);
	}

	.spinner {
		flex: none;
		--dui-loading-spinner-size: var(--dui-status-message-spinner-size, 1.5rem);
		--dui-loading-spinner-border-width: var(
			--dui-status-message-spinner-border-width,
			2px
		);
	}

	.message {
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}
</style>
