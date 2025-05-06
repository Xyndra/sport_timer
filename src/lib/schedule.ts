export type Stage = {
	name: string;
	duration: number;
};

export type TimePlan = {
	name: string;
	stages: Stage[];
};

export const timePlans: TimePlan[] = [
	{
		name: 'Box-mix',
		stages: [
			{ name: 'Bauchhoch Boxen', duration: 60000 },
			{ name: 'Pause', duration: 30000 },
			{ name: 'Kopfhoch Boxen', duration: 60000 },
			{ name: 'Pause', duration: 30000 },
			{ name: 'Pause', duration: 45000 }
		]
	},
	{
		name: 'Bein-mix',
		stages: [
			{ name: 'Mountain Climbers', duration: 60000 },
			{ name: 'Pause', duration: 30000 },
			{ name: 'Ausfallschritte', duration: 30000 },
			{ name: 'Squats', duration: 30000 },
			{ name: 'Squat Jumps', duration: 30000 },
			{ name: 'Pause', duration: 45000 }
		]
	},
	{
		name: 'Springseil-mix',
		stages: [
			{ name: 'Normal', duration: 60000 },
			{ name: 'Pause', duration: 30000 },
			{ name: 'Linkes Bein', duration: 30000 },
			{ name: 'Rechtes Bein', duration: 30000 },
			{ name: 'Normal', duration: 30000 },
			{ name: 'Pause', duration: 45000 }
		]
	},
	{
		name: 'Bewegungs-mix',
		stages: [
			{ name: '20 (Knie-)Liegestützen', duration: 60000 },
			{ name: '10 Burpees (- Liegestützen)', duration: 60000 },
			{ name: '20 Hampelmänner', duration: 60000 },
			{ name: 'Pause', duration: 45000 }
		]
	}
];

// assert all plans have a duration of exactly 3:45 minutes
for (const timePlan of timePlans) {
	let totalDuration = 0;
	for (const stage of timePlan.stages) {
		totalDuration += stage.duration;
	}
	if (totalDuration !== 225000) {
		throw new Error(`Time plan "${timePlan.name}" has an incorrect duration`);
	}
}
