
// Action to fetch a single service plan for the server.
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy, setupUISpy } from
  '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';

describe('serviceActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchAllServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      let expectedParams = {
        orgGuid: 'adsfa'
      }
      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllServices(expectedParams.orgGuid);

      assertAction(spy, serviceActionTypes.SERVICES_FETCH, expectedParams);
    });
  });

  describe('receivedServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      var expected = [{ guid: 'adfzxcvz' }];
      let expectedParams = {
        services: wrapInRes(expected)
      }
      let spy = setupServerSpy(sandbox)

      serviceActions.receivedServices(wrapInRes(expected));

      assertAction(spy, serviceActionTypes.SERVICES_RECEIVED, expectedParams);
    });
  });

  describe('receivedPlan()', function() {
    it('should dispatch a server event with service plan', function() {
      const servicePlan = {
        metadata: {
          guid: 'xzclvkba328'
        },
        entity: {
          name: 'azcvb'
        }
      }
      const expectedParams = {
        servicePlan
      };

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedPlan(servicePlan);

      assertAction(spy, serviceActionTypes.SERVICE_PLAN_RECEIVED,
                   expectedParams);
    });
  });

  describe('fetchAllPlans()', function() {
    it('should dispatch a view event with service guid', function() {
      var expectedGuid = 'admxzcg',
          expectedParams = {
            serviceGuid: expectedGuid
          };

      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllPlans(expectedGuid);

      assertAction(spy, serviceActionTypes.SERVICE_PLANS_FETCH,
                   expectedParams);
    });
  });

  describe('receivedPlans()', function() {
    it('should dispatch a server event for received service plans with the plans',
        function() {
      var expectedServices = [{ guid: 'asdf', name: 'plan' }],
          expectedParams = {
            servicePlans: wrapInRes(expectedServices)
          };

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedPlans(wrapInRes(expectedServices));

      assertAction(spy, serviceActionTypes.SERVICE_PLANS_RECEIVED,
                   expectedParams);
    });
  });

  describe('fetchInstance()', function() {
    it('should dispatch a view event of type service instance fetch', function() {
      var expectedSpaceGuid = 'aksfdsaaa8899';

      let expectedParams = {
        spaceGuid: expectedSpaceGuid
      }

      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllInstances(expectedSpaceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCES_FETCH,
                   expectedParams)
    });
  });

  describe('createInstanceForm()', function() {
    it(`should dispatch a view event of type create instance form with the
        service guid and service plan guid`, function() {
      var expectedServiceGuid = 'wqphjhajkajkhadjhfd',
          expectedServicePlanGuid = 'fp2ajkdsfadgh32fasd';

      let expectedParams = {
        servicePlanGuid: expectedServicePlanGuid,
        serviceGuid: expectedServiceGuid
      };
      let spy = setupViewSpy(sandbox);

      serviceActions.createInstanceForm(expectedServiceGuid,
        expectedServicePlanGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
                   expectedParams);
    });
  });

  describe('createInstanceFormCancel', function() {
    it('should dispatch a ui event of type create service instance form cancel',
        function() {
      let spy = setupUISpy(sandbox);

      serviceActions.createInstanceFormCancel();

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM_CANCEL,
        {});
    });
  });

  describe('createInstance()', function() {
    it(`should dispatch a view event of type service instance create with name
        space guid, and service plan guid`, function() {
      var expectedSpaceGuid = 'alksjdfvcbxzzz',
          expectedName = 'service',
          expectedServicePlanGuid = '78900987adfasda';

      let expectedParams = {
        name: expectedName,
        spaceGuid: expectedSpaceGuid,
        servicePlanGuid: expectedServicePlanGuid
      };
      let spy = setupViewSpy(sandbox);

      serviceActions.createInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE,
                   expectedParams);
    });
  });

  describe('createdInstance()', function() {
    it('should dispatch a server event of type instance created with service',
        function() {
      var expectedInstance = { guid: 'asdfas' };

      let expectedParams = {
        serviceInstance: expectedInstance
      };
      let spy = setupServerSpy(sandbox);

      serviceActions.createdInstance(expectedInstance);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATED,
                   expectedParams);
    });
  });

  describe('errorCreateInstance()', function() {
    it('should dispatch a server event of type error create instance', function() {
      var expectedErr = { status: 400 };

      let expectedParams = {
        error: expectedErr
      }
      let spy = setupServerSpy(sandbox);

      serviceActions.errorCreateInstance(expectedErr);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_ERROR,
                   expectedParams);
    });
  });

  describe('receivedInstance()', function() {
    it('should dispatch a server event of type service instance resv with ' +
       'the service instance', function() {
      const expected = {
        metadata: {
          guid: 'afds'
        },
        entity: {
          type: 'someasdf'
        }
      };

      let expectedParams = {
        serviceInstance: expected
      }

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedInstance(expected);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_RECEIVED,
                   expectedParams);
    });
  });

  describe('receivedInstances()', function() {
    it('should dispatch a server event of type service instance resv with ' +
       'the service instances', function() {
      var expected = [
        { metadata: {
            guid: 'afds'
          },
          entity: {
            type: 'someasdf'
          }
        }
      ];

      let expectedParams = {
        serviceInstances: expected
      }

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedInstances(expected);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
                   expectedParams);
    });
  });

  describe('deleteInstanceConfirm()', function() {
    it('should dispatch a instance delete confirm ui event with instance guid',
       () => {
      var expectedInstanceGuid = '09zxcn1dsf';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupUISpy(sandbox)
      serviceActions.deleteInstanceConfirm(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM,
                   expectedParams);
    });
  });

  describe('deleteInstanceCancel()', function() {
    it('should dispatch a instance delete cancel ui event with instance guid',
       () => {
      var expectedInstanceGuid = '23098znxb';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupUISpy(sandbox)
      serviceActions.deleteInstanceCancel(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE_CANCEL,
                   expectedParams);
    });
  });

  describe('deleteInstance()', function() {
    it('should dispatch a instance delete view event with instance guid', () => {
      var expectedInstanceGuid = 'asdfasdf';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupUISpy(sandbox)
      serviceActions.deleteInstanceConfirm(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM,
                   expectedParams);
    });
  });

  describe('deleteInstance()', function() {
    it('should dispatch a instance delete view event with instance guid', () => {
      var expectedInstanceGuid = 'asdfasdf';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupViewSpy(sandbox)
      serviceActions.deleteInstance(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE,
                   expectedParams);
    });
  });

  describe('deletedInstance()', function() {
    // TODO create test case to simulate failed delete attempt.
    it('should dispatch a instance deleted server event with guid', function() {
      var expectedGuid = 'admxzcg',
          expectedParams = {
            serviceInstanceGuid: expectedGuid
          };

      let spy = setupServerSpy(sandbox)

      serviceActions.deletedInstance(expectedGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETED,
                   expectedParams);
    });
  });

  describe('fetchServiceBindings()', function() {
    it('should dispatch service bindings fetch view event with app guid',
        function() {
      const appGuid = 'aldkjfs';
      const expectedParams = {
        appGuid
      };
      const spy = setupViewSpy(sandbox)

      serviceActions.fetchServiceBindings(appGuid);

      assertAction(spy, serviceActionTypes.SERVICE_BINDINGS_FETCH,
                   expectedParams);
    });
  });

  describe('receivedServiceBindings()', function() {
    it('should dispatch service bindings resv server event with binding',
        function() {
      const bindings = [{ metadata: { guid: 'zcxbz' } }];
      const expectedParams = {
        serviceBindings: bindings
      };
      const spy = setupServerSpy(sandbox)

      serviceActions.receivedServiceBindings(bindings);

      assertAction(spy, serviceActionTypes.SERVICE_BINDINGS_RECEIVED,
                   expectedParams);
    });
  });
});
