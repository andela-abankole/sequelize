// get user and Document model
var User = require('./schema').users,
    Document = require('./schema').documents,
    Role = require('./schema').roles;

/** @type {Object} [exports methods to be used] */
module.exports = {

  /**
   * [createUser check if role exist,
   *             create a role if it does not exist,
   *             create a user with role]
   * @param     {[String]}          first    [contain first name]
   * @param     {[String]}          last     [contain last name]
   * @param     {[String]}          role     [contain role]
   * @return    {[Object]}                   [return the user]
   */
  createUser : function(last, first, role) {
    return Role.findOrCreate({
      where : {
        title : role
      }
    }).then(function() {
      User.findOrCreate({
        where : {
          first_name : first,
          last_name : last,
          user_role : role
        }
      })
    });
  },

  /**
   * [getAllUsers fetch all users from the database]
   * @return    {[Object]}      [return all the user in database]
   */
  getAllUsers : function() {
    return User.findAll()
  },

  /**
   * [createRole create a role]
   * @param     {[Srting]}     title [contain role ]
   * @return    {[Object]}           [return the role]
   */
  createRole : function(title) {
    return Role.create({
      title : title
    })
  },

  /**
   * [getAllRoles fetch all role in database]
   * @return    {[Object]}    [return all role in database]
   */
  getAllRoles : function() {
    return Role.findAll({
      where : {}
    })
  },

  /**
   * [createDocument check if role exist,
   *                 create a role if it does not exist,
   *                 create a document with role.
   *                 ]
   * @param     {[String]}      title   [contain document title]
   * @param     {[String]}      role    [contain role]
   * @return    {[Object]}              [return the document]
   */
  createDocument : function(title, role) {
    var date         = new Date(),
        currentDate  = date.getDate(),
        currentMonth = date.getMonth(),
        currentYear  = date.getFullYear(),
        dateCreated  = currentDate + '-' + currentMonth + '-' + currentYear;

    return Role.findOrCreate({
      where : {
        title : role
      }
    }).then(function() {
      Document.findOrCreate({
          where : {
            published_date : dateCreated,
            title          : title,
            doc_role       : role
          }
      });
    });
  },

  /**
   * [getAllDocuments fetch all documents from the database]
   * @param     {[String]}      limit [contain limit specified]
   * @return    {[Object]}      [return all the document in database]
   */
  getAllDocuments : function(limit) {
    return Document.findAll({
      limit : limit,
      order : 'published_date DESC'
    }).then(function(res) {
      return res;
    })
  },

  /**
   * [getAllDocumentsByRole find by role,
   *                         sort by dateCreated in descending order,
   *                         limit to the number of limit specified]
   * @param     {[String]}      role  [contain role]
   * @param     {[String]}      limit [contain limit specified]
   * @return    {[Object]}              [return documents by the number of limit]
   */
  getAllDocumentsByRole : function(role, limit) {
    return Document.findAll({
      where : {
        doc_role : role,
      },
      limit : limit,
      order : 'published_date DESC'
    })
  },

  /**
   * [getAllDocumentsByDate find by dateCreated,
   *                        limit to the number of limit specified]
   * @param     {[String]}        date  [contain date specified]
   * @param     {[String]}        limit [ontain limit specified]
   * @return    {[Object]}              [return documents by the number of limit]
   */
  getAllDocumentsByDate : function(date, limit) {
    return Document.findAll({
      where : {
        published_date : date
      },
      limit : limit
    });
  }
};