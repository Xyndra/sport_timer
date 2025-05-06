import type { RequestHandler } from '@sveltejs/kit';

let startTime: number | null = null;
const TIMER_DURATION = 225; // seconds (3:45)

export const GET: RequestHandler = async () => {
	// If timer hasn't started, start it now
	if (!startTime) {
		startTime = Math.floor(Date.now() / 1000); // seconds since epoch
	}
	return new Response(JSON.stringify({ startTime, duration: TIMER_DURATION }), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
	});
};

// Optional: POST to reset/start the timer
export const POST: RequestHandler = async () => {
	startTime = Math.floor(Date.now() / 1000);
	return new Response(JSON.stringify({ startTime, duration: TIMER_DURATION }), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
	});
};
