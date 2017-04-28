/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "dojo/i18n!application/nls/resources.js", "../ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper"], function (require, exports, i18n, itemUtils_1, domHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="dojo/i18n!application/nls/resources.js" name="i18n" />
    var CSS = {
        loading: "configurable-application--loading",
        message: "configurable-application--message"
    };
    var Application = (function () {
        function Application() {
            //--------------------------------------------------------------------------
            //
            //  Lifecycle
            //
            //--------------------------------------------------------------------------
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Application.prototype.init = function (base) {
            console.log(base);
            // config: boilerplate default config + application.json config + hosted portal URL + app item params + local storage + URL parameters
            // results: resolved: application item & data, group item & infos, local storage, URL params, webmap items, webscene items
            // settings: ApplicationBase.json
            var config = base.config, results = base.results, settings = base.settings;
            var webMapItems = results.webMapItems, webSceneItems = results.webSceneItems;
            var find = config.find, marker = config.marker;
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            // Get the items to display
            var validWebMapItems = webMapItems.filter(function (response) {
                return response.value;
            });
            var validWebSceneItems = webSceneItems.filter(function (response) {
                return response.value;
            });
            var validItems = validWebMapItems.concat(validWebSceneItems).map(function (response) {
                return response.value;
            });
            if (validItems.length === 0) {
                this._addPageError({
                    title: i18n.errorTitle,
                    message: i18n.errorNoItems
                });
                return;
            }
            // Add each item--a webmap or webscene--to the view container
            var viewContainerNode = document.getElementById("viewContainer");
            var defaultViewProperties = itemUtils_1.getViewProperties(config);
            var allTitles = "";
            validItems.forEach(function (item) {
                // Accumulate titles
                if (allTitles.length > 0) {
                    allTitles += ", ";
                }
                allTitles += itemUtils_1.getItemTitle(item);
                // Create the child node to hold this item
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                // Create the webmap or webscene, then adjust the basemap, create
                // the map/scene view, and jump to initial location as desired
                var viewProperties = __assign({ container: viewNode }, defaultViewProperties);
                itemUtils_1.createMap(item)
                    .then(function (map) { return itemUtils_1.setBasemap(map, config)
                    .then(function (map) { return itemUtils_1.createView(map, viewProperties)
                    .then(function (view) { return itemUtils_1.setFindLocation(find, view)
                    .then(function () { return itemUtils_1.setGraphic(marker, view); }); }); }); });
            });
            // If a page title hasn't been configured, use the accumulated list of titles
            config.title = config.title ? config.title : allTitles;
            domHelper_1.setPageTitle(config.title);
            this._removePageLoading();
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Application.prototype._removePageLoading = function () {
            document.body.classList.remove(CSS.loading);
        };
        Application.prototype._addPageError = function (args) {
            this._removePageLoading();
            var errorNode = document.createElement("div");
            errorNode.className = CSS.message;
            errorNode.innerHTML = "\n      <div>\n        <h2><span></span> " + args.title + "</h2>\n        <p>" + args.message + "</p>\n      </div>\n    ";
            document.body.insertBefore(errorNode, document.body.firstChild);
        };
        return Application;
    }());
    exports.default = Application;
});
//# sourceMappingURL=Application.js.map