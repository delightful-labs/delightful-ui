<script lang="ts">
	import Button from '../Button.svelte'
	import Icon from '../Icon.svelte'
	import LoadingSpinner from '../LoadingSpinner.svelte'
	import AvatarTile from './AvatarTile.svelte'
	let {
		name,
		preview,
		previewFailed = false,
		state,
		shape = 'square',
		disabled = false,
		removeLabel,
		onremove,
		onpreviewerror
	}: {
		name: string
		preview?: string
		previewFailed?: boolean
		state?: { status: 'ready' | 'uploading' | 'error'; label?: string }
		shape?: 'square' | 'circle'
		disabled?: boolean | null
		removeLabel: string
		onremove: () => void
		onpreviewerror: () => void
	} = $props()
</script>

<div class="item">
	<AvatarTile {shape} status={state?.status}>
		{#if state?.status === 'uploading'}
			<LoadingSpinner text={state.label ?? name} />
		{:else if state?.status === 'error' || previewFailed}
			<Icon width="24" height="24"
				><path d="M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5" /></Icon
			>
			<span role="alert">{state?.label ?? name}</span>
		{:else if preview}
			<img src={preview} alt={name} onerror={onpreviewerror} />
		{/if}
	</AvatarTile>
	<Button
		type="button"
		appearance="flat"
		{disabled}
		aria-label={`${removeLabel}: ${name}`}
		onclick={onremove}>{removeLabel}</Button
	>
</div>

<style>
	.item {
		display: grid;
		gap: var(--dui-avatar-gap, var(--dui-spacing-xs, 0.5rem));
		width: var(--dui-avatar-size, 8rem);
		max-width: 100%;
	}
	.item :global(button) {
		min-width: min(var(--dui-avatar-size, 8rem), 100%);
		max-width: 100%;
		white-space: normal;
		overflow-wrap: anywhere;
	}
	span {
		max-width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
