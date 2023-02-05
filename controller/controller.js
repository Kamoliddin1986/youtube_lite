import uuid from 'uuid.v4'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

import { read_file, write_to_file,remove_file } from "../api/api.js";
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
            }
            
        }
    }
}

export  {Controller}