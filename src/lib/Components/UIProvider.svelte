<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	/**
	 * @type {string|undefined}
	 */
	export let preferred_langauge = undefined

	/**
	 * @type {*}
	 */
	export let custom_labels = undefined

	setContext('preferred_language_store', writable(preferred_langauge))
	setContext('custom_labels', custom_labels)
</script>

<slot />
