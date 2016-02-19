/**
 * FileSystemAPI abstraction for convenient read / write / delete of files.
 */

class FileAPI {

    constructor( fileName = "db", size = ( 1024*1024 ), fileType = "text/plain" ) {

        this.fs       = null;
        this.size     = size;
        this.fileType = fileType;
        this.fileName = `${ fileName }.json`;
        this.path     = `/${ fileName }.json`;

    }

    // initialise required due to fileAPI async.
    init() {
        return new Promise((resolve, reject)=> {

            window.webkitRequestFileSystem(window.PERSISTENT, this.size, ( fs )=> {

                this.fs = fs;

                this.create().then(( file )=> {

                    return resolve( file );

                });

            }, reject );

        });
    }

    // create a file, resolve promise even if file already existss
    create() {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: true, exclusive: true }, ( fileEntry )=> {

                fileEntry.createWriter(( fileWriter )=> {

                    let blob = new Blob([], { type: this.fileType });

                    fileWriter.onerror    = reject;
                    fileWriter.onwriteend = resolve

                }, resolve);

            }, resolve);

        });

    }

    // read file
    read() {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: false }, ( fileEntry )=> {

                fileEntry.file(( file )=> {

                    let reader = new FileReader();

                    reader.onloadend = resolve( this.formatRead( this.result ) );

                    reader.readAsText( file );

                }, reject );

            }, reject);

        });

    }

    // write file
    write( data = "" ) {

        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, { create: false }, ( fileEntry )=> {

                fileEntry.createWriter(( fileWriter )=> {

                    let blob = new Blob([ this.formatWrite( data ) ], { type: this.fileType });

                    fileWriter.onerror = reject;

                    fileWriter.onwriteend = function( e ) {

                        // has reset file, write blob
                        if (fileWriter.length === 0) {

                            fileWriter.write( blob );

                        } else {

                            return resolve( e );

                        }
                    };

                    fileWriter.truncate(0);

                }, reject);

            }, reject);

        });
    }

    // delete file
    delete() {
        return new Promise(( resolve, reject )=> {

            this.fs.root.getFile( this.fileName, {create: false}, ( fileEntry )=> {

                fileEntry.remove(()=> {

                    console.log(`${this.fileName} deleted.`);
                    return resolve();

                }, reject);

            }, reject);

        });
    }

    // override when extending
    formatWrite( data ) {
        return data;
    }

    formatRead( data ) {
        return data;
    }

}

export default FileAPI;
