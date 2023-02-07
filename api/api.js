import fs from 'fs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function read_file(file_name){

    return JSON.parse(fs.readFileSync(`./model/users/${file_name}`))
}

function read_any_file(file_rout){
    return JSON.parse(fs.readFileSync(`${file_rout}`))
}

function write_to_file(file_name,data){
    fs.writeFile(`./model/users/${file_name}`,JSON.stringify(data,null,4), err =>{
        if(err) throw err
        console.log(`info was written to ${file_name}`);
    })
}

function write_to_any_file(file_rout,data){
    fs.writeFile(`${file_rout}`,JSON.stringify(data,null,4), err =>{
        if(err) throw err
        console.log(`info was written to ${file_rout}`);
    })
}


function remove_file(file_name){
    fs.unlink(`./model/upload_files/avatars/${file_name}`, (err) => {
        if(err) throw err
        console.log('file is removed!');
    })
}


function get_token(username,avatar_name){
    let token = jwt.sign({name: `${username}`, avatar_name: `${avatar_name}`},process.env.SECRET_KEY,{
        expiresIn: '2h'
    })
    return token
}

function check_token(token){
    try {
        let tok =  jwt.verify(token,process.env.SECRET_KEY)

        return {username: tok.name, img: tok.avatar_name}       
    } catch (error) {
        console.log('Token is not actual!!!'); 
        return {username: false}   
    }
}

export {
    read_file,
    write_to_file,
    remove_file,
    get_token,
    check_token,
    read_any_file,
    write_to_any_file
}