<script>
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	/**
	 * @type {string|undefined}
	 */
	export let Preferred_Langauge = undefined

	/**
	 * @type {*}
	 */
	export let Custom_Labels = undefined

	setContext('Preferred_Language_Store', writable(Preferred_Langauge))
	setContext('Custom_Labels', Custom_Labels)
</script>

<slot />
