<script lang="ts">
	import { tick } from 'svelte'
	import type { ImageInputProps } from './image-input.js'
	import AvatarImageTile from './AvatarImageTile.svelte'
	import AvatarFilePicker from './AvatarFilePicker.svelte'
	import InputWrapper from './InputWrapper.svelte'

	const generatedId = $props.id()
	let {
		label,
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
		...attributes
	}: ImageInputProps & { value?: File | null } = $props()
	const inputId = $derived(id ?? generatedId)
	const files = $derived(value ? [value] : [])
	let input = $state<HTMLInputElement>()

	function remove() {
		if (disabled || input?.matches(':disabled')) return
		value = null
		void tick().then(() => input?.focus())
	}
</script>

{#snippet picker(embedded = false)}
	<AvatarFilePicker
		{...attributes}
		{embedded}
		bind:input
		id={inputId}
		{files}
		{accept}
		{disabled}
		{shape}
		{uploadLabel}
		onfileschange={(selected) => {
			value = selected[0] ?? null
		}}
	/>
{/snippet}

<InputWrapper title={label} key={inputId}>
	{#if value}
		<AvatarImageTile
			file={value}
			name={value.name}
			state={imageState?.(value)}
			{shape}
			{disabled}
			{removeLabel}
			removeAccessibleLabel={removeLabel}
			{infoLabel}
			onremove={remove}
		>
			{#snippet picker()}{@render selectedPicker()}{/snippet}
			{#snippet actions(popoverId)}
				{#if imageActions && value}{@render imageActions(value, popoverId)}{/if}
			{/snippet}
		</AvatarImageTile>
	{:else}
		{@render picker()}
	{/if}
</InputWrapper>

{#snippet selectedPicker()}{@render picker(true)}{/snippet}
