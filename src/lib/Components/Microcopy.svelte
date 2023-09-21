<script>
	import MicrocopyFactory from '$lib/Classes/MicrocopyFactory'

	export let key = ''

	/**
	 * @type {import('$lib/types').LocalizedString|undefined}
	 */
	export let custom_label = undefined

	const copy = new MicrocopyFactory()

	$: label = copy.display(key, custom_label)
</script>

{$label}
