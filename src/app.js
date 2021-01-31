import { lib } from './app-core/lib';
import $ from 'jquery'
import 'bootstrap' //js
import 'bootstrap/dist/css/bootstrap.css'
import './main.css';

// Lib initialisieren
lib.run();

let run = {
    /**
     * Settings
     */
    settings: lib.settings,

    /**
     *  Haupftfunktion init
     */
    main: function () {

        let self = this;
        let interval = self.watchRam();

        // Systeminformationen
        self.systemInfo();

        // Interval einblenden
        $('#interval')
            .val(self.settings.interval);

        // ladesymbol ausblenden
        $('#loader')
            .delay(3000).fadeOut(1200);

        // lauschen ob sich die Setting ändern
        lib.registerListener(function () {
            self.settings = lib.settings;
            $('#interval')
                .val(self.settings.interval);
            clearInterval(interval);    // stop interval
            interval = self.watchRam(); //reload interval
        });

        // bei klick auf speichern
        $('#save-interval').on('click', function (e) {
            e.preventDefault();
            self.settings.interval = parseInt($('#interval').val());
            lib.settings = self.settings;
        });
    },

    /**
     * System Informationen einblenden
     */
    systemInfo: function () {
        $('#systeminfo')
            .html(`
                <p>${NL_NAME} Version ${NL_APP_VERSION} läuft auf ${NL_OS} 
                im Verzeichnis <code>${NL_CWD}</code>.</p>
                <p>Die App wurde mit NeutralisoJs ${NL_VERSION} erstellt.</p>
                `);
    },

    /**
     * Ram überwachen und einblenden
     */
    watchRam: function () {

        return setInterval(() => {
            let ram = lib.getRamValues();
            $('#ram-percent >div')
                .css('height', 100 - ram.usedPercent + '%');
            $('#ram-percent >span')
                .text(ram.usedPercent + ' %');
            $('#ram-used')
                .text(
                    (ram.total - ram.available)
                        .toLocaleString()
                );
            $('#ram-total')
                .text(
                    (ram.total)
                        .toLocaleString()
                );
            //console.log(this.settings.interval)
        }, this.settings.interval);
    }
};

Neutralino.init({
    load: function () {
        console.log('INFO: App init');
        run.main();
    },
    pingSuccessCallback: function () {
        //console.log('INFO: ping')
    },
    pingFailCallback: function () {
        console.log('ERROR: ping failed')
    }
});