import uuid from 'uuid.v4'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import fs from 'fs'

import { read_file, write_to_file,remove_file,
        get_token,check_token,read_any_file,
        write_to_any_file } from "../api/api.js";

import uuidV4 from 'uuid.v4';
dotenv.config()
const Controller = {
    REGISTER: async(req,res) => {
        let users = read_file('users.json')   
        let regUser = req.body     
        let UserIsExists = users.find(user => user.username == regUser.username)
        let existBool = false 
        if(UserIsExists){
            remove_file(regUser.avatar_name)
            return res.send(JSON.stringify({
                registered: false,
                msg: `${regUser.username} is exists!!!`
            }))
        }else{

            if(regUser.password.length<8){
                remove_file(regUser.avatar_name)
                return res.send(JSON.stringify({
                    registered: false,
                    msg: 'lenght of pass mast be not short then 8 symbols!!!'}))
            }else{

                let salt =  await bcrypt.genSalt(8) 

                let hashPsw = await bcrypt.hash(regUser.password,salt)
    
                users.push({
                    id: uuid(),
                    username: regUser.username,
                    password: hashPsw,
                    avatar_name: regUser.avatar_name
                })
                write_to_file('users.json',users)
                return res.send(JSON.stringify({
                    registered: true
                }))
            }
            
        }
    },
    LOGIN: (req,res) => {
        let logData = req.body

        let findUser = read_file('users.json').find(user => user.username == logData.username)
        if(findUser){
            if(bcrypt.compare(logData.password,findUser.password)){
                let token = get_token(findUser.username,findUser.avatar_name,findUser.id)

                return res.send(JSON.stringify({
                    'login': true,
                    'token': token
                }))
            }else{
                return res.send(JSON.stringify({
                    login: false,
                    msg: 'password is not correct!'
                }))

            }
        }else{
            return res.send(JSON.stringify({
                login: false,
                msg: 'username is not correct!'
            }))

        }
    },
    GET_INFO: (_,res) => {
        let users = read_file('users.json')
        return res.send(JSON.stringify({
            users
        }))
    },
    CHECK_TOKEN: (req,res) => {

        let token_status = JSON.parse(check_token(req.body.token))       

        if(token_status.username){
            return res.send(JSON.stringify({
                registered_user: token_status.username,
                avatar_name: token_status.img,
                user_id: token_status.user_id
            }))
        }else{
            return res.send(JSON.stringify({
                registered_user: false
            }))
        }

    },
    UPLOAD_VIDEO: (req,res) => {
        let date = new Date().toJSON().slice(0, 16);
        let crData = req.body
        let exName = req.file.originalname.split('.').at(-1)

        let videos_list = read_any_file('./model/videos_list/videos_list.json')
        let file_name = uuidV4()+'.'+exName      
        fs.writeFileSync(`./model/upload_files/videos/${file_name}`,req.file.buffer)
  
        videos_list.push({
            id: file_name,
            title: crData.title,
            username: crData.username,
            size: Math.round((req.file.size)/1025/1025)+' MB',
            created_date: date.replace('T','|'),
            userId: crData.user_id,
            user_avatar: crData.avatar_name

        })

        write_to_any_file('./model/videos_list/videos_list.json',videos_list)
        res.send('video adedd!')
    },
    ADMIN_PAGE_RENDER: (req,res) => {
        
        let admin_videos = read_any_file('./model/videos_list/videos_list.json').filter(video => video.userId == req.body.user_id)
        
        return res.send(JSON.stringify({
            admin_videos
        }))
    },
    DELETE_VIDEO: (req,res) => {

        let videos_list = read_any_file('./model/videos_list/videos_list.json') 
        videos_list.forEach((vid, inx) => {
            if(vid.id == req.params.id){
                videos_list.splice(inx,1)
                console.log(videos_list);
            }
        });
        write_to_any_file('./model/videos_list/videos_list.json', videos_list)
        return res.send( JSON.stringify({
            msg: 'video deleted!'
    }))
    }
}

export  {Controller}