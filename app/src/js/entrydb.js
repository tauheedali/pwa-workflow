var entryDB = (function () {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    var DB = {};
    var datastore = null;

    //TODO: Add methods for interacting with database here
    /**
     * Open a connection to the datastore.
     */
    DB.open = function (callback) {
        // Database version.
        var version = 1;

        // Open a connection to the datastore.
        var request = indexedDB.open('lead', version);

        // Handle datastore upgrades.
        request.onupgradeneeded = function (e) {
            var db = e.target.result;

            e.target.transaction.onerror = DB.onerror;

            // Delete the old datastore.
            if (db.objectStoreNames.contains('lead')) {
                db.deleteObjectStore('lead');
            }

            // Create a new datastore.
            var store = db.createObjectStore('lead', {
                keyPath: 'timestamp'
            });
        };

        // Handle successful datastore access.
        request.onsuccess = function (e) {
            // Get a reference to the DB.
            datastore = e.target.result;
            console.log('open success');
            // Execute the callback.
            callback();
        };


        // Handle errors when opening the datastore.
        request.onerror = DB.onerror;
    };

    /**
     * Fetch all of the mailing lists in the datastore.
     */
    DB.fetchLeads = function (callback) {
        var db = datastore;
        var transaction = db.transaction(['lead'], 'readwrite');
        var objStore = transaction.objectStore('lead');

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = objStore.openCursor(keyRange);

        var leads = [];

        transaction.oncomplete = function (e) {
            // Execute the callback function.
            callback(leads);
        };

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!!result == false) {
                return;
            }
            leads.push(result.value);
            result.continue();
        };

        cursorRequest.onerror = DB.onerror;
    };

    /**
     * Create a new mailing_list item.
     */
    DB.createLead = function (lead, callback) {
        // Get a reference to the db.
        if (datastore) {
            var db = datastore;
            // Initiate a new transaction.
            var transaction = db.transaction(['lead'], 'readwrite');

            // Get the datastore.
            var objStore = transaction.objectStore('lead');

            // Create a timestamp for the lead.
            var timestamp = new Date().getTime();
            var timestamp = Math.round(timestamp / 1000);

            // Create an object for the lead.
            var new_lead = {
                'lead': lead,
                'timestamp': timestamp
            };

            // Create the datastore request.
            var request = objStore.put(new_lead);

            // Handle a successful datastore put.
            request.onsuccess = function (e) {
                // Execute the callback function.
                callback(new_lead);
            };

            // Handle errors.
            request.onerror = DB.onerror;
        } else {
            console.log('not there yet');
        }
    };

    /**
     * Delete a lead.
     */
    DB.deleteLead = function (id, callback) {
        var db = datastore;
        var transaction = db.transaction(['lead'], 'readwrite');
        var objStore = transaction.objectStore('lead');

        var request = objStore.delete(id);

        request.onsuccess = function (e) {
            callback();
        };

        request.onerror = function (e) {
            console.log(e);
        }
    };


    //Export DB object
    return DB;

}());
