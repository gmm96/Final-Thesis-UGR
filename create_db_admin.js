use admin; 
db.createUser( { 'user': 'administrator',
          'pwd': 'trabajoFinGrado',
          'roles': [ 'userAdminAnyDatabase',
                   'dbAdminAnyDatabase',
                   'readWriteAnyDatabase'
] } );