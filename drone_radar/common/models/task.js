'use strict';

module.exports = function(Task) {
	Task.validatesPresenceOf('user1Id');
	
	Task.observe('before save', function verifyForeignKeys(ctx, next) {
        if (ctx.instance) { 
            
            var s = ctx.instance;
            var userId = s.__data.user1Id;            
			
            
            Task.getApp(function (err, app) {
                app.models.User_1.exists(userId, function (err, exists) {
                    if (err) throw err;
                    if (!exists){
						return next(new Error('Bad foreign key...'));}
					else{
						next();
					};
                });
            });
            
        }});
		
	
	Task.executeSql = function (cb) {
		
		
		var fs = require('fs');
		var sql = fs.readFileSync('query.sql','utf8');
		

        Task.dataSource.connector.query(sql, function (err, tasks) {

            if (err) console.error(err);

            cb(err, tasks);

        });

    };

    Task.remoteMethod(
        'executeSql',
        {
            http: { verb: 'get' },
            description: 'Count tasks',
            returns: { arg: 'data', type: ['Task'], root: true }
        }
    );



};
