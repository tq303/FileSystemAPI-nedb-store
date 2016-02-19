require('./styles/main.scss');

import ClientDB from './js/ClientDB';

let records = new ClientDB();

records.init().then(( msg )=> {

    console.log( msg );

    records.load(( err, msg )=> {

        if (err !== null) {

            throw err;

        } else {

            console.log( msg );

            let doc = {
                name: 'oliver'
            };
            records.store.insert(doc, function (err, newDoc) {
                console.log(err, newDoc);
            });

            records.store.find({}, function (err, docs) {
                console.log( docs );
            });

        }

    });

});
