var React = require('react');
var { Link, IndexLink } = require('react-router');
var $ = require('jQuery');

// Show and hide menu bar
$(document).ready(function() {
  'use strict';

  var lastScroll = 0;
  $(window).scroll(function(event){
      //Sets the current scroll position
      var st = $(this).scrollTop();
      //Determines up-or-down scrolling
      if (st > lastScroll){
        $('.navbar').css({
          'margin-top': '-100px',
          'opacity': '0',
          'transition': 'all 1s',
          '-webkit-transition': 'all 1s',
          '-o-transition': 'all 1s',
          '-moz-transition': 'all 1s'
        });

        $('.navbar-default').css({
          'background-color': 'rgba(59, 59, 59, 0)',
          'transition': 'all 1s',
          '-webkit-transition': 'all 1s',
          '-o-transition': 'all 1s',
          '-moz-transition': 'all 1s'
        });
      }
      else {
        $('.navbar').css({
          'margin-top': '0px',
          'opacity': '1',
          'transition': 'all 1s',
          '-webkit-transition': 'all 1s',
          '-o-transition': 'all 1s',
          '-moz-transition': 'all 1s'
        });

        $('.navbar-default').css({
          'background-color': 'rgba(59, 59, 59, 0.7)',
          'border-color': '#444',
          'transition': 'all 1s',
          '-webkit-transition': 'all 1s',
          '-o-transition': 'all 1s',
          '-moz-transition': 'all 1s'
        });
      }
      //Updates scroll position
      lastScroll = st;
  });
});


var Navigation = () => {
  return (
    <div className="top-nav">
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li>
                <IndexLink to="/" activeClassName="active-link">HOME</IndexLink>
              </li>
              <li>
                <Link to="/about" activeClassName="active-link">ABOUT</Link>
              </li>
              <li>
                <Link to="/gallery" activeClassName="active-link">GALLERY</Link>
              </li>
              <li>
                <Link to="/contact" activeClassName="active-link">CONTACT</Link>
              </li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to={`/productform/Add%20new%20product`} activeClassName="active-link">ADD</Link>
              </li>
              <li>
                <Link to="/cart" activeClassName="active-link"><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Cart (0)</Link>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </div>
  );
};

module.exports = Navigation;
