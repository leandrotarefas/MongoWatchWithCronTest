const uri = "mongodb+srv://user:senha@hostname";

import Cron from 'cron';

import express from 'express';

import pkg from 'mongodb-legacy';
const { MongoClient } = pkg;

const app = express();
const port = 3000;
const client = new MongoClient(uri, { useNewUrlParser: true });
const db = client.db("db_projetos");
const collection = db.collection('testWatch');

client.connect(err => {  
  console.log("Conectado ao banco de dados MongoDB!");
});

const jobsMap = new Map();


collection.find({}).toArray(function(err, results) {
  if (err) throw err;

  for (const result of results) {

    const {_id, cron, message} = result;

    const task = new Cron.CronJob(cron, () => {
      console.log(`${_id} => ${message}`);
    });
    
    jobsMap.set(_id, task);

    jobsMap.get(_id).start();

  }  

  console.log("Jobs carregados e inciados!\n");

});

const changeStream = collection.watch();
changeStream.on("change", event =>{

  const { operationType} = event;

  if("insert" == operationType){

    const { documentKey : { _id }, fullDocument : { cron, message} } = event;

    //cria uma task com base nos parametros
    const task = new Cron.CronJob(cron, () => {
      console.log(`${_id} => ${message}`);
    });
    
    //adiciona novo job na lista
    jobsMap.set(_id, task);

    //inicia novo job
    jobsMap.get(_id).start();

    console.log(`Job ${_id} adicionado na lista!\n`)

  }

  if("update" == operationType){

    const { documentKey : { _id } } = event;

    collection.findOne({_id})
      .then(result => {
        
        const {cron, message} = result;

        //para o job atual
        jobsMap.get(_id).stop();

        //cria uma task com base nos parametros
        const task = new Cron.CronJob(cron, () => {
          console.log(`${_id} => ${message}`);
        });
        
        //configura novo job na lista
        jobsMap.set(_id, task);

        //inicia novo job
        jobsMap.get(_id).start();


        console.log(`Job ${_id} atualizado na lista!\n`)
      })
      .catch(error => {
        console.log(error);
      });
  }


  if("delete" == operationType){

    const { documentKey : { _id } } = event;

    collection.deleteOne({_id})

    .then(result => {

      //para o job atual
      jobsMap.get(_id).stop();
      
      //configura novo job na lista
      jobsMap.delete(_id);

      console.log(`Job ${_id} removido da lista!\n`)
    })
    .catch(error => {
      console.log(error);
    });
  }

  if("drop" == operationType){

    console.log("watch para 'drop' nao implementado!")

  }

})


app.listen(port, () => {
  console.log(`Servico rodando na porta ${port}`);
});



