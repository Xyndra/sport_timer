<script lang="ts">
	import type { TimePlan } from '$lib/schedule';

	export let plan: TimePlan;
	export let getPlanStage: (plan: TimePlan) => any;
	export let formatMs: (ms: number) => string;

	let stageInfo = getPlanStage(plan);

	// Update every second
	let interval: ReturnType<typeof setInterval>;
	import { onMount, onDestroy } from 'svelte';
	onMount(() => {
		interval = setInterval(() => {
			let planStage = getPlanStage(plan);

			if (planStage.index !== stageInfo.index && window.navigator.vibrate !== undefined) {
				window.navigator.vibrate(100);
			}
			stageInfo = planStage;
		}, 500);
	});
	onDestroy(() => clearInterval(interval));
</script>

<div class="plan-timeline">
	<div class="plan-title">{plan.name}</div>
	<div class="timeline-bar">
		{#each plan.stages as stage, i}
			<div
				class="stage"
				style="
					flex: {stage.duration};
					background: {i === stageInfo.index ? '#0077ff' : '#ccc'};
					color: {i === stageInfo.index ? '#fff' : '#222'};
					opacity: {i < stageInfo.index ? 0.5 : 1};
				"
			>
				<div class="stage-label">{stage.name}</div>
				<div class="stage-time">
					{formatMs(stage.duration)}
				</div>
				{#if i === stageInfo.index}
					<div
						class="stage-progress !rounded-none"
						style="width: {Math.round(stageInfo.stageProgress * 100)}%;"
					></div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="plan-progress">
		Teil {stageInfo.index + 1}/{plan.stages.length}: <b>{stageInfo.stage.name}</b>
		({formatMs(stageInfo.stageElapsed)} / {formatMs(stageInfo.stage.duration)})
	</div>
</div>

<style>
	.plan-timeline {
		width: 100%;
		max-width: 600px;
		background: #f8f8f8;
		border-radius: 1rem;
		padding: 1rem;
		box-shadow: 0 2px 8px #0001;
	}
	.plan-title {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	.timeline-bar {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		overflow: hidden;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px #0001;
		margin-bottom: 0.5rem;
	}
	.stage {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-basis: 0;
		flex-grow: 1;
		font-size: 0.9rem;
		transition: background 0.2s;
		padding: 0 0.2rem;
	}
	.stage-label {
		font-size: 0.8rem;
		white-space: nowrap;
	}
	.stage-time {
		font-size: 0.7rem;
		opacity: 0.7;
	}
	.stage-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 0.3rem;
		background: #fff8;
		border-radius: 0 0 0.5rem 0.5rem;
		transition: width 0.2s;
	}
	.plan-progress {
		font-size: 0.95rem;
		margin-top: 0.2rem;
	}
</style>
