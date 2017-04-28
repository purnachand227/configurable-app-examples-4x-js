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

/// <amd-dependency path="dojo/i18n!application/nls/resources.js" name="i18n" />
declare const i18n: any;

import PortalItem = require("esri/portal/PortalItem");

import ApplicationBase from "../ApplicationBase/ApplicationBase";

import {
  createMap,
  createView,
  getViewProperties,
  getItemTitle,
  setBasemap,
  setFindLocation,
  setGraphic
} from "../ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

const CSS = {
  loading: "configurable-application--loading",
  message: "configurable-application--message"
};

interface PageErrorArguments {
  title: string;
  message: string;
}

class Application {

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
  base: ApplicationBase = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    console.log(base);

    // config: boilerplate default config + application.json config + hosted portal URL + app item params + local storage + URL parameters
    // results: resolved: application item & data, group item & infos, local storage, URL params, webmap items, webscene items
    // settings: ApplicationBase.json
    const { config, results, settings } = base;
    const { webMapItems, webSceneItems } = results;
    const { find, marker } = config;

    setPageLocale(base.locale);
    setPageDirection(base.direction);

    // Get the items to display
    const validWebMapItems = webMapItems.filter(response => {
      return response.value;
    });

    const validWebSceneItems = webSceneItems.filter(response => {
      return response.value;
    });

    const validItems = validWebMapItems.concat(validWebSceneItems).map(response => {
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
    const viewContainerNode = document.getElementById("viewContainer");
    const defaultViewProperties = getViewProperties(config);
    let allTitles = "";

    validItems.forEach(item => {
      // Accumulate titles
      if (allTitles.length > 0) {
        allTitles += ", ";
      }
      allTitles += getItemTitle(item);

      // Create the child node to hold this item
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);

      // Create the webmap or webscene, then adjust the basemap, create
      // the map/scene view, and jump to initial location as desired
      const viewProperties = {
        container: viewNode,
        ...defaultViewProperties
      };

      createMap(item)
        .then(map => setBasemap(map, config)
          .then(map => createView(map, viewProperties)
            .then(view => setFindLocation(find, view)
              .then(() => setGraphic(marker, view)))));
    });

    // If a page title hasn't been configured, use the accumulated list of titles
    config.title = config.title ? config.title : allTitles;
    setPageTitle(config.title);

    this._removePageLoading();
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _removePageLoading(): void {
    document.body.classList.remove(CSS.loading);
  }

  private _addPageError(args: PageErrorArguments): void {
    this._removePageLoading();

    const errorNode = document.createElement("div");
    errorNode.className = CSS.message;
    errorNode.innerHTML = `
      <div>
        <h2><span></span> ${args.title}</h2>
        <p>${args.message}</p>
      </div>
    `;

    document.body.insertBefore(errorNode, document.body.firstChild);
  }
}

export default Application;
