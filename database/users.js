var Database = function () {
    var users = [
        {   
            id: 1,
            username: 'test',
            password: '609a62b5b687ba6592b1'
        }
    ];
    
    var findByField = function(fieldName, value) {
        var filteredUsers = users.filter(function(user) {
            if (user[fieldName] === value) {
                return user;
            }
        });
        if (filteredUsers.length === 0) {
            return null;
        }
        return filteredUsers[0];
    };
    
    this.findById = function(id) {
        return findByField('id', id);
    };
    
    this.findByUsername = function(username) {
        return findByField('username', username);
    };

    
};

module.exports = new Database();