import express from "express";
import sirv from 'sirv';
import { existsSync, fstat } from 'fs'

const app = express();
const port = 3001;

async function start() {
  if (existsSync("../svelte/build/handler.js") && process.env.NODE_ENV == "Production") {
    let { handler } = await import("../../svelte/build/handler.js")
    app.use(handler);
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

}

start();