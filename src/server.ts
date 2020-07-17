import 'reflect-metadata';
import dotEnv from 'dotenv';
import App from './app';

// initialize configuration
dotEnv.config();

// start app
const app = new App();
app.listen();

// if something crashes last fetch here
process.on('uncaughtException', (error: Error) => {
    console.error(`FATAL: ${error.message}`);
});
