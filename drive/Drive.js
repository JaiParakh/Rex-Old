const {google} = require('googleapis');

class Drive {

    constructor(auth, action, fileName, fileSave='', person){
        this.auth = auth;
        this.drive = google.drive({version: 'v3', auth});
        this.action = action;
        this.person = person;
        this.fileName = fileName;
        this.fileSave = fileSave;
        this.perform_action()
    }

    perform_action(){
        switch(this.action){
            case 'upload':
                this.uploadFile();
                break;
            case 'share':
                this.shareFile();
                break;
            case 'download':
                this.downloadFile();
                break;
            default:
                //this.findFileId()
                console.log("Invalid Parameter");
        } 
    }

    async findFileId(){
        let res = await this.drive.files.list({
            //q: "mimeType='application/vnd.google-apps.folder'",
            q: `('jaiparakh.kota.10@gmail.com' in owners) and (name = '${this.fileName}') and (starred=true)`
        });
        return res.data.files[0].id;
    }

    shareFile(){
        var fileId, role;
        this.findFileId().then(id => {
            console.log(id);
            if(this.fileName === 'SM'){
                fileId = '1J17DggxCL4krN55b2n2NmOXVOfFMMWZw';
                role = 'reader';
            }
            else{
                fileId = id;
                //fileId = '16ghBf9nyFy_1OUSzlqzolpuXY2POPlK1gDAnBh_dFYo';
                role = 'writer';
            }
            
            var permission = {
                'type': 'user',
                'role': role,
                'emailAddress': this.person
            }
            this.drive.permissions.create({
                resource: permission,
                fileId: fileId,
                fields: 'id'
            }, (err,res) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("File Shared!");
                }
                
            })
        })
        
    }

    downloadFile(){
        const fs = require('fs');
        var fileId = '16ghBf9nyFy_1OUSzlqzolpuXY2POPlK1gDAnBh_dFYo';
        //It Stores in D-drive. (Absolute Path)
        var dest = fs.createWriteStream('/College/'+this.fileSave);
        this.drive.files.export({
            auth: this.auth,
            fileId: fileId,
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }, {responseType: 'stream'}, (err, res) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(res.data);
                res.data.on('end', () => {
                    console.log("Done")
                }).on('error', (err) => {
                    console.log(err);
                }).pipe(dest)
            }
            
        })
    }
}

module.exports = Drive;