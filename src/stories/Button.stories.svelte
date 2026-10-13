<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Button from '#lib/Components/Button.svelte'

	const { Story } = defineMeta({
		title: 'Controls/Button',
		component: Button,
		tags: ['autodocs'],
		args: { text: 'Save' }
	})
</script>

<Story name="Default" />
<Story name="Disabled" args={{ disabled: true }} />
<Story name="Children">
	{#snippet template(args)}
		<Button {...args}>Save changes</Button>
	{/snippet}
</Story>
