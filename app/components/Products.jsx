var React = require('react');
var axios = require('axios');
var Item = require('Item');

var Products = React.createClass({
  getInitialState: function() {
    return {
      products: []
    };
  },

  componentDidMount: function() {
    axios.get(`/api/categories/${this.props.params.id}`)
      .then((res) => {
        this.setState({
          products: res.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      axios.get(`/api/categories/${nextProps.params.id}`)
        .then((res) => {
          this.setState({
            products: res.data
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  render: function() {
    console.log(this.props.params, 'params');
    return (
      <div>
        <h1 className="text-center">{this.props.params.category}</h1>
        {this.state.products.map(function(item) {
          return <div className="col-sm-4" key={item.id}>
            <Item item={item}/>
          </div>
        })}
      </div>
    );
  }
});



module.exports = Products;
