<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import StatusMessage from '#lib/Components/StatusMessage.svelte'

	const { Story } = defineMeta({
		title: 'Feedback/StatusMessage',
		component: StatusMessage,
		tags: ['autodocs'],
		args: { text: 'Changes are saved on this device.' },
		argTypes: {
			variant: {
				control: 'select',
				options: ['info', 'loading', 'success', 'error']
			}
		}
	})
</script>

<Story name="Information" />
<Story
	name="Loading"
	args={{ variant: 'loading', text: 'Loading accounts…' }}
/>
<Story
	name="Success"
	args={{ variant: 'success', text: 'Transaction saved.' }}
/>
<Story
	name="Error"
	args={{
		variant: 'error',
		text: 'Could not save the transaction. Try again.'
	}}
/>
<Story
	name="Wrapping"
	args={{
		variant: 'loading',
		text: 'Loading accounts and categories for the selected workspace. This message wraps within the available width.',
		style: 'max-inline-size: 18rem;'
	}}
/>
<Story
	name="Without announcement"
	args={{ role: 'presentation', text: 'No accounts yet.' }}
/>
