import fs from 'fs'

function read_file(file_name){

    return JSON.parse(fs.readFileSync(`./model/users/${file_name}`))
}

function write_to_file(file_name,data){
    fs.writeFile(`./model/users/${file_name}`,JSON.stringify(data,null,4), err =>{
        if(err) throw err
        console.log(`info was written to ${file_name}`);
    })
}

function remove_file(file_name){
    fs.unlink(`./model/upload_files/avatars/${file_name}`, (err) => {
        if(err) throw err
        console.log('file is removed!');
    })
}

export {
    read_file,
    write_to_file,
    remove_file
}