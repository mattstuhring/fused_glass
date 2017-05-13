var React = require('react');
var axios = require('axios');
var Item = require('Item');

var Home = React.createClass({
  getInitialState: function() {
    return {
      products: []
    };
  },

  componentWillMount: function() {
    axios.get('/api/products')
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  render: function() {
    return (
      <div>
        <h1 className="text-center">Home</h1>
        <div>
          {this.state.products.map(function(item) {
            return <div className="col-sm-4" key={item.id}>
              <Item item={item}/>
            </div>
          })}
        </div>
      </div>
    );
  }
});

module.exports = Home;
