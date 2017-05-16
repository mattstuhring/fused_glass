var React = require('react');
var axios = require('axios');
var Item = require('Item');

var Jewelry = React.createClass({
  getInitialState: function() {
    return {
      products: []
    };
  },

  componentDidMount: function() {
    console.log(this.props.params.id, 'id');
    axios.get(`/api/categories/${this.props.params.id}`)
      .then((res) => {
        console.log(res.data, 'products');
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  render: function() {
    return (
      <div>
        <h1 className="text-center">Jewelry</h1>
        {this.state.products.map(function(item) {
          return <div className="col-sm-4" key={item.id}>
            <Item item={item}/>
          </div>
        })}
      </div>
    );
  }
});

module.exports = Jewelry;
