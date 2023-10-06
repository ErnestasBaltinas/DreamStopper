# DreamStopper

Prevents free plan servers from going to sleep using npm package [node-schedule](https://www.npmjs.com/package/node-schedule).
App pings target every 10 minutes.

## Usage & Environment Variables

`.env` File is used for defining the target to wake up

```bash
PORT=4000 // any port is fine
URL=http://localhost:4000/api/ping
```
