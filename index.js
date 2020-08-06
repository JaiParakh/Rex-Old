const fs = require('fs');
var argv = require('yargs').argv;
//const auth = require('./Auth');
const CreateMail = require('./gmail/createMail');
const Filter = require('./gmail/Filter');
const Drive = require('./drive/Drive');
const Event = require('./calendar/Calendar')
const Todo = require('./Todos/Todo');
const Application = require('./applications/Application');
const Check = require('./gmail/check');

//console.log(argv._[0]);

var dem;
switch(argv._[0]){
    case 'check':
        dem = new Check(auth)
        if(argv._[1] === 'Medium'){
            dem.checkForMediumMails();
        }
        else if(argv._[1] === 'College'){
            let data = fs.readFileSync('astrek.json');
            let arr = [];
            arr = JSON.parse(data);
            var fil = new Filter();
            arr.forEach(e => {
                fil.filter_date(e);
            });
            /*dem.checkForCollegeMails().then(res => {
                if(res.length > 0){
                    let dates = []
                    //console.log(res)
                    res.forEach(e => {
                        let filt = new Filter()
                        dates.push(filt.filter_date(e))
                    });
                    let event = new Event()
                    dates.forEach(date => {
                        let end_date = date.d
                        event.addEvent(date.mail.body, date.mail.subject, date.d, new Date(date.d.getDate()+1));
                    })
                }
                else{
                    console.log("Still no updates from the Jedi Council!")
                }
            })*/
        }
        else{
            console.log("Invalid Input.");    
        }
        break;
    case 'draft':
        dem = new CreateMail(auth);
        dem.makeBody('draft', argv._[1], argv.sub);
        break;
    case 'mail':
        dem = new CreateMail(auth);
        dem.makeBody('mail', argv._[1], argv.sub, argv.body);
        break;
    case 'drive':
        dem = new Drive(auth, argv._[1], argv.fileName, argv.save, argv._[2]);
        break;
    case 'todo':
        dem = new Todo(argv);
        break;
    case 'app':
        let q = argv._[1];
        //console.log(q)
        dem = new Application();
        if(q === 'update'){
            //console.log(argv)
            let d = Object.keys(argv)[1];
            //console.log(d)
            dem.update(argv._[2], d, argv[d]);
        }
        else if(q === 'add'){
            let obj = argv;
            dem.addApplication(argv.name, argv.pos, argv.pack, argv.type, argv.status, argv._[2], argv.url);
        }
        else if(q === 'list'){
            dem.listAll();
        }
        else{
            console.log("Invalid Application Input.");
        }
        break;
    case 'event':
        console.log("Coming in the next update!");
        break;
    default:
        console.log("Invalid Argument");
}
/*
Rex draft sender --subject="" 
Rex mail sender --subject="" --body="" --attat=""
Rex drive share sm / Rex drive upload filename / Rex drive download filename
Rex todo list / Rex todo add --title="" --body="" / Rex todo delete id / Rex todo update id --attr="value" / Rex todo list --id="" / Rex todo search --subject="val"
Rex app add --name="" --pos="" --pack="" --type="" --status="" linkedIn/Internshala / Rex application update id --attr="val"
Rex Event add args..
*/
