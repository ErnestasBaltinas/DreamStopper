import express, { Express } from 'express';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
import axios, { AxiosResponse } from 'axios';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const targetUrl = process.env.URL;
let stoppedDreams = 0;
let stoppedDreamsInARow = 0;

app.use(express.static('public'));
app.get('/', function (req, res) {
	res.send('Ready to stop some Dreams');
});

const stopDreams = () => {
	serverSay('Starting to interrupt Dreams');
	const rule = new schedule.RecurrenceRule();
	rule.minute = [0, 10, 20, 30, 40, 50];
	rule.second = 0;

	schedule.scheduleJob(rule, () => {
		if (targetUrl) {
			wakeUpCall(targetUrl);
		} else {
			serverSay('.env is missing URL property');
		}
	});
};

const wakeUpCall = (target: string) => {
	if (targetUrl) {
		axios
			.get(target)
			.then(({ status }: AxiosResponse) => {
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
				if (axios.isAxiosError(error)) {
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

const serverSay = (msg: String) => {
	console.log(`⚡️[DreamStopper]: ${msg}`);
};

app.listen(port, () => {
	serverSay(`Server is running at PORT: ${port} < TS`);
	console.log('---------------------------------------------');
	stopDreams();
});
