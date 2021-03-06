
/*
 * Store for route data. Will store and update route data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { appActionTypes, domainActionTypes, routeActionTypes } from '../constants.js';

class RouteStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case routeActionTypes.ROUTES_FOR_APP_FETCH:
        cfApi.fetchRoutesForApp(action.appGuid);
        break;

      case routeActionTypes.ROUTES_FOR_APP_RECEIVED: {
        const routes = this.formatSplitResponse(action.routes).map((route) =>
          Object.assign({}, route, { app_guid: action.appGuid })
        );
        this.mergeMany('guid', routes, (changed) => {
          if (changed) this.emitChange();
          routes.forEach((route) => {
            cfApi.fetchDomain(route.domain_guid);
          });
        });
        break;
      }

      case domainActionTypes.DOMAIN_FETCH: {
        cfApi.fetchDomain(action.domainGuid);
        break;
      }

      case domainActionTypes.DOMAIN_RECEIVED: {
        const formattedDomain = this.formatSplitResponse([action.domain])[0];
        const domain = Object.assign({}, {
          domain: formattedDomain.name,
          domain_guid: formattedDomain.guid
        });

        this.mergeAll('domain_guid', domain, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case appActionTypes.APP_RECEIVED: {
        if (!action.app.routes) break;
        const routes = action.app.routes.map((route) => {
          const r = {
            app_guid: action.app.guid,
            guid: route.guid,
            host: route.host,
            path: route.path,
            domain_guid: route.domain.guid,
            domain: route.domain.name
          };

          return r;
        });

        this.mergeMany('domain_guid', routes, (changed) => {
          if (changed) this.emitChange();
        });

        break;
      }


      default:
        break;
    }
  }
}

const _RouteStore = new RouteStore();

export default _RouteStore;
