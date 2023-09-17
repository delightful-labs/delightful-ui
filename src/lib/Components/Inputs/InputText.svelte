<script>
	import InputWrapper from './InputWrapper.svelte'
	import createHtmlId from '$lib/utils/createHtmlId'
	import createFieldTitle from '$lib/utils/createFieldTitle'

	/**
	 * @type {import('$lib/types').AutocompleteOptions}
	 */
	export let autocomplete = 'off'

	/**
	 * @type {import('$lib/types').InputModes}
	 */
	export let inputmode = undefined

	/**
	 * @type {number|undefined}
	 */
	export let maxlength = undefined

	/**
	 * @type {number|undefined}
	 */
	export let minlength = undefined

	/**
	 * @type {string|undefined}
	 */
	export let pattern = undefined

	/**
	 * @type {string}
	 */
	export let title = createFieldTitle()

	/**
	 * @type {string}
	 */
	export let key = createHtmlId(title)

	/**
	 * @type {boolean}
	 */
	export let required = false

	/**
	 * @type {string|undefined}
	 */
	export let style = undefined

	/**
	 * @type {string}
	 */
	export let value = ''

	/**
	 * @type {string[]|undefined}
	 */
	export let list = undefined

	/**
	 * @type {number|undefined}
	 */
	export let size = undefined

	/**
	 * @type {string|undefined}
	 */
	export let placeholder = undefined

	/**
	 * @type {boolean}
	 */
	export let limitToNumbers = false

	/**
	 * @type {boolean}
	 */
	let dataValid = true

	const stripNonNumbers = () => {
		value = value.replace(/\D/g, '')
	}
</script>

<InputWrapper {title} {required} {key}>
	<input
		{autocomplete}
		data-valid={dataValid}
		id={key}
		{inputmode}
		{title}
		list={list ? `${title}-list` : undefined}
		{maxlength}
		{minlength}
		type="text"
		{required}
		{pattern}
		{placeholder}
		{size}
		{style}
		bind:value
		on:input={limitToNumbers ? () => stripNonNumbers() : undefined}
		on:invalid={() => (dataValid = false)}
		on:input={() => (dataValid = true)}
	/>
</InputWrapper>

{#if list}
	<datalist id="{title}-list">
		{#each list as listItem}
			<option value={listItem}></option>
		{/each}
	</datalist>
{/if}
