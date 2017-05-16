var React = require('react');
var axios = require('axios');
var Item = require('Item');

var Products = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      id: null,
      category: null
    };
  },

  componentDidMount: function() {
    var id = this.props.params.id;
    var category = this.props.params.category;

    axios.get(`/api/categories/${id}`)
      .then((res) => {
        console.log(res.data, 'products');
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
          console.log(res.data, 'products');
          this.setState({
            products: res.data
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },


  // componentWillUnmount: function() {
  //   var id = this.props.params.id;
  //   var category = this.props.params.category;
  //
  //   this.setState({
  //     products: [],
  //     id: null,
  //     category: null
  //   });
  // },


  render: function() {
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
