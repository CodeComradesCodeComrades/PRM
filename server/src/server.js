import express from "express";
import fs from 'fs'


const app = express();
const port = 3001;


export default function start() {
  if (fs.existsSync("../svelte/build/handler.mjs") && process.env.NODE_ENV == "production") {
    import("../../svelte/build/handler.mjs").then(({ handler }) => {
      app.use(handler);
    })
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
start();