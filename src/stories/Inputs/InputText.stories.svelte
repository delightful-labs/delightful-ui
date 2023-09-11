<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
	import InputText from '$components/Inputs/InputText.svelte'
</script>

<Meta title="Inputs/Text" component={Text} />

<Template let:args>
	<form on:submit|preventDefault>
		<InputText {...args} --input-font-family="monospace" , />
		<input type="submit" />
	</form>
</Template>

<Story
	name="Text Input"
	args={{
		type: 'text',
		title: 'My Field'
	}}
/>

<Story
	name="Max length"
	args={{
		title: 'My Field',
		minlength: 6,
		maxlength: 6,
		size: 6,
		placeholder: '000000',
		required: true,
		pattern: 'd+',
		limitToNumbers: true,
		inputmode: 'tel'
	}}
/>
