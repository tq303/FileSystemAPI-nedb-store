class JSONFileAPI {

    constructor( fileName = "db.json", size = ( 1024*1024 ) ) {

        this.fs = null;
        this.size     = size;
        this.fileName = fileName;
        this.fileType = "application/json";

        window.webkitRequestFileSystem(window.PERSISTENT, this.size, ( fs )=> {

            this.fs = fs;
            this.create();

        }, this.error );

    }

    create( data = [] ) {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: true, exclusive: true }, ( fileEntry )=> {

                fileEntry.createWriter(( fileWriter )=> {

                    let blob = new Blob([ JSON.stringify( data ) ], { type: this.fileType });

                    fileWriter.onerror = this.error;
                    fileWriter.onwriteend = resolve

                }, this.error);

            }, this.error);

        });

    }

    read() {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: false }, ( fileEntry )=> {

                fileEntry.file(( file )=> {

                    let reader = new FileReader();

                    reader.onloadend = function( e ) {
                        return resolve( this.result );
                    };

                    reader.readAsText( file );

                }, this.error );

            }, this.error);

        });

    }

    write( data = [] ) {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: false }, ( fileEntry )=> {

                fileEntry.createWriter(( fileWriter )=> {

                    let blob = new Blob([ JSON.stringify( data ) ], { type: this.fileType });

                    fileWriter.onerror = this.error;

                    fileWriter.onwriteend = function( e ) {

                        // has reset file, write blob
                        if (fileWriter.length === 0) {

                            fileWriter.write( blob );

                        } else {

                            return resolve( e );

                        }
                    };

                    fileWriter.truncate(0);

                }, this.error);

            }, this.error);

        });
    }

    delete() {
        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, {create: false}, ( fileEntry )=> {

                fileEntry.remove(()=> {

                    console.log(`${this.fileName} deleted.`);
                    return resolve();

                }, this.error);

            }, this.error);

        });
    }

    error( e ) {
        let error = {
            error: e.name
        };
        console.error(error);
        return Promise.resolve( error );
    }

}

export default JSONFileAPI;
