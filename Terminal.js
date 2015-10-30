var repl       = require('repl'),
    docManager = require('./documentManager'),

    replServer = repl.start({
      prompt : 'sequelize ORM > '
    });

console.log('Node REPL\n' +
            'Type: DM.<query>.<promise>\n\n' +
            'Here\'s an example: DM.getAllUsers().then(function(users){ console.log(users) })\n\n' + 
            'Type: .help to see few special REPL commands or DM to see all operations: \n'
          );

replServer.context.DM = docManager;
