import express from "express";
import fs from 'fs'
import router from './routes'

const app = express();
const port = 3001;


export default function start() {

  
  if (fs.existsSync("../svelte/build/handler.mjs") && process.env.NODE_ENV == "production") {
    // @ts-expect-error
    import("../../svelte/build/handler.mjs").then(({ handler }) => {
      app.use(handler);
    })
  }

  app.use("/routes", router)

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
start();