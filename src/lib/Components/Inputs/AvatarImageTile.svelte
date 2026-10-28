<script lang="ts">
	import type { Snippet } from 'svelte'
	import Button from '../Button.svelte'
	import Popover from '../Popover.svelte'
	import Icon from '../Icon.svelte'
	import LoadingSpinner from '../LoadingSpinner.svelte'
	import AvatarTile from './AvatarTile.svelte'
	let {
		name,
		actions,
		preview,
		downloadUrl,
		alt = name,
		removeAccessibleLabel,
		previewFailed = false,
		state,
		shape = 'square',
		disabled = false,
		removeLabel,
		infoLabel = 'File information',
		onremove,
		onpreviewerror
	}: {
		actions?: Snippet<[string]>
		name: string
		downloadUrl?: string
		alt?: string
		removeAccessibleLabel?: string
		preview?: string
		previewFailed?: boolean
		state?: { status: 'ready' | 'uploading' | 'error'; label?: string }
		shape?: 'square' | 'circle'
		disabled?: boolean | null
		infoLabel?: string
		removeLabel: string
		onremove?: (() => void) | undefined
		onpreviewerror?: (url: string) => void
	} = $props()
	const informationId = $props.id()
</script>

{#snippet thumbnail()}
	{#key preview}
		<img
			src={preview}
			{alt}
			onerror={(event) => {
				if (event.currentTarget instanceof HTMLImageElement)
					onpreviewerror?.(event.currentTarget.src)
			}}
		/>
	{/key}
{/snippet}

<div class="item">
	<AvatarTile {shape} status={previewFailed ? 'error' : state?.status}>
		{#if state?.status === 'uploading'}
			<LoadingSpinner text={state.label ?? name} />
		{:else if state?.status === 'error' || previewFailed}
			<Icon width="24" height="24"
				><path d="M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5" /></Icon
			>
			<span role="alert">{state?.label ?? name}</span>
		{:else if preview}
			{#if downloadUrl}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Native download URLs belong to the consumer. -->
				<a class="preview" href={downloadUrl} download={name}
					>{@render thumbnail()}</a
				>
			{:else}
				{@render thumbnail()}
			{/if}
		{/if}
		<div class="controls" data-shape={shape}>
			<Button
				type="button"
				appearance="flat"
				aria-label={`${infoLabel}: ${name}`}
				popovertarget={informationId}
			>
				<Icon width="24" height="24"
					><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></Icon
				>
			</Button>
			{#if onremove}
				<Button
					type="button"
					appearance="flat"
					{disabled}
					aria-label={removeAccessibleLabel ?? `${removeLabel}: ${name}`}
					onclick={onremove}
				>
					<Icon width="24" height="24"
						><path
							d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"
						/></Icon
					>
				</Button>
			{/if}
		</div>
	</AvatarTile>
	<Popover id={informationId} aria-label={infoLabel}>
		{#if downloadUrl}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Native download URLs belong to the consumer. -->
			<a class="filename" href={downloadUrl} download={name}>{name}</a>
		{:else}
			<p class="filename">{name}</p>
		{/if}
		{#if actions}{@render actions(informationId)}{/if}
	</Popover>
</div>

<style>
	.item {
		display: grid;
		gap: var(--dui-avatar-gap, var(--dui-spacing-xs, 0.5rem));
		width: var(--dui-avatar-size, 8rem);
		max-width: 100%;
	}
	.controls {
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		block-size: max(33.333%, var(--dui-button-min-height, 44px));
		box-sizing: border-box;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		border-block-start: var(--dui-border-width, 2px) solid currentColor;
		opacity: 0;
		pointer-events: none;
		--dui-button-padding: var(--dui-spacing-xxs, 0.25rem);
	}
	.controls :global(button) {
		min-width: 0;
		width: 100%;
		height: 100%;
		border: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.controls:has(:global(button + button))::after {
		content: '';
		position: absolute;
		inset-block: 0;
		inset-inline-start: 50%;
		border-inline-start: var(--dui-border-width, 2px) solid currentColor;
		pointer-events: none;
	}
	.controls[data-shape='circle'] :global(button svg) {
		translate: 0 calc(-1 * var(--dui-spacing-xxs, 0.25rem));
	}
	.controls[data-shape='circle']
		:global(button:first-child:not(:only-child) svg) {
		translate: var(--dui-spacing-xs, 0.5rem)
			calc(-1 * var(--dui-spacing-xxs, 0.25rem));
	}
	.controls[data-shape='circle']
		:global(button:last-child:not(:only-child) svg) {
		translate: calc(-1 * var(--dui-spacing-xs, 0.5rem))
			calc(-1 * var(--dui-spacing-xxs, 0.25rem));
	}
	.item:hover .controls,
	.item:focus-within .controls,
	.item:has(:global(:popover-open)) .controls {
		opacity: 1;
		pointer-events: auto;
	}
	@media (hover: none) {
		.controls {
			opacity: 1;
			pointer-events: auto;
		}
	}

	span {
		max-width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.filename {
		overflow-wrap: anywhere;
		min-width: 0;
	}
	.preview {
		position: absolute;
		inset: 0;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
