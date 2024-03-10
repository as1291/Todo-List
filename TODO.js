const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const { title } = require('process');
const port = 3009;
app.use(bodyParser.json());
app.use(cors());


const filePath = path.join(__dirname, 'todos.json');

app.get("/todo", (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        } else {
            res.json(JSON.parse(data));
        }
    })
});

app.post("/todo", (req, res) => {

    //read from user
    let todoin = req.body;
    const id = Math.floor(Math.random() * (10000));

    //create class for user input
    const newTodo = {
        id: id,
        title: todoin.title,
        description: todoin.description
    };

    //reading file
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.log("error in reading");
            res.sendStatus(500);
            return;
        }
        var dataTodo=[]
        dataTodo = JSON.parse(data);
        dataTodo.push(newTodo);
        fs.writeFile(filePath, JSON.stringify(dataTodo), "utf-8", (err) => {
            if (err) {
                res.status(400).send("not valid user input");
            } else {
                console.log("Task added");
                res.status(200).send("task updated");
            }
        })
    });

    
    // res.sendStatus(200);
});



app.get("/todo/:id",(req,res)=>{
    fs.readFile(filePath, "utf-8", (err,data)=>{
        if (err) {
            throw err;
        }else{
            const todos = JSON.parse(data);
            const index = (findIndex(todos,parseInt(req.params.id)));
            if(index===-1) res.status(200);
            else res.send(todos[index]);
        }
    });
});

app.put("/todo/:id", (req, res) => {
    fs.readFile(filePath, "utf-8", (err,data)=>{
        if(err) throw err;
        let dataTodo = JSON.parse(data);
        const index = findIndex(dataTodo, parseInt(req.params.id));
        if (index===-1) throw err;
        
        dataTodo[index] = {
            id: dataTodo[index].id,
            title: req.body.title,
            description: req.body.description
        };
        fs.writeFile(filePath,JSON.stringify(dataTodo),(err)=>{
            if(err) throw err;
            else console.log("task updated");
            res.status(200).send(dataTodo[index]);
        })
    })
})

app.delete("/todo/:id", (req, res) => {
    fs.readFile(filePath, "utf-8", (err,data)=>{
        if(err) throw err;
        let dataTodo = JSON.parse(data);
        const index = findIndex(dataTodo,parseInt(req.params.id));
        if(index===-1) throw err;
        dataTodo.splice(index,1);
        fs.writeFile(filePath,JSON.stringify(dataTodo),(err)=>{
            if (err) {
                throw err;
            }
            res.status(200).send("task deleted");
        })
    })
});

function findIndex(todo,id) {
    for (let i = 0; i < todo.length; i++) {
        if (todo[i].id===id) {
            return i;
        }
    }
    return -1;
}

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"todo.html"));  
  })


app.listen(3009, () => {
    console.log(`listening to ${port}`);
});