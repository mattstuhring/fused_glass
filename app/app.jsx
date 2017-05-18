var React = require('react');
var ReactDOM = require('react-dom');
var { Route, Router, IndexRoute, hashHistory } = require('react-router');
var Main = require('Main');
var Home = require('Home');
var About = require('About');
var Gallery = require('Gallery');
var Contact = require('Contact');
var Cart = require('Cart');
var Products = require('Products');
var Collections = require('Collections');

// trying out -> ES6 Component syntax for Admin
import Admin from 'Admin';

// Load Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Load Font Awesome
require('style!css!font-awesome/css/font-awesome.css');

// App scss
require('style!css!sass!applicationStyles');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
      <Route path="gallery" component={Gallery}/>
      <Route path="contact" component={Contact}/>
      <Route path="admin" component={Admin}/>
      <Route path="cart" component={Cart}/>
      <Route path="products/:id/:category" component={Products}/>
      <Route path="collections/:id/:category" component={Collections}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
