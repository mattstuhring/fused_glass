var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var Jewelry = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      jewelry: [],
      open3: false
    };
  },

  handleJewelry: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Jewelry');
        this.handleProducts(id);
        this.setState({ jewelry: res.data, open3: !this.state.open3 });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  handleProducts: function(id) {
    axios.get(`/api/categories/${id}`)
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
        jewelry
      </div>
    );
  }
});

module.exports = Jewelry;
