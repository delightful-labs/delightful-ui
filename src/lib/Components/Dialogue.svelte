<script>
	import { DEFAULT_LABELS } from '$lib'
	import Button from './Button.svelte'
	import Microcopy from './Microcopy.svelte'

	const labelKey = 'DIALOGUE'

	export let title = DEFAULT_LABELS[labelKey]

	/**
	 * @type {import('$lib/types').LocalizedString | undefined};
	 */
	export let button_title

	/**
	 * @type {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'}
	 */
	export let title_heading_level = 'h2'

	/**
	 * @type {HTMLDialogElement}
	 */
	let el

	/**
	 *
	 * @param {HTMLDialogElement} node
	 */
	const click_outside = (node) => {
		/**
		 * @param {MouseEvent} event
		 */
		const handle_click = ({ target: dialog }) => {
			if (dialog instanceof HTMLDialogElement) {
				if (dialog.nodeName === 'DIALOG')
					node.dispatchEvent(new CustomEvent('click_outside'))
			}
		}

		document.addEventListener('click', handle_click, true)

		return {
			destroy() {
				document.removeEventListener('click', handle_click, true)
			}
		}
	}
</script>

<dialog
	aria-labelledby="title"
	bind:this={el}
	on:close
	use:click_outside
	on:click_outside={() => el.close()}
>
	<div class="wrapper">
		<svelte:element this={title_heading_level} id="title"
			><Microcopy key={labelKey} custom_label={title} /></svelte:element
		>
		<slot />
	</div>
</dialog>

<Button on:click={() => el.showModal()} text={button_title} />

<style>
	dialog {
		border: 0;
		padding: 0;
	}

	dialog::backdrop {
		background-color: currentColor;
		opacity: 0.6;
	}

	.wrapper {
		padding: var(--dialog-padding, 1rem);
		border-color: var(--dialog-border-color, currentColor);
		border-style: var(--dialog-border-style, solid);
		border-width: var(--dialog-border-width, 1px);
	}
</style>
