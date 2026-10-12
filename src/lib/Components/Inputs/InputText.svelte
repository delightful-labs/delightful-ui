<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import InputWrapper from './InputWrapper.svelte'

	type Props = Omit<
		HTMLInputAttributes,
		'type' | 'value' | 'defaultValue' | 'defaultvalue' | 'children'
	> & {
		label: string
		type?: Extract<
			HTMLInputAttributes['type'],
			'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
		>
		value?: string
		defaultValue?: string
	}

	const generatedId = $props.id()
	let {
		label,
		id,
		type = 'text',
		required = false,
		defaultValue,
		value = $bindable(),
		...attributes
	}: Props = $props()
	const inputId = $derived(id ?? generatedId)
</script>

<InputWrapper title={label} key={inputId} required={required === true}>
	<input
		{...attributes}
		id={inputId}
		{type}
		{required}
		{defaultValue}
		bind:value
	/>
</InputWrapper>
