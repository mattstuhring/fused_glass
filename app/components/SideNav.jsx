var React = require('react');
var SideCategory = require('SideCategory');

var SideNav = React.createClass({
  render: function() {
    return (
      <div className="side-nav col-sm-3">
        <SideCategory name="category 1"/>
        <SideCategory name="category 2"/>
        <SideCategory name="category 3"/>
      </div>
    );
  }
});

module.exports = SideNav;
