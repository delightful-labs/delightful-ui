<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

	import Dialog from '../lib/Components/Dialog.svelte'
</script>

<Meta title="Dialog" component={Dialog} />

<Template let:args>
	<Dialog {...args}>
		<form method="dialog">
			<button type="submit">Close</button>
		</form>
	</Dialog>
</Template>

<Story name="Default" args={{ heading: 'Piga', open: true }} />
