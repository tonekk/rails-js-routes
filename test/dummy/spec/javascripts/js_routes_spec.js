
/*
 * Test for rails.js
 *
 * For more information see rails.js itself
 */

(function() {
  describe('rails-js-routes', function() {

    /*
     * define all functions spied on
     */
    var spies = { beforeAll: function() {},
                  namespaceHook: function() {},
                  usersIndex: function() {},
                  entitiesNew: function() {},
                  adminUsersIndex: function() {},
                  aHelper: function() {}
                };

    beforeEach(function() {

      // Set config normally set by view_helper
      Rails.config = {
        controller: 'users',
        action: 'index'
      };


      /*
       * Clean up
       */
      Rails.clear();

      spyOn(spies, 'beforeAll');
      spyOn(spies, 'namespaceHook');
      spyOn(spies, 'usersIndex');
      spyOn(spies, 'entitiesNew');
      spyOn(spies, 'adminUsersIndex');
      spyOn(spies, 'aHelper');

      /*
       * Create an app
       */
      Rails.app({
        // global helpers
        answer: function() {
          return 42
        }
      }, {
        // initial data
        foo: 'bar'
      }, spies.beforeAll);

      /*
       * Create a controller
       */
      Rails.controller('users', {
        index: spies.usersIndex,
        new: function(h) {
          // execute helper
          h.aHelper();
        }
      }, {
        aHelper: spies.aHelper
      });
    });

    it('must be defined', function() {
      expect(Rails).toBeDefined();
      expect(R).toBeDefined();
    });

    it('must handle global variables', function() {
      expect(R('a.global.variable', 'foo')).toBe('foo');

      expect(R('a')).toBeDefined();
      expect(R('a.global')).toBeDefined();
      expect(R('a.global.variable')).toBe('foo');
      expect(R()).toEqual({foo: 'bar', a: {global: {variable: 'foo'}}});
    });

    it('must be able to execute global helpers', function() {
      expect(R.global('answer')).toBe(42);
    });

    it('must be able to read initial data', function() {
      expect(R('foo')).toBe('bar');
    });

    it('must execute beforeAll hook', function() {
      Rails.execute();
      expect(spies.beforeAll).toHaveBeenCalled();
    });

    it('must execute right controller action', function() {
      Rails.execute();
      expect(spies.usersIndex).toHaveBeenCalled();

      // Change action to users#new
      Rails.config.action = 'new';

      // A helper must be called from within users#new
      Rails.execute();
      expect(spies.aHelper).toHaveBeenCalled();

      // Create entities controller
      Rails.controller('entities', { new: spies.entitiesNew });
      // Change controller to entities#new
      Rails.config.controller = 'entities';

      Rails.execute();
      expect(spies.entitiesNew).toHaveBeenCalled();
    });

    it('must handle controller with same name but different namespace', function() {
      Rails.controller('admin/users', {
        index: spies.adminUsersIndex
      });

      Rails.config.namespace = 'admin';
      Rails.execute();
      expect(spies.adminUsersIndex).toHaveBeenCalled();
      expect(spies.usersIndex).not.toHaveBeenCalled();
    });

    it('must execute foreign helper', function() {
      Rails.controller('admin/users', {
        index: function() {
          R.helper('users', 'aHelper');
        }
      });

      Rails.config.namespace = 'admin';
      Rails.execute();
      expect(spies.aHelper).toHaveBeenCalled();
    });

    it('must execute foreign action', function() {
      Rails.controller('admin/users', {
        index: function() {
          R.action('users#index');
        }
      });

      Rails.config.namespace = 'admin';
      Rails.execute();
      expect(spies.usersIndex).toHaveBeenCalled();
    });

    it('must execute namespace hook when in namespace', function() {
      // Define namespace with hook
      Rails.namespace('admin', spies.namespaceHook);

      // First without namespace
      Rails.execute();
      expect(spies.namespaceHook).not.toHaveBeenCalled();

      // Now with namespace
      Rails.config.namespace = 'admin';
      Rails.execute();
      expect(spies.namespaceHook).toHaveBeenCalled();
    });

    it('must set Rails.config if link supplied', function() {
      // Set config normally set by view_helper
      Rails.config = {
        controller: 'entities',
        action: 'new'
      };

      Rails.controller('admin/users', {
        index: spies.adminUsersIndex
      });

      var configLink = document.createElement('a');
      configLink.setAttribute('data-action', 'index');
      configLink.setAttribute('data-controller', 'users');
      configLink.setAttribute('data-namespace', 'admin');

      Rails.execute(configLink);

      expect(spies.adminUsersIndex).toHaveBeenCalled();
    });

    it('wont call controller action if Rails.execute called with false', function() {
      Rails.execute(false);
      expect(spies.usersIndex).not.toHaveBeenCalled();
      Rails.execute();
      expect(spies.usersIndex).toHaveBeenCalled();
    });
  });
})();
