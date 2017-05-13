var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var Garden = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      garden: [],
      open4: false
    };
  },

  handleGarden: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Garden');
        this.handleProducts(id);
        this.setState({ garden: res.data, open4: !this.state.open4 });
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
        garden
      </div>
    );
  }
});

module.exports = Garden;
