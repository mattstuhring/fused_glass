var React = require('react');
var ReactDOM = require('react-dom');
var { Route, Router, IndexRoute, browserHistory } = require('react-router');
import About from 'About';
import Cart from 'Cart';
import Categories from 'Categories';
import Collections from 'Collections';
import Contact from 'Contact';
import Gallery from 'Gallery';
import Home from 'Home';
import Login from 'Login';
import Main from 'Main';
import ProductDetails from 'ProductDetails';
import ProductAdd from 'ProductAdd';
import ProductUpdate from 'ProductUpdate';
import Playground from 'Playground';

// Be sure to include styles at some point, probably during your bootstrapping
require('style!css!react-select/dist/react-select.css');

// react-dropzone-component CSS
require('style!css!react-dropzone-component/styles/filepicker.css'); require('style!css!dropzone/dist/min/dropzone.min.css');

// Load Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Load Font Awesome
require('style!css!font-awesome/css/font-awesome.css');

// App scss
require('style!css!sass!applicationStyles');


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/gallery" component={Gallery}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/productadd" component={ProductAdd}/>
      <Route path="/productupdate/:id" component={ProductUpdate}/>
      <Route path="/cart(/:id)" component={Cart}/>

      <Route path="/login(/:action)" component={Login}/>

      <Route path="/products/:id/:category" component={Categories}/>

      <Route path="/collections/:category/:id/:collection" component={Collections}/>

      <Route path="/productdetails/:id" component={ProductDetails} />

      <Route path="/playground" component={Playground} />
    </Route>
  </Router>,
  document.getElementById('app')
);
