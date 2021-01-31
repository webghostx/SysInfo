export let lib = {

    // init
    run: function () {
        this.settingsInit();
    },

    /* ------------------------------------------------------ */

    // Settings storage content default
    settingsObj: {
        interval: 1000
    },

    // Listener
    settingsListener: (obj) => { }, // Listener,
    registerListener: function (listener) {
        this.settingsListener = listener;
    },

    // getter
    get settings() {
        return this.settingsObj;
    },

    // setter
    set settings(obj) {
        this.settingsObj = obj;
        this.settingsListener(obj);
        this.settingsSave();
    },

    /**
     * Einstellungen laden
     */
    settingsInit: function () {
        // https://neutralino.js.org/docs/#/api/storage
        Neutralino.storage.getData('settings', // bucket, settings.json in ./storage
            (content) => {
                this.settings = content;
            },
            () => {
                console.log('ERROR: No data recived');
            }
        );
    },

    /**
     * Einstellungen speichern
     */
    settingsSave: function () {
        let data = {
            bucket: 'settings', // settings.json in ./storage
            content: this.settings
        }
        // https://neutralino.js.org/docs/#/api/storage
        Neutralino.storage.putData(data,
            () => {
                console.log('INFO: Data saved to storage-file');
                //console.log(data);
            },
            () => {
                console.log('ERROR: Data not saved');
            }
        );
    },

    /* ------------------------------------------------------ */

    // ram Values
    ram: {
        total: 0,
        available: 0,
        usedPercent: 0
    },

    /**
     *  gibt die aktuellen Werte des Arbeitspeichers zurück
     *  @returns obj ram
     */
    getRamValues: function () {
        this.loadRamValues();
        return this.ram;
    },

    /**
     *  Lade die aktuellen Werte des Arbeitsspeichers
     */
    loadRamValues: function () {
        // https://neutralino.js.org/docs/#/api/computer
        Neutralino.computer.getRamUsage((data) => {
            this.ram.total = parseInt(
                data.ram.total / 1000 // zu MB konvertieren
            );
            this.ram.available = parseInt(
                data.ram.available / 1000 // zu MB konvertieren
            );
            this.ram.usedPercent = parseInt(
                ((data.ram.total - data.ram.available) / data.ram.total) * 100
            );
        }, () => {
            /*
            // @ToDo error-handling
            Neutralino.debug.log(
                'WARNING', 'Ram Status konnte nicht gelesen werden',
                function (data) {
                    console.log(data);
                },
                function () {
                    console.error('error');
                }
            );
            */
        });
    }
}//