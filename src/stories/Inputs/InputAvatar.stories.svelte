<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import InputAvatar from '#lib/Components/Inputs/InputAvatar.svelte'

	const { Story } = defineMeta({
		title: 'Inputs/Avatar',
		component: InputAvatar,
		tags: ['autodocs'],
		args: { label: 'Avatar', name: 'avatar', removeLabel: 'Remove' }
	})
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	let exampleFiles = $state<File[]>([])
	onMount(() => {
		const image =
			'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#6a8a78"/><circle cx="64" cy="48" r="24" fill="#eee"/><ellipse cx="64" cy="115" rx="46" ry="38" fill="#eee"/></svg>'
		exampleFiles = [
			new File([image], 'Portrait.svg', { type: 'image/svg+xml' }),
			new File([image], 'Uploading.svg', { type: 'image/svg+xml' }),
			new File([image], 'Failed.svg', { type: 'image/svg+xml' })
		]
	})
	let value = $state<File | File[] | null>(null)
	let disabled = $state(false)
	let mounted = $state(true)
	let result = $state('No submission yet.')
</script>

<Story name="Default" />
<Story name="Image list states">
	{#snippet template(args)}
		<InputAvatar
			{...args}
			multiple
			shape="circle"
			bind:value={exampleFiles}
			imageState={(file) =>
				file.name === 'Uploading.svg'
					? { status: 'uploading', label: 'Uploading…' }
					: file.name === 'Failed.svg'
						? { status: 'error', label: 'Upload failed' }
						: { status: 'ready' }}
		/>
	{/snippet}
</Story>
<Story
	name="Custom labels"
	args={{
		label: 'Profile photo',
		uploadLabel: 'Choose photo',
		removeLabel: 'Delete photo'
	}}
/>
<Story name="Multiple images" args={{ multiple: true }} />
<Story name="Circle images" args={{ multiple: true, shape: 'circle' }} />
<Story name="Required" args={{ required: true }} />
<Story
	name="Long labels"
	args={{
		uploadLabel: 'Upload a new profile photograph',
		removeLabel: 'Remove your profile photograph'
	}}
/>
<Story name="Disabled" args={{ disabled: true }} />
<Story name="Bound form">
	{#snippet template(args)}
		<form
			onsubmit={(event) => {
				event.preventDefault()
				const files = new FormData(event.currentTarget).getAll('avatar')
				result =
					files
						.filter(
							(file): file is File => file instanceof File && file.name !== ''
						)
						.map((file) => `${file.name}: ${file.size} bytes`)
						.join(', ') || 'No image field'
			}}
		>
			{#if mounted}
				<InputAvatar {...args} bind:value {disabled} required />
			{/if}
			<p role="status" aria-label="Selected image">
				{Array.isArray(value)
					? value.map((file) => file.name).join(', ') || 'No image'
					: (value?.name ?? 'No image')}
			</p>
			<button type="submit">Submit</button>
			<button type="reset">Reset</button>
			<button type="button" onclick={() => (value = null)}>Clear image</button>
			<button
				type="button"
				onclick={() => {
					value = new File(['invalid image'], 'parent.png', {
						type: 'image/png'
					})
				}}>Set image</button
			>
			<button
				type="button"
				onclick={() => {
					value = [
						new File(['first image'], 'first.png', { type: 'image/png' }),
						new File(['second image'], 'second.png', { type: 'image/png' })
					]
				}}>Set multiple images</button
			>
			<button type="button" onclick={() => (disabled = !disabled)}
				>Toggle disabled</button
			>
			<button type="button" onclick={() => (mounted = !mounted)}
				>Toggle component</button
			>
			<pre aria-live="polite">{result}</pre>
		</form>
	{/snippet}
</Story>
