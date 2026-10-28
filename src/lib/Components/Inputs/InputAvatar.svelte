<script lang="ts">
	import { tick, untrack, type Snippet } from 'svelte'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import AvatarImageTile from './AvatarImageTile.svelte'
	import AvatarFilePicker from './AvatarFilePicker.svelte'
	import InputWrapper from './InputWrapper.svelte'

	type Props = Omit<
		HTMLInputAttributes,
		| 'type'
		| 'value'
		| 'files'
		| 'defaultValue'
		| 'defaultvalue'
		| 'children'
		| 'readonly'
	> & {
		imageActions?: Snippet<[File, string]>
		leadingImages?: Snippet
		label: string
		uploadLabel?: string
		removeLabel?: string
		infoLabel?: string
		value?: File | File[] | null
		shape?: 'square' | 'circle'
		imageState?: (file: File) => {
			status: 'ready' | 'uploading' | 'error'
			label?: string
		}
	}

	const generatedId = $props.id()
	let {
		label,
		leadingImages,
		imageActions,
		uploadLabel = 'Upload',
		removeLabel = 'Remove',
		infoLabel = 'File information',
		id,
		shape = 'square',
		imageState,
		value = $bindable(null),
		accept = 'image/*',
		disabled = false,
		oninput,
		onchange,
		...attributes
	}: Props = $props()
	const inputId = $derived(id ?? generatedId)
	let input = $state<HTMLInputElement>()
	let previews = $state<string[]>([])
	let failedPreviews = $state<string[]>([])
	const files = $derived(
		value === null ? [] : Array.isArray(value) ? value : [value]
	)

	$effect(() => {
		const selectedFiles = files
		if (!input) return
		const node = input
		untrack(() => {
			if (
				node.files?.length === selectedFiles.length &&
				selectedFiles.every((file, index) => node.files?.[index] === file)
			)
				return
			if (selectedFiles.length > 0) {
				const transfer = new DataTransfer()
				selectedFiles.forEach((file) => transfer.items.add(file))
				node.files = transfer.files
			} else node.value = ''
		})
	})

	$effect(() => {
		const urls = files.map((file) => URL.createObjectURL(file))
		previews = urls
		failedPreviews = []
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url))
		}
	})

	$effect(() => {
		// Track the explicit form attribute as well as the mounted input.
		attributes.form
		const form = input?.form
		function reset(event: Event) {
			queueMicrotask(() => {
				if (!event.defaultPrevented) value = attributes.multiple ? [] : null
			})
		}
		form?.addEventListener('reset', reset)
		return () => form?.removeEventListener('reset', reset)
	})

	function remove(file: File) {
		if (disabled || input?.matches(':disabled')) return
		const remaining = files.filter((item) => item !== file)
		value = attributes.multiple ? remaining : (remaining[0] ?? null)
		void tick().then(() => input?.focus())
	}

	function select(node: HTMLInputElement) {
		const selected = Array.from(node.files ?? [])
		if (selected.length === 0) return
		value = attributes.multiple
			? [...new Set([...files, ...selected])]
			: selected[0]
	}
</script>

<InputWrapper title={label} key={inputId}>
	<div class="avatar">
		{#if leadingImages}{@render leadingImages()}{/if}
		{#each files as file, index (file)}
			<AvatarImageTile
				name={file.name}
				preview={previews[index]}
				previewFailed={failedPreviews.includes(previews[index])}
				state={imageState?.(file)}
				{shape}
				{disabled}
				{removeLabel}
				removeAccessibleLabel={attributes.multiple
					? `${removeLabel}: ${file.name}`
					: removeLabel}
				{infoLabel}
				onremove={() => remove(file)}
				onpreviewerror={() => {
					failedPreviews = [...failedPreviews, previews[index]]
				}}
			>
				{#snippet actions(popoverId)}
					{#if imageActions}{@render imageActions(file, popoverId)}{/if}
				{/snippet}
			</AvatarImageTile>
		{/each}
		<AvatarFilePicker
			{...attributes}
			bind:input
			id={inputId}
			{accept}
			{disabled}
			{shape}
			{uploadLabel}
			oninput={(event) => {
				select(event.currentTarget)
				oninput?.(event)
			}}
			onchange={(event) => onchange?.(event)}
		/>
	</div>
</InputWrapper>

<style>
	.avatar {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--dui-avatar-gap, var(--dui-spacing-xs, 0.5rem));
		width: fit-content;
		min-width: min(var(--dui-avatar-size, 8rem), 100%);
		max-width: 100%;
	}
</style>
