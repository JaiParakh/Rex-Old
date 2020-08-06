var fs = require('fs');
const chalk = require('chalk');
const table = require('table');

class Todo {

    constructor(arg){
        let data = fs.readFileSync('Todos.json');
        this.arr = JSON.parse(data);
        this.arg = arg;
        this.parseInput();
    }

    parseInput(){
        switch(this.arg._[1]){
            case 'list':
                this.listAll();
                break;
            case 'add':
                this.addTodo(this.arg.title, this.arg.body)
                break;
            case 'delete':
                this.deleteTodo(this.arg._[2]);
                break;
            case 'update':
                let key = Object.keys(this.arg[1]);
                this.update(this.arg._[2], key, this.arg[key]);
                break;
            default:
                console.log("Invalid Todo");
        }
    }

    addTodo(subject, task){
        let todo = {
            subject: subject,
            task: task,
            status: 'Incomplete'
        }
        fs.writeFileSync('todos.js', JSON.stringify(this.arr.push(todo)))        
    }
    
    search(attribute, value){
        let res = this.arr.filter(e => e[attribute] === value);
        this.print(res);
    }

    deleteTodo(id){
        this.arr.splice(id-1,1);
        fs.writeFileSync('todos.js', JSON.stringify(this.arr.push(this.arr))) 
    }

    update(id, attribute, value){
        if(attribute === 'Completed'){
            this.deleteTodo(id);
        }
        else{
            this.arr[id-1][attribute] = value;
        }
    }

    listAll(){
        this.print(this.arr);
    }

    fetch(id){
        this.print(id);
    }

    print(array){
        data = [];
        data.push(['Id', 'Subject', 'Body']);
        data[0].forEach(e => chalk.bold(e));
        array.forEach((e) => {
            data.push(Object.values(e));
        });

        const config = {
            singleLine: true,
        };
          
        const output = table(data, config);
        console.log(output);
    }
}

module.exports = Todo;