const {google} = require('googleapis');
const mailComposer = require('nodemailer/lib/mail-composer');
	
class CreateMail{

  	constructor(auth){
  		this.me = 'jaiparakh.kota.10@gmail.com';
		this.auth = auth;
		this.gmail = google.gmail({version: 'v1', auth});
	}

	makeBody(task, to, sub, body='', attachmentSrc=null){
		var arr = [];
		if(attachmentSrc !== null){
			for(var i=0;i<this.attachment.attachment.length;i++){
				arr[i] = {
					path: this.attachment[i],
					encoding: 'base64'
				}
			}
		}

		if(attachmentSrc !== null){
			let mail = new mailComposer({
				to: to,
				text: body,
				subject: sub,
				textEncoding: "base64",
				attachments: arr
			});	
		}
		else{
			let mail = new mailComposer({
				to: to,
				text: body,
				subject: sub,
				textEncoding: "base64"
			});
		}
		
		mail.compile().build((err, msg) => {
			if (err){
				return console.log('Error compiling email ' + error);
			} 
		
			const encodedMessage = Buffer.from(msg)
			  .toString('base64')
			  .replace(/\+/g, '-')
			  .replace(/\//g, '_')
			  .replace(/=+$/, '');
			
			if(task === 'mail'){
				this.sendMail(encodedMessage);
			}
			else{
				this.saveDraft(encodedMessage);
			}
		});
	}

    sendMail(encodedMessage){
		this.gmail.users.messages.send({
			userId: this.me,
			resource: {
				raw: encodedMessage,
			}
		}, (err, result) => {
			if(err){
				return console.log('NODEMAILER - The API returned an error: ' + err);
			}
				
			console.log("NODEMAILER - Sending email reply from server:", result.data);
		});
    }

    saveDraft(encodedMessage){
		this.gmail.users.drafts.create({
			'userId': this.me,
			'resource': {
			  'message': {
				'raw': encodedMessage
			  }
			}
		})
    }

    deleteDraft(id){
		this.attachment.gmail.users.drafts.delete({
			id: id,
			userId: this.me 
		});
    }

    listAllDrafts(){
        this.gmail.users.drafts.list({
            userId: this.me
        }, (err, res) => {
        	if(err){
            	console.log(err);
        	}
			else{
				console.log(res.data);
			}
    	});
    }
}

module.exports = CreateMail;

