/**
 * ── Firebase Configuration ────────────────────────────────────────────────
 *
 * HOW TO SET THIS UP (takes about 5 minutes):
 *
 *  1. Go to https://console.firebase.google.com and sign in with your Google account
 *  2. Click "Add project" → name it "thelittlepickers" → Continue
 *  3. Disable Google Analytics (not needed) → click "Create project" → Continue
 *  4. On the Project Overview page, click the "</>" icon (Web app)
 *  5. Register your app as "thelittlepickers" → click "Register app"
 *  6. You'll see a firebaseConfig block — copy each value and paste it below
 *     replacing each "REPLACE_WITH_..." placeholder
 *  7. In the left-hand panel go to Build → Realtime Database
 *  8. Click "Create Database" → choose "Europe-West (Belgium)" → Next
 *  9. Select "Start in test mode" → Enable
 * 10. Once created, click the "Rules" tab and replace the rules with:
 *       { "rules": { ".read": true, ".write": true } }
 *     then click "Publish"
 * 11. Copy the Database URL at the top of the page
 *     (looks like: https://thelittlepickers-xxxxx-default-rtdb.europe-west1.firebasedatabase.app)
 *     and paste it as the databaseURL value below
 * 12. Save this file, then run:
 *       git add . && git commit -m "Add Firebase config" && git push origin main
 *     Your site will now sync the map, stats, likes and comments across all devices!
 *
 * NOTE: Gallery photos stay device-local (they are stored as large image data
 * which is too big for the free Firebase tier). Everything else syncs live.
 */
(function () {
    var config = {
        apiKey:            'REPLACE_WITH_YOUR_API_KEY',
        authDomain:        'REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com',
        databaseURL:       'REPLACE_WITH_YOUR_DATABASE_URL',
        projectId:         'REPLACE_WITH_YOUR_PROJECT_ID',
        storageBucket:     'REPLACE_WITH_YOUR_PROJECT_ID.appspot.com',
        messagingSenderId: 'REPLACE_WITH_YOUR_MESSAGING_SENDER_ID',
        appId:             'REPLACE_WITH_YOUR_APP_ID'
    };

    // Don't initialise if placeholders haven't been filled in yet
    if (config.apiKey === 'REPLACE_WITH_YOUR_API_KEY') return;

    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) firebase.initializeApp(config);
    window.tlpDb = firebase.database();
})();
