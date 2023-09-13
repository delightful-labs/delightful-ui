<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

	import Button from '../lib/Components/Button.svelte'
	import UiProvider from '$lib/Components/UIProvider.svelte'
</script>

<Meta title="Inputs/Button" component={Button} />

<Template let:args>
	<UiProvider preferred_langauge="SW">
		<Button {...args} />
	</UiProvider>
	<Button {...args} />
</Template>

<Story name="Text" args={{ text: { SW: 'Piga' } }} />
