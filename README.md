# Mongo Watch With Cron Test

    A função db.collection.watch() é uma API do MongoDB que permite a você monitorar uma 
    coleção em tempo real e receber notificações de mudanças (inserções, atualizações e remoções) 
    realizadas na coleção.

        É possivel pode criar uma stream de eventos e definir uma função de callback para lidar com 
        as mudanças à medida que elas ocorrem.


    No exemplo foi utilizado um gerenciador de tarefas que é atualizado a medida em que os 
    eventos acontecem.



- Executar o Test:


1 - Adicionar url de banco de dados no index.js:

    const uri = "mongodb+srv://user:senha@hostname";


2 - Queries para test:

        -   limpar a base
                -   db.testWatch.drop()


3 - Dar "npm start" na aplicação e acompanhar o log


4 - Inserir um registro:

    *   Antes : a aplicacao vai carregar no momento que subir
    *   Depois: a aplicacao vai criar uma tarefa 

                -  db.testWatch.insert({
                        "_id":"a123456",
                        "cron": "*/2 * * * * *",
                        "message": "Executando alguma coisa a cada 2 seg..."
                    })

    *   Caso queria consultar
                -  db.testWatch.find({})
                
                

5 - Atualizar o registro:
 
                -   db.testWatch.update({ _id: "a123456" }, {
                        $set: {
                            "cron": "*/1 * * * * *",
                            "message": "Executando alguma coisa a cada 1 seg..."
                        }
                    })
   
6 - Inserir mais um registro:

                -   db.getCollection("testWatch").insert({
                        "_id":"a456781",
                        "cron": "*/2 * * * * *",
                        "message": "Executando alguma coisa a cada 2 seg..."
                    });

7 - Apagar um registro:
   
                -   db.testWatch.deleteOne({_id:"a456781"})
