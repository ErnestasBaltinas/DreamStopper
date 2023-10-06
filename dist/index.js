'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const node_schedule_1 = __importDefault(require('node-schedule'));
const axios_1 = __importDefault(require('axios'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const targetUrl = process.env.URL;
let stoppedDreams = 0;
let stoppedDreamsInARow = 0;
app.use(express_1.default.static('public'));
app.get('/', function (req, res) {
	res.send('Ready to stop some Dreams');
});
const stopDreams = () => {
	serverSay('Starting to interrupt Dreams');
	const rule = new node_schedule_1.default.RecurrenceRule();
	rule.minute = [0, 10, 20, 30, 40, 50];
	rule.second = 0;
	node_schedule_1.default.scheduleJob(rule, () => {
		if (targetUrl) {
			wakeUpCall(targetUrl);
		} else {
			serverSay('.env is missing URL property');
		}
	});
};
const wakeUpCall = (target) => {
	if (targetUrl) {
		axios_1.default
			.get(target)
			.then(({ status }) => {
				if (status === 200) {
					stoppedDreams += 1;
					stoppedDreamsInARow += 1;
					serverSay(
						`Got'em 😀 Stopped Dreams in a row: ${stoppedDreamsInARow}, and total Dreams stopped: ${stoppedDreams}`
					);
				} else {
					serverSay(`Something went wrong 😥`);
				}
			})
			.catch((error) => {
				if (axios_1.default.isAxiosError(error)) {
					serverSay(`Bad news: ${error.message} 😥`);
				} else {
					serverSay('Bad news: An unexpected error occurred 😥');
				}
			})
			.finally(() => {
				stoppedDreamsInARow = 0;
			});
	}
};
const serverSay = (msg) => {
	console.log(`⚡️[DreamStopper]: ${msg}`);
};
app.listen(port, () => {
	serverSay(`Server is running at PORT: ${port} < JS2`);
	console.log('---------------------------------------------');
	stopDreams();
});
