var React = require('react');
var ReactDOM = require('react-dom');
var { Route, Router, IndexRoute, hashHistory } = require('react-router');
var Main = require('Main');
var Home = require('Home');
var About = require('About');
var Gallery = require('Gallery');
var Contact = require('Contact');

// Load Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Load Font Awesome
require('style!css!font-awesome/css/font-awesome.css');

// App scss
require('style!css!sass!applicationStyles');

ReactDOM.render(
  // <Router history={hashHistory}>
  //   <Route path="/" component={Main}>
  //     <IndexRoute component={Timer}/>
  //     <Route path="countdown" component={Countdown}/>
  //   </Route>
  // </Router>,
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
      <Route path="gallery" component={Gallery}/>
      <Route path="contact" component={Contact}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
