var User = require('./schema').users,
    Document = require('./schema').documents,
    Role = require('./schema').roles,

    docManager = require('./documentManager.js'),
    Chance = require('chance'),
    chance = new Chance();

describe('Document Management System', function() {
  describe('Sequelize', function() {
    describe('Case for User', function() {
      beforeEach(function() {
        User.destroy({ 
          where : {} 
        }).then(function() {
          Document.destroy({ 
            where : {} 
          }).then(function() {
            Role.destroy({
              where : {} 
            }).then(function() {
            });
          });
        });
      });

      afterEach(function() {
        Role.destroy({
          where: {}
        }).then(function() {
          User.destroy({
            where: {}
          }).then(function() {
          });
        });
      });
      describe('User', function() {

       var first = 'Doyle', 
           last  = 'Lora',
           role  = 'admin';

        docManager.createUser(first, last, role).then(function() {
        });

        it('should verify that User is unique', function() {
          User.create({
            first_name: 'Peter',
            last_name: 'Pan',
            user_role: 'user'
          }).catch(function(err) {
            expect(err).toBeDefined();
          });
        });

        it('should define a Role for `user`', function() {
          User.findOne({
            where: {
              first_name: 'Doyle'
            }
          }).then(function(result) {
            expect(result.user_role).toBe('admin');
          });
        });

        it('should create both first and last names for `user`', function() {
          User.findAll({
            where : {
              role : 'admin'
            }
          }).then(function(user) {
            expect(user.first_name).toEqual('Doyle');
            expect(user.last_name).toEqual('Lora');
          })
        });

        it('should return all `users` when `getAllUsers()` is executed', function() {
          var first = chance.first({ gender: "female" }), 
              last  = chance.last(),
              role  = 'user';

          docManager.createUser(first, last, role).then(function() {
            docManager.getAllUsers().then(function(users) {
              var usersArr = [];
              for (var i = 0; i < users.length; i++) {
                usersArr.push(users[i])
              }
              expect(usersArr).toBeDefined();
              expect(usersArr[1].first_name).toEqual('Doyle');
              expect(usersArr[1].last_name).toEqual('Lora');
              expect(usersArr[1].user_role).toEqual('admin');
            });
          });
        });
      });
    });

    describe('Case for Role', function() {

      beforeEach(function(done) {
        User.destroy({ 
          where : {} 
        }).then(function(){
          Role.destroy({
            where: {}
          }).then(function() {
            Role.create({
              title: 'admin'
            }).then(function(result) {});
            done();
          });
        });
      });

      afterEach(function(done) {
        User.destroy({ 
          where : {} 
        }).then(function(){
          Role.destroy({
            where: {}
          }).then(function() {
            done();
          });
        });
      });

      it('should verify that Role has a unique title ', function(done) {
        Role.findAndCountAll({
          where : {
            title : 'admin'
          }
        }).then(function(role) {
          expect(role.count).toEqual(1);
          done();
        })
      });

      it('should return all `roles` when `getAllRoles()` is executed', function(done) {
        Role.create({
          title : 'moderator'
        }).then(function() {
          docManager.getAllRoles().then(function(roles) {
            expect(roles.length).toEqual(2);
            done()
          })
        })
      });
    });

    describe('Case for Document', function() {

      beforeEach(function() {
        Document.destroy({
          where : {}
        }).then(function() {
          docManager.createDocument('sample document', 'user').then(function(docs) {
          });
        });
      });

      afterEach(function() {
        Document.destroy({
          where : {}
        }).then(function() {
          Role.destroy({
            where : {}
          }).then(function() {
          });
        });
      });

      it('should verify that document has a published date define', function() {
        Document.findAll({
          where : {
            title : 'sample document' 
          }
        }).then(function(docs) {
          expect(docs[0].published_date).toBeDefined();
        });
      });

      it('should return all `documents`, limit by a specified number, when `getAllDocuments()` is executed', function() {
        var documentsArr = [];
        docManager.createDocument('sample document1', 'user').then(function() {
          docManager.createDocument(chance.word({length: 6}), 'user').then(function() {
            docManager.getAllDocuments(2).then(function(docs) {
              for (var i = 0; i < docs.length; i++) {
                documentsArr.push(docs[i].title)
              }
              expect(documentsArr[0]).toEqual('sample document1');
              expect(typeof documentsArr[0]).toEqual( typeof 'sample document1');
            });
          });
        });
      });

      it('should return all documents in order of published dates, starting from the most recent when `getAllDocuments()` is executed', function() {
        docManager.getAllDocuments(4).then(function(docs) {
          expect(docs[0].published_date).toBeDefined();
          expect(docs[1].published_date).toBeDefined();
          expect(docs[2].published_date).toBeDefined();
        });
      });
    });

    describe('Case for Search', function() {

      beforeEach(function() {
        Document.destroy({ where : {} })
          .then(function() {
            docManager.createDocument('Hello World', 'user').then(function() {
              docManager.createDocument('Hello World2', 'user').then(function() {
              });
            });
          });
      });

      afterEach(function() {
        User.destroy({
          where : {}
        }).then(function() {
          Document.destroy({
            where : {}
          }).then(function() {
            Role.destroy({
              where : {}
            });
          });
        });
      });

      it('should verify all documents, limited by a specified number and ordered by published date, accessed by a specified role, and returned when `getAllDocumentsByRole()` is executed', function() {
        docManager.getAllDocumentsByRole('user', 2).then(function(docs) {
          expect(docs).toBeDefined();
          expect(docs.length).toEqual(2);
        });
      });

      it('should verify all documents, limited by a specified number, that were published on a certain date, and returned when `getAllDocumentsByDate()` is executed', function() {
        var date         = new Date(),
            currentDate  = date.getDate(),
            currentMonth = date.getMonth(),
            currentYear  = date.getFullYear(),
            dateCreated  = currentDate + '-' + currentMonth + '-' + currentYear,
            documentsArr    = []

        docManager.getAllDocumentsByDate(dateCreated, 2).then(function(docs) {
          for (var i = 0; i < docs.length; i++) {
            documentsArr.push(docs[i].title)
          }

          expect(documentsArr).toBeDefined();
          expect(documentsArr.length).toEqual(2);
          expect(documentsArr[0]).toEqual('Hello World');
          expect(documentsArr[1]).toEqual('Hello World2');
        });
      });
    });
  });
});