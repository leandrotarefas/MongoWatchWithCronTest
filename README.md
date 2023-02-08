# MongoWatchWithCronTest
MongoWatch With Cron Test

Queries para test:

//limpar a base
db.testWatch.drop()


//com a app no ar acompanhar o log

//inserir um registro
//  antes: a aplicacao vai carregar no momento que subir
//  depois: a aplicacao vai criar uma tarefa 

db.testWatch.insert({
    "_id":"a123456",
    "cron": "*/2 * * * * *",
    "message": "Executando alguma coisa a cada 2 seg..."
})

//caso queria consultar
db.testWatch.find({})

//atualizar o registro 
db.testWatch.update({ _id: "a123456" }, {
    $set: {
        "cron": "*/1 * * * * *",
        "message": "Executando alguma coisa a cada 1 seg..."
    }
})
   
//inserir mais um registro   
db.getCollection("testWatch").insert({
    "_id":"a456781",
    "cron": "*/2 * * * * *",
    "message": "Executando alguma coisa a cada 2 seg..."
});

//apagar um registro   
db.testWatch.deleteOne({_id:"a123456"})
