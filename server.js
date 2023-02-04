import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import multer from 'multer'

import {router} from './router/router.js'
dotenv.config()




const port = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
// app.use(multer)
app.use(router)


app.listen(port, () => {
    console.log(`${port} is running!!!`);
})



