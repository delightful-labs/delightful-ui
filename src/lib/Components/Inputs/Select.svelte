<script lang="ts">
	import { untrack } from 'svelte'
	import type { HTMLSelectAttributes } from 'svelte/elements'
	import InputWrapper from './InputWrapper.svelte'

	type Props = Omit<
		HTMLSelectAttributes,
		'multiple' | 'value' | 'defaultValue' | 'defaultvalue' | 'bind:value'
	> & {
		label: string
	} & (
			| { multiple?: false; value?: string; defaultValue?: string }
			| { multiple: true; value?: string[]; defaultValue?: string[] }
		)

	const generatedId = $props.id()
	let {
		label,
		id,
		required = false,
		multiple = false,
		defaultValue,
		value = $bindable(),
		children,
		...attributes
	}: Props = $props()

	untrack(() => {
		if (value === undefined) value = defaultValue
	})
	const selectId = $derived(id ?? generatedId)
</script>

<InputWrapper title={label} key={selectId}>
	{#if multiple}
		<select
			{...attributes}
			id={selectId}
			{required}
			multiple
			{defaultValue}
			bind:value
		>
			{@render children?.()}
		</select>
	{:else}
		<select {...attributes} id={selectId} {required} {defaultValue} bind:value>
			{@render children?.()}
		</select>
	{/if}
</InputWrapper>
