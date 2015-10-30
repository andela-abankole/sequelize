# sequelize
A Document Management System developed using sequelize, an ORM for Node

## IMPORTANT

**You need node v0.8 or higher to run this program.**

## Installation
### Run 

```
npm install
```
This will install all `dependencies` and `dev-dependencies`.

 - Start mySQL server `mysql.server start`

### Test
- Leave mySQL Server running
- Open a new terminal tab
- CD to this project directory
- Run `npm test`
- Test Result can be found inside ./testResult folder

## Using Command line Interface
### Run

```
node Terminal.js
```
This will start Node REPL

 - Type: DM to see all operations possible with this app
 - Type: .help to see few special REPL commands

Here's an example creating a user

```
DM.createUser('Jack', 'Tom', 'admin')
    .then(function(user){
      console.log(user)
    });
```

**note**

- DM. must come before any query or promise.
- Queries must follow this format `DM.<query>.<promise>`. 
