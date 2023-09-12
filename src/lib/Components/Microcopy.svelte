<script>
	import { DEFAULT_LABELS, DEFAULT_LANGUAGE } from '$lib'
	import { getContext } from 'svelte'

	export let state = 'IDLE'

	export let key = ''

	/**
	 * @ptype {*}
	 */
	export let customLabel = undefined

	const customLabels = getContext('Custom_Labels')
	const preferredLanguage = getContext('Preferred_Language_Store')

	/**
	 *
	 * @param {string} label
	 * @returns {string}
	 */
	const printLabel = (label) => {
		if (customLabel?.[state]?.[$preferredLanguage]) {
			return customLabel[state][$preferredLanguage]
		} else if (customLabels?.[label]?.[state]?.[$preferredLanguage]) {
			return customLabels[label][state][$preferredLanguage]
		} else {
			return DEFAULT_LABELS[label][state][DEFAULT_LANGUAGE]
		}
	}
</script>

{printLabel(key)}
