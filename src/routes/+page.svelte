<script>
	import '$lib/theme.css'
	import { Button } from '$lib'
</script>

<main>
	<h1>Delightful UI</h1>
	<section aria-labelledby="button-heading">
		<h2 id="button-heading">Button</h2>
		<div class="controls">
			<Button>Save</Button>
			<Button disabled>Save</Button>
			<Button text={{ EN: 'Locale label' }} />
		</div>
	</section>
	<section aria-labelledby="theme-heading">
		<h2 id="theme-heading">Theme</h2>
		<a href="#button-heading">Button examples</a>
	</section>
</main>

<style>
	main {
		padding: var(--dui-space-lg);
	}

	section + section {
		margin-top: var(--dui-space-lg);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: var(--dui-space-sm);
	}
</style>
