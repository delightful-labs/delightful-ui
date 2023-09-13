<script>
	import { DEFAULT_LABELS, DEFAULT_LANGUAGE } from '$lib'
	import { getContext } from 'svelte'

	export let key = ''

	/**
	 * @ptype {*}
	 */
	export let custom_label = undefined

	const custom_labels = getContext('custom_labels')
	const preferred_language = getContext('preferred_language_store')

	/**
	 *
	 * @param {string} label
	 * @param {*} custom_label
	 * @returns {string}
	 */
	const printLabel = (label, custom_label) => {
		if (custom_label?.[$preferred_language]) {
			return custom_label[$preferred_language]
		} else if (custom_labels?.[label]?.[$preferred_language]) {
			return custom_labels[label][$preferred_language]
		} else {
			return DEFAULT_LABELS[label][DEFAULT_LANGUAGE]
		}
	}

	$: label = printLabel(key, custom_label)
</script>

{label}
