const fs = require('fs');
const Check = require('./check');
const Event = require('./../calendar/Calendar');

class Filter{

    constructor(){
        //this.filter_content();
        this.tokens = ["internship","intern","hackathon","hack","list","shortlist","test","registration","report"];
    }

    firstTimeSetup(){
        let che = new Check();
        che.checkForCollegeMails().then(arr => {
            arr.forEach(e => {
                e.body = e.body.split('\r\n').join('');
            })
            
            var regex = /\*(.*?)\*/g;
            arr.forEach(e => {
                e.body = e.body.match(regex);
            });
            
            var strToMatch = arr[0].body;
            fs.writeFileSync('astrek.json',JSON.stringify(arr));
        })
    }

    filter_date(mail){
        if(mail.body !== null && /\*Kind*/.test(mail.body[0])){
            mail.body.shift();
        }
        /*2020*/
        
        if(mail.body !== null){
            mail.body.forEach((f, i) => {
                if(f.includes('2020')){
                    mail.event = mail.body.slice(i,i+3);
                    return;
                }
            })
            if(mail.event === undefined){
                mail.event = null;
            }
        }

        let repl = ['th','rd','nd','on','st','.'];
        var reg = /(th|rd|nd|on|st)/g

        
        let event = mail.event;
        if(event != null){
            //For Date.
            let i = event[0].indexOf(':');
            mail.event[0] = event[0].replace(/\*/g,'');
            mail.event[0] = event[0].replace(reg,'');
            mail.event[0] = event[0].replace(reg,'');
            mail.event[0] = event[0].replace(reg,'');
            mail.event[0] = event[0].substring(i+1);

            if(mail.event.length === 1){
                mail.event = null;
            }

            if(mail.event !== null){
                //console.log(e.event);
                let d = new Date(mail.event[0]).toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });
                console.log(d)
                if(d != "Invalid Date"){
                    console.log(d);
                    let e = new Event();
                    e.addEvent(mail.body, mail.subject, d, new Date(d.getDate()+1))
                    return {
                        mail,
                        d
                    };
                }			
                console.log("---");
            }
        }
        
    }

}

module.exports = Filter;