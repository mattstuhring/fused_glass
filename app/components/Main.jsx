var React = require('react');
var Navigation = require('Navigation');
var SideNav = require('SideNav');
var Header = require('Header');
var Item = require('Item');

var Main = (props) => {
  return (
    <div>
      {/* TOP NAVBAR */}
      <Navigation/>

      <div className="container">
        <div className="panel panel-default main-overlay">
          <div className="panel-body">

            <div className="row">
              {/* HEADER */}
              <div className="col-sm-12">
                <Header/>
              </div>
            </div>

            <div className="row">
              {/* SIDE NAVBAR */}
              <div className="main-side-nav col-sm-3">
                <SideNav/>
              </div>

              {/* ITEMS */}
              <div className="col-sm-9">
                <div className="row">
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                  <div className="col-sm-4">
                    <Item/>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = Main;
