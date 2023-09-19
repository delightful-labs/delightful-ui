<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

	import Dialogue from '../lib/Components/Dialogue.svelte'
	import UiProvider from '$lib/Components/UIProvider.svelte'
</script>

<Meta title="Dialogue" component={Dialogue} />

<Template let:args>
	<UiProvider preferred_langauge="SW">
		<Dialogue {...args} />
	</UiProvider>
</Template>

<Story name="Default" args={{ button_title: { SW: 'Piga' } }} />
