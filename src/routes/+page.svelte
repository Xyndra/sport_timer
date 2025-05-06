<script lang="ts">
	import Timer from './Timer.svelte';
</script>

<svelte:head>
	<title>Timer</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Timer />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
