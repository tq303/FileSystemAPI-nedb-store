require('./styles/main.scss');

import JSONFileAPI from './js/JSONFileAPI';

let jsonFile = new JSONFileAPI();

window.setTimeout(()=> {

    let json = [
        { amount: 0 },
        { amount: 1 },
        { amount: 2 },
        { amount: 3 },
        { amount: 4 },
        { amount: 5 },
        { amount: 6 },
        { amount: 7 },
        { amount: 8 }
    ];

    jsonFile.write( json )
        .then(jsonFile.read.bind(jsonFile))
        .then(( content )=> {
            console.log(content);
        });

}, 500)
