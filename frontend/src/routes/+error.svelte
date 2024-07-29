<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<pre>{JSON.stringify($page, undefined, 2)}</pre>
