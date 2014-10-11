rails-js
========

I worked on several Rails projects and there were many cases when it felt overkill to use a framework like ``Angular`` or ``Ember``, because javascript was only needed in some parts of the application.
But by not using these frameworks I had to think of a way to *structure* the code by myself.
I came up with the conclusion to organize the javascript code like the ruby code is organized, that means: __Split up in controllers, which are split up in actions.__

## How it works
* In ``rails-js`` we are able to define ``controllers``, as well as ``helpers``.
* Controllers have ``actions`` which are executed when the matching rails action is executed.
* Helpers should be clear. Pretty much like the rails helpers. There are helper per controller and global helpers.
* The gem also provides a ``view helper`` to use in your layouts, which passes the routing information to ``rails-js``.

#### You start by creating an app.

```js
//= rails

/*
 * app/assets/javascripts/application.js
 */
 
Rails.app({
 // Define global helpers here
 helper: function() {
 }
},
 // Put in initial data
{
  foo: 'bar'
},
// A function that is executed before every action
function() {
 console.log('beforeAll() executed');
});

```
#### Create controllers accordingly.

```js

/*
 * app/assets/javascripts/controllers/users.js
 */

Rails.controller('users', {
  // actions here
  new: function(h) {
    // execute helper
    h.awesomeHelper();
  },
  
  index: function(h) {
    // Do the same as in new()
    this.index(h);
  }
},
{
  // helpers here
  function awesomeHelper() {
  }
});

```


#### Use code from other controllers.
```js

/*
 * app/assets/javascripts/controllers/admin/users.js
 */
 
Rails.controller('admin/users', {
  new: function(h) {
    // Execute action of foreign controller
    R.action('users#new');
  },
  
  index: function(h) {
    // Execute foreign helper with arguments
    R.helper('users', 'awesomeHelper', 1, 2, 3);
    
    // Execute global helper with arguments
    R.global('helper', 1, 2, 3);
  }
},{});

```


#### Global variables without the mess.
```js
/*
 * Use R singleton everywhere
 */

// Setting
R('answer', 42);
// Multiple levels
R('a.global.variable', 'foo');

// Getting
console.log(R('a.global.variable'));
```


#### Define hooks for namespaces.
```js
/*
 * app/assets/javascripts/namespaces/admin.js
 */
 
Rails.namespace('admin', function() {
  // Will be executed on all admin routes (e.g. admin/users#new)
  console.log('Hello Mr. Admin');
});
```

#### For more info...
...just read in ``app/assets/javascripts/rails.js``. I tried my best and documented nearly every line of code :) 

Installing
==========

Install it as any other gem by putting this to your ``Gemfile``:
```ruby
gem 'rails-js'
```
In your layouts, put this line into the ``head``:
```erb
<%= rails_js %>
```
Also make sure to include ``rails`` in your ``application.js``.
