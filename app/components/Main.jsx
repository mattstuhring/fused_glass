var React = require('react');
var Navigation = require('Navigation');
var SideNav = require('SideNav');
var Header = require('Header');

var Main = React.createClass({
  render: function() {
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

                {/* React router child components */}
                <div className="col-sm-9">
                  <div className="row">
                    {this.props.children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;
