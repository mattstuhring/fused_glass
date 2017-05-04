var React = require('react');

var Item = React.createClass({
  render: function() {
    return (
      <div className="col-sm-4">
        <div className="thumbnail">
          <img src="http://www.fillmurray.com/300/200" alt="..." />
          <div className="caption">
            <h3>Item</h3>
            <p>Cool art for sale!</p>
            <p><a href="#" className="btn btn-primary" role="button">Buy</a></p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Item;
