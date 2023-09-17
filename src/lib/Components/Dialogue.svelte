<script>
	import { DEFAULT_LABELS } from '$lib'
	import Button from './Button.svelte'
	import Microcopy from './Microcopy.svelte'

	const labelKey = 'DIALOGUE'

	export let title = DEFAULT_LABELS[labelKey]

	export let button_title

	/**
	 * @type {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'}
	 */
	export let title_heading_level = 'h2'

	let el
</script>

<dialog
	aria-labelledby="title"
	id="test"
	bind:this={el}
	popover="auto"
	on:toggle
	on:beforetoggle
>
	<svelte:element this={title_heading_level} id="title"
		><Microcopy key={labelKey} custom_label={title} /></svelte:element
	>
	<slot />
</dialog>

<Button popovertarget="test" text={button_title} />

<style>
	dialog::backdrop {
		background-color: currentColor;
		opacity: 0.6;
	}
</style>
