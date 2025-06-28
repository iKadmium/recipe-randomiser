<script lang="ts">
	import {
		Button,
		Card,
		CardBody,
		CardHeader,
		Form,
		FormGroup,
		Input,
		Label,
		Alert
	} from '@sveltestrap/sveltestrap';
	import { addToast } from '$lib/toasts';

	let selectedDbType = $state('ingredients');
	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let error = $state('');

	const dbTypes = [
		{ value: 'ingredients', label: 'Ingredients' },
		{ value: 'recipes', label: 'Recipes' },
		{ value: 'tags', label: 'Tags' },
		{ value: 'takeout', label: 'Takeout' }
	];

	async function handleFileUpload() {
		if (!fileInput?.files?.[0]) {
			error = 'Please select a file to upload';
			return;
		}

		const file = fileInput.files[0];

		if (!file.type.includes('json')) {
			error = 'Please select a JSON file';
			return;
		}

		uploading = true;
		error = '';

		try {
			const text = await file.text();
			const data = JSON.parse(text);

			const response = await fetch('/api/seed', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					key: selectedDbType,
					data: data
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to upload: ${response.statusText}`);
			}

			addToast({
				type: 'success',
				message: `Successfully uploaded ${selectedDbType} data`
			});

			// Reset form
			fileInput.value = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during upload';
			addToast({
				type: 'error',
				message: error
			});
		} finally {
			uploading = false;
		}
	}
</script>

<h1>Database Seed</h1>
<p class="text-muted">
	Upload backup JSON data to populate the database. This page is for admin use only.
</p>

<Card>
	<CardHeader>
		<h4>Upload Data</h4>
	</CardHeader>
	<CardBody>
		<Form>
			<FormGroup>
				<Label for="dbType">Database Type</Label>
				<Input type="select" id="dbType" bind:value={selectedDbType}>
					{#each dbTypes as dbType (dbType)}
						<option value={dbType.value}>{dbType.label}</option>
					{/each}
				</Input>
			</FormGroup>

			<FormGroup>
				<Label for="dataFile">JSON Data File</Label>
				<input
					type="file"
					id="dataFile"
					class="form-control"
					accept=".json,application/json"
					bind:this={fileInput}
				/>
				<div class="form-text">Select a JSON file containing {selectedDbType} data</div>
			</FormGroup>

			{#if error}
				<Alert color="danger">
					{error}
				</Alert>
			{/if}

			<Button color="primary" onclick={handleFileUpload} disabled={uploading}>
				{uploading ? 'Uploading...' : 'Upload Data'}
			</Button>
		</Form>
	</CardBody>
</Card>

<div class="mt-4">
	<Card>
		<CardHeader>
			<h5>Expected Data Format</h5>
		</CardHeader>
		<CardBody>
			<p>
				The JSON file should contain a key-value store where the key is the ID and the value is the
				object. Expected formats:
			</p>
			<ul>
				<li>
					<strong>Ingredients:</strong> Object with keys as ingredient names and values containing
					<code>name</code>, <code>unit</code>, <code>fresh</code> properties
				</li>
				<li>
					<strong>Recipes:</strong> Object with keys as recipe names and values containing
					<code>name</code>, <code>description</code>, <code>ingredients</code>, <code>tags</code> properties
				</li>
				<li>
					<strong>Tags:</strong> Object with keys as tag names and values containing
					<code>name</code> property
				</li>
				<li>
					<strong>Takeout:</strong> Object with keys as takeout names and values containing
					<code>name</code>, <code>description</code> properties
				</li>
			</ul>
			<p class="mt-3"><strong>Example structure:</strong></p>
			<pre><code
					>{`{
  "Eggplant": {
    "name": "Eggplant",
    "unit": "things",
    "fresh": true
  },
  "Mozzarella": {
    "name": "Mozzarella",
    "unit": "things"
  }
}`}</code
				></pre>
		</CardBody>
	</Card>
</div>
