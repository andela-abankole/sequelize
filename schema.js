// load env 
require('dotenv').load();

// get Sequelize and an connect to mySQL
var Sequelize = require('sequelize'),
    
    // config file
    config = require('./config'),

    sequelize = new Sequelize(config.database, config.username);
    
/** [userSchema] @type {Schema} */
var users = sequelize.define('users', {
  first_name : {
    type      : Sequelize.STRING,
    allowNull : false,
    unique    : true,
    validate  : {
      is: ["^[a-z]+$",'i'],
    }
  },
  last_name : {
    type      : Sequelize.STRING,
    allowNull : false,
    unique    : true,
    validate  : {
      is: ["^[a-z]+$",'i'],
    }
  },
  user_role: {
    type: Sequelize.STRING,
  }
},{
  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored : true,
});

/** [roleSchema] @type {Schema} */
var roles = sequelize.define('roles', {
  title : {
    type      : Sequelize.STRING,
    unique    : true,
    allowNull : false
  }
},{
  createdAt : false,
  updatedAt : false
});

/** [documentSchema] @type {Schema} */
var documents = sequelize.define('documents', {
  published_date : {
    type : Sequelize.STRING,
  },
  title : {
    type      : Sequelize.STRING,
    unique    : true,
    allowNull : false
  },
  doc_role : {
    type      : Sequelize.STRING
  }
}, {
    // Ignore default createdAt
    createdAt : false,
    updatedAt : false
});

users.belongsTo(roles, {
  targetKey: 'title',
  foreignKey: 'user_role'
});

documents.belongsTo(roles, {
  targetKey: 'title',
  foreignKey: 'doc_role'
});

// sync db
sequelize.sync({ match: /sequelize$/ });

// exports model
exports.users = users;
exports.documents = documents;
exports.roles = roles;