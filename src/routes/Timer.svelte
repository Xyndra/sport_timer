<script lang="ts">
	import { onMount } from 'svelte';
	import { timePlans, type TimePlan } from '$lib/schedule';
	import PlanTimeline from './PlanTimeline.svelte';

	let timeLeft = $state(0);
	let duration = 225; // fallback
	let status = $state('Syncing...');
	let interval: ReturnType<typeof setInterval> | null = null;

	let startTime = 0; // seconds since epoch

	// For plan selection
	let selectedPlans = $state({ set: new Set() });
	let selectedTimePlans = $derived(timePlans.filter((plan) => selectedPlans.set.has(plan.name)));
	$inspect(selectedTimePlans);

	// Fetch timer start time from server
	async function syncWithServer() {
		status = 'Syncing...';
		try {
			const res = await fetch(`/api/timer?no_cache=${Date.now()}`, { cache: 'no-cache' });
			const data = await res.json();
			startTime = data.startTime;
			duration = data.duration;
			updateTimeLeft();
			status = 'Synced';
		} catch (e) {
			status = 'Failed to sync';
		}
	}

	function updateTimeLeft() {
		const now = Math.floor(Date.now() / 1000);
		const elapsed = now - startTime;
		timeLeft = Math.max(duration - elapsed, 0);
	}

	function formatTime(sec: number) {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		syncWithServer();
		interval = setInterval(() => {
			updateTimeLeft();
		}, 1000);

		// Optionally, re-sync with server every 3 seconds to correct drift
		const syncInterval = setInterval(syncWithServer, 3000);

		return () => {
			clearInterval(interval!);
			clearInterval(syncInterval);
		};
	});

	async function restartTimer() {
		const sure = confirm('Are you sure you want to restart the timer?');
		if (!sure) return;
		const really_sure = confirm('Are you really sure you want to restart the timer?');
		if (!really_sure) return;
		status = 'Restarting...';
		const res = await fetch('/api/timer', { method: 'POST' });
		const data = await res.json();
		startTime = data.startTime;
		duration = data.duration;
		updateTimeLeft();
		status = 'Restarted';
	}

	// Helper: get elapsed ms since timer start
	function getElapsedMs() {
		const now = Math.floor(Date.now() / 1000);
		const elapsedSec = now - startTime;
		return Math.max(elapsedSec * 1000, 0);
	}

	// For a plan, get current stage index and ms into that stage
	function getPlanStage(plan: TimePlan) {
		const elapsed = getElapsedMs();
		let acc = 0;
		for (let i = 0; i < plan.stages.length; i++) {
			const stage = plan.stages[i];
			if (elapsed < acc + stage.duration) {
				return {
					index: i,
					stage,
					stageElapsed: elapsed - acc,
					stageProgress: Math.min((elapsed - acc) / stage.duration, 1),
					totalProgress: Math.min(elapsed / getPlanTotalDuration(plan), 1)
				};
			}
			acc += stage.duration;
		}
		// Past end
		return {
			index: plan.stages.length - 1,
			stage: plan.stages[plan.stages.length - 1],
			stageElapsed: plan.stages[plan.stages.length - 1]?.duration ?? 0,
			stageProgress: 1,
			totalProgress: 1
		};
	}

	function getPlanTotalDuration(plan: TimePlan) {
		return plan.stages.reduce((a, s) => a + s.duration, 0);
	}

	function formatMs(ms: number) {
		const sec = Math.floor(ms / 1000);
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function togglePlan(name: string) {
		if (selectedPlans.set.has(name)) {
			selectedPlans.set.delete(name);
		} else {
			selectedPlans.set.add(name);
		}
		selectedPlans.set = new Set(selectedPlans.set);
	}
</script>

<div class="timer-container">
	<h2>Timer</h2>
	<div class="timer-display">{formatTime(timeLeft)}</div>
	<div class="status">{status}</div>
	<div class="plan-select">
		<h3>Pläne:</h3>
		{#each timePlans as plan}
			<label>
				<input
					type="checkbox"
					checked={selectedPlans.set.has(plan.name)}
					onchange={() => togglePlan(plan.name)}
				/>
				{plan.name}
			</label>
		{/each}
	</div>
	<div class="timeline-list">
		{#each selectedTimePlans as plan}
			<PlanTimeline {plan} {getPlanStage} {formatMs} />
		{/each}
	</div>
	<div class="button-row">
		<button onclick={restartTimer}>Restart</button>
	</div>
</div>

<style>
	.timer-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.timer-display {
		font-size: 3rem;
		font-family: monospace;
		background: #222;
		color: #fff;
		padding: 1rem 2rem;
		border-radius: 1rem;
	}
	.status {
		font-size: 1rem;
		color: #888;
	}
	.plan-select {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}
	.timeline-list {
		width: 90vw;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 1rem;
		justify-items: center;
		align-items: center;
	}
	.button-row {
		display: flex;
		gap: 1rem;
	}
	button {
		padding: 0.5rem 1.5rem;
		font-size: 1rem;
		border-radius: 0.5rem;
		border: none;
		background: #ff0000;
		color: #fff;
		cursor: pointer;
	}
	button:hover {
		background: #dd0000;
	}
</style>
