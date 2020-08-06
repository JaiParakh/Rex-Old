const {google} = require('googleapis');
var base64 = require('js-base64').Base64;
const cheerio = require('cheerio');
var open = require('open');
var Mailparser = require('mailparser').MailParser;

class Check{

    constructor(auth){
        this.me = 'jaiparakh.kota.10@gmail.com';
        this.gmail = google.gmail({version: 'v1', auth});
        this.auth = auth;
        this.mailArr = [];
    }

    checkInbox(){
        this.gmail.users.messages.list({
            userId: this.me
        }, (err, res) => {
            if(!err){
                console.log(res.data);
            }
            else{
                console.log(err);
            }
        })
    }

    checkForMediumMails(){
        var query = "from:noreply@medium.com is:unread";
        this.gmail.users.messages.list({
            userId: this.me,
            q: query 
        }, (err, res) => {
            if(!err){
                var mails = res.data.messages;
                console.log(mails[0])
                mails.forEach(m => {
                    console.log(m.id);
                    this.getMail(m.id);
                })
            }
            else{
                console.log(err);
            }
        });        
    }

    async checkForCollegeMails(){
        var query = "from:anitamarwaha.tnp@gmail.com";
        const res = await this.gmail.users.messages.list({
            userId: this.me,
            q: query 
        });     
        var mails = res.data.messages;
        console.log("ooo");
        mails = mails.filter((value,index,arr) => {
            return value.id !== '170d30b403941e9e';
        })
        //console.log(mails)
        const data = await Promise.all(mails.map(async m => {
            
            try{
                const jh = await this.getMail(m.id);
                //console.log("kk")
                return jh;
            }catch(err){
                //console.log(err)
            }
            
        }));
        console.log("iii");
        return data;
    }

    async getMail(msgId){
        try{
            let res = await this.gmail.users.messages.get({
                'userId': this.me,
                'id': msgId
            });
            console.log(res.data.payload.headers.find(r => r.name === 'From').value.match(/^(.*?)</)[1].trim())
            console.log(res.data.payload.mimeType);
            //console.log(base64.decode(res.data.payload.body));
            var body;
            if(res.data.payload.mimeType === 'multipart/mixed'){
                //console.log(res.data.payload.parts[0])
                body = base64.decode(res.data.payload.parts[0].parts[0].body.data)
                //console.log(body)
            }
            else if(res.data.payload.mimeType === 'text/html'){
                let b = base64.decode(res.data.payload.body.data);
                //console.log(b)
                b = b.replace(/<.*>/g, '')
                //console.log(b.match(/Modern Server Side Rendering with React and Next.JS/));
            }
            else if(res.data.payload.mimeType === 'text/plain'){
                body = base64.decode(res.data.payload.body.data);
            }
            else{
                body = base64.decode(res.data.payload.parts[0].body.data)
                //console.log(body)
            }
            
            let {name, value} = res.data.payload.headers.find((head) => {
                if(head.name==="Subject"){
                    return true;
                }
            });
            var obj = {
                id: msgId,
                subject: value,
                body: body
            }
            //console.log("Yo");
            //return obj;
        }catch(err){
            console.log(err)
            console.log(msgId)
            //console.log("Yo00000000000000000000000");
        }
        
    }

}

module.exports = Check;