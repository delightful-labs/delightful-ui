<script lang="ts">
	import '$lib/theme.css'
	import { Button, InputNumber, InputText } from '$lib'

	let submitted = $state<string | undefined>()
	let boundText = $state<string | undefined>()
	let boundNumber = $state<number | undefined>()

	function submit(event: SubmitEvent) {
		event.preventDefault()
		if (!(event.currentTarget instanceof HTMLFormElement)) return
		submitted = JSON.stringify(
			Array.from(new FormData(event.currentTarget)),
			null,
			2
		)
	}
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
	<section aria-labelledby="input-heading">
		<h2 id="input-heading">Inputs</h2>
		<form onsubmit={submit} onreset={() => (submitted = undefined)}>
			<InputText
				label="Description"
				name="description"
				defaultValue="Example"
				required
			/>
			<InputText label="Category" name="category" list="category-options" />
			<datalist id="category-options">
				<option value="Personal"></option>
				<option value="Work"></option>
			</datalist>
			<InputNumber
				label="Quantity"
				name="quantity"
				defaultValue={0}
				min={0}
				max={100}
				required
			/>
			<InputNumber
				label="Measurement"
				name="measurement"
				defaultValue={1.25}
				step={0.01}
			/>
			<InputText
				label="Readonly"
				name="readonly"
				defaultValue="Included"
				readonly
			/>
			<InputText
				label="Disabled"
				name="disabled"
				defaultValue="Omitted"
				disabled
			/>
			<details>
				<summary>Optional value binding</summary>
				<div class="bound-fields">
					<InputText
						label="Bound text"
						name="bound-text"
						defaultValue="Preview"
						bind:value={boundText}
					/>
					<p>Current text: {boundText ?? ''}</p>
					<InputNumber
						label="Bound number"
						name="bound-number"
						defaultValue={2.5}
						step="any"
						bind:value={boundNumber}
					/>
					<p>Current number: {boundNumber ?? 'undefined'}</p>
				</div>
			</details>
			<div class="controls">
				<Button type="submit">Submit</Button>
				<Button type="reset">Reset</Button>
			</div>
		</form>
		<h3>Submitted FormData</h3>
		<pre aria-live="polite">{submitted ?? 'No submission yet.'}</pre>
	</section>
	<section aria-labelledby="theme-heading">
		<h2 id="theme-heading">Theme</h2>
		<a href="#input-heading">Input examples</a>
	</section>
</main>

<style>
	main {
		padding: var(--dui-space-lg);
	}

	section + section {
		margin-top: var(--dui-space-lg);
	}

	form,
	.bound-fields {
		display: grid;
		gap: var(--dui-space-sm);
	}

	form {
		max-width: 32rem;
	}

	.bound-fields {
		margin-top: var(--dui-space-sm);
	}

	.bound-fields p {
		margin: 0;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: var(--dui-space-sm);
	}
</style>
