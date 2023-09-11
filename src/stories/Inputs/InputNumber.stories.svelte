<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
	import InputNumber from '$lib/Components/Inputs/InputNumber.svelte'
</script>

<Meta title="Inputs/Number" component={Number} />

<Template let:args>
	<form on:submit|preventDefault>
		<InputNumber {...args} --input-font-family="monospace" />
		<input type="submit" />
	</form>
</Template>

<Story name="Number Input" args={{ title: 'number' }} />

<Story
	name="Number Size"
	args={{
		size: 6,
		placeholder: '000000',
		hideArrows: true,
		maxlength: 6,
		minlength: 6,
		required: true
	}}
/>
