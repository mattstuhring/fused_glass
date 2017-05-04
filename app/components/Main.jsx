var React = require('react');
var Navigation = require('Navigation');
var SideNav = require('SideNav');
var Header = require('Header');
var Item = require('Item');

var Main = (props) => {
  return (
    <div>
      <Navigation/>

      <div className="container">

        <Header/>

        <div className="row">
          <SideNav/>

          <div className="col-sm-9">
            <div className="row">
              <Item/>
              <Item/>
              <Item/>
            </div>
          </div>
        </div>

        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

module.exports = Main;
