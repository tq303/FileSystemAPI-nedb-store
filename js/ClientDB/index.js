const Datastore = require('nedb');

import FileAPI from '../FileAPI';

class ClientDB {

    constructor( databaseName = "db" ) {

        this.msg          = this.msg();
        this.store        = null;
        this.jsonFile     = new FileAPI( databaseName, (10*1024*1024) );
        this.hasLoaded    = false;
        this.databaseName = databaseName;

    }

    // initialise required due to fileAPI async.
    init() {
        return new Promise((resolve, reject)=> {

            this.jsonFile.init()
                .then(()=> this.jsonFile.create)
                .then(()=> {

                    this.store = new Datastore({ filename: this.jsonFile.path });
                    return resolve( this.msg.DATABASE_INIT );

                })
                .catch(reject);

        });
    }

    // override nedb loadDatabase callback so hasLoaded can be set
    load( done ) {
        this.store.loadDatabase(( err )=> {
            this.hasLoaded = true;
            return done( err, this.msg.DATABASE_LOADED );
        });
    }

    // object of message types
    msg() {
        return {
            DATABASE_INIT: 'database initialised',
            DATABASE_LOADED: 'database loaded from FileSystemAPI',
        }
    }

}

export default ClientDB;
