/**
 * Copyright 2013 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Common app functionality will be attached to the `app` namespace.
 */
var app = {
    /**
     * Application constructor.
     */
    initialize: function () {
        this.bindEvents();
    },

    /**
     * Bind event listeners.
     */
    bindEvents: function () {
        // Bind any events that are required on startup. Common events are: `load`,
        // `deviceready`, `offline`, and `online`.
        console.log("bind device ready");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /**
     * The deviceready event handler.
     */
    onDeviceReady: function () {
        // Initialize Kinvey. Paste your app key and secret below.
        Kinvey.init({
            apiHostName: 'https://baas.kinvey.com',
            micHostName: 'https://auth.kinvey.com',
            appKey: 'kid_Wy7NMiwaTx',
            appSecret: '18e581bc9c7046a5b1b20ae838105126'
        });

        Kinvey.User.getActiveUser().then(function (user) {
            console.log("active user " + JSON.stringify(user));
            if(user){
                showHideLogin(false);
            }else{
                showHideLogin(true);
            }
        }).catch(function(err){
            console.log("get active error" + JSON.stringify(err));
        });

        $('#tabs').tabs({
            activate: function (event, ui) {
                switch ((ui.newTab).index()) {
                    case 1:
                        loadProducts();
                        break;
                    case 2:
                        loadPartners();
                        break;
                    case 3:
                        loadTodos();
                        break;
                    case 4:
                        loadColloteral();
                        break;
                    case 6:
                        loadMedia();
                }
            }
        });
    }
};
