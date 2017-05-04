var React = require('react');

var Header = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="page-header text-center">
            <h1>Fused Glass by Celeste</h1>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Header;
