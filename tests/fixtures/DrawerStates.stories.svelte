<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import DrawerStates from './DrawerStates.svelte'
	const { Story } = defineMeta({
		title: 'Tests/DrawerStates',
		component: DrawerStates
	})
</script>

<Story name="Default" />
<Story name="Initially open" args={{ initialOpen: true }} />
<Story
	name="Long overlay"
	args={{ initialMode: 'overlay', longContent: true }}
/>
