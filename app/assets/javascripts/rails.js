(function(window, document) {

  /*
   * All the global stuff (helpers, data, hooks) is stored
   * locally in this closure so we cannot do anything wrong
   */
  var controllers = {},
      globalHelpers = {},
      namespaceHooks = {},
      data = {};

  /*
   * Singleton that stores functions to create your apps' structure
   */
  Rails = window.Rails || {};

  /*
   * Creates a Rails application (the javascript part!)
   *
   * Pass global helper and initial data as params
   */
  Rails.app = function(helpers, initialData, beforeAll) {

    /*
     * Store everything in our local variables
     */
    globalHelpers = helpers;
    data = initialData;

    /*
     * Set event listener to execute controllers' javascript
     *
     * There might be cases where we do not want to execute
     * DOM-related js (e.g. javascript unit-tests).
     * Set Rails.config.test to disable action execution.
     */
    document.addEventListener("DOMContentLoaded", function(event) {

      if(Rails.config && Rails.config.test) {
        return;
      }

      /*
       * Also execute beforeAll() hook if defined
       */
      if(beforeAll && typeof(beforeAll) == 'function') {
        beforeAll();
      }

      Rails.execute();
    });
  };

  /*
   * Adds a controller.
   * Controllers are used to apply javascript in rails routes.
   * Example:
   *
   * Rails.controller('users', {
   *
   *   new: function() {
   *    // Executed on users/new
   *   }
   * });
   */
  Rails.controller = function(name, actions, helpers) {

    /*
     * Should not be able to define controller (and helpers) twice
     */
    if(controllers[name]) {
      throw ['Controller \'', name,
             '\' is already defined! Please use a namespace'].join('');
    }

    /*
     * Store controller & helpers in our local closure
     */
    controllers[name] = actions;
    controllers[name].helpers = helpers;
  },

  /*
   * Execute the actual controller action.
   * e.g. will execute controller.users.index()
   * when on #users/index
   */
  Rails.execute = function() {

    /*
     * Make sure rails.js has been properly added to the layout
     */
    if(!(this.config && this.config.controller && this.config.action)) {

      throw ['No action or controller given.',
             'It seems like you forgot to add rails.js to your layouts\' header.'].join(' ');
    }

    var controller,
        namespaceHook,
        controllerName = this.config.controller;

    /*
     * Take care of namespace (e.g. admin/users)
     */
    if(this.config.namespace) {
      controllerName = this.config.namespace + '/' + controllerName;

      /*
       * Execute namespace hook if we defined one
       */
      namespaceHook = namespaceHooks[this.config.namespace];
      if(namespaceHook && typeof(namespaceHook) == 'function') {
        namespaceHook();
      }
    }

    /*
     * Find controller and execute method
     */
    var controller = controllers[controllerName];
    if(controller && controller[this.config.action] &&
       typeof(controller[this.config.action]) == 'function') {

      controller[this.config.action](controller.helpers);
    }
  };

  /*
   * Defines a namespace hook which will be executed when
   * we are in the namespace of that hook.
   *
   * For example:
   * When we define a namespace for 'admin'
   * the function will be executed on all controllers in that namespace.
   * (e.g. Admin::UsersController, Admin::SettingsController, etc...)
   */
  Rails.namespace = function(name, block) {

    /*
     * Should not be able to define controller (and helpers) twice
     */
    if(namespaceHooks[name]) {
      throw ['Namespace \'', name, '\' is already defined!'].join('');
    }

    namespaceHooks[name] = block;
  };


  /*
   * Global Singleton to store variables and functions
   * that you need all over your javascript codebase.
   *
   * Also contains global helpers, so to prevent conflicts
   * we save global variables by using this singleton as a function.
   *
   * R('foo'); // Gets window.R.data.foo
   * R('foo', 'bar'); // Sets window.R.data.foo
   */
  R = function(key, val) {

    /*
     * It's possible to go multiple layers with one call, e.g.
     * R('foo.bar.baz');
     *
     * Or you can set things at paths which are not there:
     * // foo and bar will be created as empty objects
     * R('foo.bar.baz', 'foo');
     *
     */
    var steps = key.split('.'),
        step = data;

    if(val) {
      for(var i = 0; i < steps.length-1; i++) {
        if(!step[steps[i]]) {
          step[steps[i]] = {};
        }

        step = step[steps[i]];
      }

      step[steps[steps.length -1]] = val;

    } else {
      for(var i = 0; i < steps.length; i++) {
        step = step[steps[i]];
        if(!step) {
          break;
        }

      }
      return step;
    }
  };

  /*
   * Execute a helper of a foreign controller
   *
   * e.g.
   * Rails.helper('admin/users', 'method', [arg1, arg2, arg3]);
   * or
   * Rails.helper('entities', 'method', arg1, arg2, arg3);
   */
  R.helper = function(controllerName, helperName) {

    var controller,
        helper,
        context,
        args = Array.prototype.slice.call(arguments, 2);

    /*
     * Treat 3rd argument as arguments for helper if it is an Array
     */
    if(args.length == 1 && args[0] instanceof Array) {
      args = args[0];
    }

    /*
     * Choose global helper if controllerName is not given
     */
    if(controllerName) {
      controller = controllers[controllerName];
      helper = controller.helpers[helperName];
    } else {
      helper = globalHelpers[helperName];
    }

    /*
     * Make sure our helper exists
     */
    if(!(helper && typeof(helper) == 'function')) {
      if(controllerName) {
        throw ['Helper \'', helperName, '\' not defined for controller \'',
               controllerName, '\''].join('');
      } else {
        throw ['Global helper \'', helperName, '\' not defined'].join('');
      }
    }

    /*
     * Choose context, either some controllers' helpers or
     * the globalHelpers object
     */
    context = controller ? controller.helpers : globalHelpers;

    /*
     * Execute helper in context with arguments
     */
    return helper.apply(context, args);
  };

  /*
   * Execute a global helper
   *
   * Global helpers are defined when the Rails.app is created
   */
  R.global = function(helperName) {
    return this.helper(undefined, helperName, Array.prototype.slice.call(arguments, 1));
  };

  /*
   * Executes a controller action
   * (to execute the same javascript in a different controller)
   */
  R.action = function(action) {

    /*
     * Arguments are either controller and action or the
     * familliar rails syntax:
     *
     * R.action('users', 'index');
     * R.action('users#index');
     */
    var controller,
        controllerName = arguments[0],
        actionName = arguments[1];

    if(action.indexOf('#') !== -1) {
      controllerName = action.split('#')[0];
      actionName = action.split('#')[1];
    }

    /*
     * Make sure controller and action exist
     */
    controller = controllers[controllerName];

    if(!controller) {
        throw ['Attempting to call action \'', controllerName, '#', actionName,
               '\', but Controller \'', controllerName, '\' is not defined!'].join('');
    } else if(!controller[actionName] || !(typeof(controller[actionName]) == 'function')) {
        throw ['Attempting to call action \'', controllerName, '#', actionName,
               '\', but Action \'', actionName, '\' is not defined!'].join('');
    }

    /*
     * Execute controller action with helpers as argument
     */
    controller[actionName](controller.helper);
  };

})(window, window.document);
