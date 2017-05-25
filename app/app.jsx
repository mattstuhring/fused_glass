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

// trying out -> ES6 Component syntax for ProductForm
import ProductForm from 'ProductForm';

// Be sure to include styles at some point, probably during your bootstrapping
require('style!css!react-select/dist/react-select.css');

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
      <Route path="productform/:action(/:id)" component={ProductForm}/>
      <Route path="cart" component={Cart}/>
      <Route path="products/:id/:category" component={Products}/>
      <Route path="collections/:category/:id/:collection" component={Collections}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
