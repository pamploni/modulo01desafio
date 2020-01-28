const express = require('express');

const server = express();


server.use(express.json());

//classe
class project {
  

  constructor(id,title,tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
};


var totalReq = 0;

const projects = [
  {id:1, title: "App 1", tasks:["abrir", "fechar","concluir"]},
  {id:2, title: "App 2", tasks:["abrir2", "fechar2","concluir2"]},
  {id:4, title: "App 4", tasks:["abrir4", "fechar4","concluir4"]},
  
];

//middleware: para interceptar o acesso a qualquer rota e executar uma rotina
server.use('/projects/', (req,res, next) => {
  console.time('Request');
  
  console.log(`Método: ${req.method};  URL: ${req.url}`);

  totalReq += 1;
  next();
  console.timeEnd('Request');

  console.log(`Total Requisições: ${totalReq}`);
});

function checkUserInArray(req, res, next) {
  if (!projects.find(o => o.id == req.params.id)){
      return res.status(400).json({error: 'Usuario nao Existe.'})
  }

  return next();
}

//rotas
//todos os itens
server.get('/projects', (req,res) => {
  
  return res.json(projects);
});

//item pelo id
server.get('/projects/:index', (req,res) => {
  const { index } = req.params;
  console.log(index);

  obj = projects.find(o => o.id == index);
  
  return res.json(obj);
});

//adicionar novo item
server.post('/projects', (req,res) => {
  const { project } = req.body;

  projects.push(project);
  
  return res.json(projects);
    
  
});


server.post('/projects/:id/tasks', checkUserInArray, (req,res) => {
  const { id } = req.params;
  const {title} = req.body;

  idx = projects.findIndex(o => o.id == id);

  projects[idx].tasks.push(title);
  console.log(`Usuario retornado: ${id} `);


  return res.json(projects);
    
  
});

//alterar item
server.put('/projects/:id', (req,res) => {
  const { id } = req.params;
  const { project } = req.body;

  console.log(project);

  idx = projects.findIndex(o => o.id == id);
  console.log(idx);

  projects[idx] = project;
  
  return res.json(projects);
    
  
});

server.delete('/projects/:id', checkUserInArray, (req,res) => {
  const { id } = req.params;

  idx = projects.findIndex(o => o.id == id);

  projects.splice(idx,1);

  return res.json(projects);
});



server.listen(4001);