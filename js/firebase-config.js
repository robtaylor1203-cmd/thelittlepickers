(function () {
    var config = {
        apiKey:            'AIzaSyDeEuQ9aXItCpSjb0Njoui2JxeBWToOiTo',
        authDomain:        'the-little-pickers.firebaseapp.com',
        databaseURL:       'https://the-little-pickers-default-rtdb.europe-west1.firebasedatabase.app',
        projectId:         'the-little-pickers',
        storageBucket:     'the-little-pickers.firebasestorage.app',
        messagingSenderId: '686572566661',
        appId:             '1:686572566661:web:5831ff0f8a69048ebb51ec'
    };
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) firebase.initializeApp(config);
    window.tlpDb      = firebase.database();
    window.tlpStorage = firebase.storage();
})();