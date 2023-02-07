
import express from 'express'
import multer from 'multer'
import path from 'path'

import {Controller} from '../controller/controller.js'

let router = express.Router()

const storage = multer.diskStorage({
    destination: (req,file,cb) => {

        cb(null, 'model/upload_files/avatars')
    },
    filename: (req,file, cb) => {
       let avatar_name = Date.now() + path.extname(file.originalname)
        cb(null, avatar_name)
        req.body.avatar_name = avatar_name
    }
})
const upload = multer({storage: storage})


const upload2 = multer()


router
      .post('/register',upload.single('file'),Controller.REGISTER)
      .post('/login',Controller.LOGIN)
      .post('/get_info',Controller.GET_INFO)
      .post('/check_token', Controller.CHECK_TOKEN)
      .post('/upload_video',upload2.single("video"),Controller.UPLOAD_VIDEO )
    


export {router}
