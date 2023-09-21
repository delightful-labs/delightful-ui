<script>
	import { DEFAULT_LABELS } from '$lib'
	import Microcopy from './Microcopy.svelte'
	import MicrocopyFactory from '$lib/Classes/MicrocopyFactory'

	const labelKey = 'BUTTON'

	/**
	 * @type {import('$lib/types').LocalizedString}
	 */
	export let text = DEFAULT_LABELS[labelKey]

	/**
	 * @type {'button'|'submit'}
	 */
	export let type = 'button'

	/**
	 * @type {boolean|undefined}
	 */
	export let disabled = undefined

	/**
	 * @type {string|undefined}
	 */
	export let popovertarget = undefined

	const copy = new MicrocopyFactory().display(labelKey, text)
</script>

{#if type === 'button'}
	<button class="button" {disabled} on:click {popovertarget}
		><Microcopy key={labelKey} custom_label={text} /></button
	>
{:else}
	<input class="button" type="submit" value={$copy} {disabled} />
{/if}

<style>
	.button {
		-webkit-appearance: none;
		appearance: none;
		font-family: var(--button-font-family, inherit);
		font-size: var(--button-font-size, inherit);
		box-sizing: border-box;
		padding: var(--button-padding, 1rem);
		color: var(--button-color, inherit);
		min-height: var(--button-min-height, 48px);
		border-color: var(--button-border-color, currentColor);
		border-style: var(--button-border-style, solid);
		border-width: var(--button-border-width, 1px);
		background-color: var(--button-background-color, transparent);
	}

	.button:hover {
		color: var(--button-color_hover, white);
		background-color: var(--button-background-color_hover, black);
		border-color: var(--button-border-color_hover, currentColor);
	}

	.button:disabled {
		opacity: 0.5;
	}
</style>
