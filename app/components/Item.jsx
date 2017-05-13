var React = require('react');

var Item = React.createClass({
  render: function() {
    var { product_name, product_description, product_price, product_image } = this.props.item;

    return (
      <div className="thumbnail">
        <img src={product_image} alt="..." />
        <div className="caption">
          <h3>{product_name}</h3>
          <p>{product_description}</p>
          <p>{product_price}</p>
          <p><a href="#" className="btn btn-primary" role="button">Buy</a></p>
        </div>
      </div>
    );
  }
});

module.exports = Item;
