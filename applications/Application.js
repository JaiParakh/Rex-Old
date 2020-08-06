var fs = require('fs');
const chalk = require('chalk');
const table = require('table');
//console.log(table)
//import { table } from 'table'

class Application{

    constructor(){
        let data = fs.readFileSync('applications.json');
        this.arr = JSON.parse(data);
        //this.arr = []
        //console.log(this.arr);
    }

    addApplication(company_name, position, pack, type, status, platform, company_url='', dashboard_url='', interviewDate='',testDate=''){
        let app = {
            company_name,
            position,
            pack,
            type,
            status,
            platform,
            company_url,
            dashboard_url,
            interviewDate,
            testDate        
        }
        console.log(app);
        this.arr.push(app)
        fs.writeFileSync('applications.json',JSON.stringify(this.arr));
        console.log("Application Added!");
        
        if(status === 'rejected'){
            console.log("If Ewoks can defeat the Empire, you can get a job too.");
            console.log("The Force will be with you always!");
        }else{
            console.log("May the Force Be with You!!");
        }
    }

    search(attribute, value){
        let res = this.arr.filter(e => e[attribute] === value);
        this.print(res);
    }

    listAll(){
        this.print(this.arr);
    }

    update(id, attribute, value){
        this.arr[id-1][attribute] = value;
        if(attribute === 'status' && value === "rejected"){
            console.log("If Ewoks can defeat the Empire, you can get a job too.");
            console.log("The Force will be with you always!");
        }else{
            console.log("May the Force Be with You!!");
        }
        fs.writeFileSync('applications.json',JSON.stringify(this.arr));
    }

    fetch(id){
        this.print(id);
    }

    print(array){
        var data = [];
        data.push(['Company_name', 'Position', 'Package', 'Type', 'Status', 'Platform', 'Company Url', 'Dashboar Url', 'InterviewDate','TestDate']);
        data.push(['','','','','','','','','',''])
        data[0].forEach(e => chalk.bold(e));
        //console.log(this.arr)
        this.arr.forEach((e) => {
            data.push(Object.values(e));
        });
        //console.log(data)
        const config = {
            singleLine: true,
        };
          
        const output = table.table(data, config);
        console.log(output);
    }

}

module.exports = Application;