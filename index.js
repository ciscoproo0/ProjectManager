const express = require('express');
const fs = require('fs');

const server = express();

server.use(express.json());

//global middleware to count number of requisitions in the app
server.use((req, res, next)=>{
    
    console.count("request numbers");

    next();
})

//middleware to verify ID
function verifyID(req, res, next){

    const {id} = req.params;
    const project = projects.filter(proj=> proj.id === id);
    
    if(!project.id){
        return res.status(400).json({error: "ID not found"})
    };
    
    return next();
}

//Array of projects, for study purpose, I'll not use a DB
const projects=[
    {
        id: "1",
        title: "Starter project",
        tasks: ["Create test project", "add another project"
        ]
    },
    {
        id: "2",
        title: "Second project",
        tasks: ["Create a third"]
        
    }
];


//CRUD
server.post('/projects/', (req,res)=>{
    const {id, title} = req.body;

    projects.push({id, title})

    return res.json(projects);

})

server.post('/projects/:id/tasks', verifyID, (req,res)=>{
    const {tasks} = req.body;
    const {id}= req.params;

    const project = projects.find(proj => proj.id === id);

    //after project being filtered by id, projects push project with the index get on line above
    projects[projects.indexOf(project)].tasks.push(tasks);
    
    return res.json(projects);
})

server.get('/projects', (req,res)=>{return res.json(projects)});

server.put('/projects/:id', verifyID,(req,res)=>{
    const {id} = req.params;
    const {title} = req.body;

    projects.find(project => project.id === id).title = title;

    return res.json(projects);
})

server.delete('/projects/:id', verifyID,(req,res)=>{
    const {id} = req.params;

    const project = projects.find(project=>project.id === id)

    //indexOf to find the index of the object returned above
    projects.splice(projects.indexOf(project), 1);

    return res.json(projects);
})

const port = 3000


server.listen(port);
console.log(`Server listen on port ${port}`);