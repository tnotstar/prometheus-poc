import onHeaders from 'on-headers';
import express from 'express';
import { Summary, Counter, register, collectDefaultMetrics } from 'prom-client';

export const metricsMiddleware = async (_, res) => {
	res.set('Content-Type', register.contentType);
	const metrics = await register.metrics();
	res.status(200).end(metrics);
};

const requests = new Counter({
	name: 'requests',
	help: 'Requests made',
	labelNames: ['method'],
});

const responsesTimes = new Summary({
	name: 'responses_times',
	help: 'Response times in milliseconds',
	labelNames: ['status'],
});

export async function setup(config) {
	collectDefaultMetrics();
	const server = express();
	server.get('/metrics', metricsMiddleware);
	server.listen(config?.port || 9303, '0.0.0.0');
}

export default async (req, res, next) => {
	var startAt = process.hrtime();
	const { method } = req;
	requests.inc({ method });
	onHeaders(res, function onHeaders() {
		var diff = process.hrtime(startAt);
		var time = diff[0] * 1e3 + diff[1] * 1e-6;
		const labels = [res.statusCode];
		responsesTimes.labels(...labels).observe(time);
	});
	next();
};