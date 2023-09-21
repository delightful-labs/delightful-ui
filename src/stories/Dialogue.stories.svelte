<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

	import Dialog from '../lib/Components/Dialog.svelte'
	import UiProvider from '$lib/Components/UIProvider.svelte'
</script>

<Meta title="Dialog" component={Dialog} />

<Template let:args>
	<UiProvider preferred_langauge="SW">
		<Dialog {...args} on:open={() => console.log('it is open')} />
	</UiProvider>
</Template>

<Story name="Default" args={{ button_title: { SW: 'Piga' }, show: true }} />
