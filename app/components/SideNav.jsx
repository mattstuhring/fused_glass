var React = require('react');
var SideNavCategory = require('SideNavCategory');

var SideNav = React.createClass({
  render: function() {
    return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title text-center">Art for Sale</h3>
          </div>
          <div className="panel-body">
            <SideNavCategory name="VOTIVES"/>
            <SideNavCategory name="HOME"/>
            <SideNavCategory name="GARDEN"/>
            <SideNavCategory name="SEA LIFE"/>
            <SideNavCategory name="JEWELRY"/>
            <SideNavCategory name="NATIVE"/>
          </div>
        </div>
    );
  }
});

module.exports = SideNav;
