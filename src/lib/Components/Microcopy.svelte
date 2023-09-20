<script>
	import Microcopy from '$lib/Classes/Microcopy'

	export let key = ''

	/**
	 * @type {import('$lib/types').LocalizedString|undefined}
	 */
	export let custom_label = undefined

	const copy = new Microcopy()

	const label = copy.display(key, custom_label)
</script>

{$label}
