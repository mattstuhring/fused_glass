var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var Houseware = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      houseware: [],
      open2: false
    };
  },

  handleHouseware: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Houseware');
        this.handleProducts(id);
        this.setState({ houseware: res.data, open2: !this.state.open2 });
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
        houseware
      </div>
    );
  }
});

module.exports = Houseware;
