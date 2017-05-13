var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var Decorative = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      decorative: [],
      open1: false
    };
  },

  handleDecorative: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Decorative');
        this.handleProducts(id);
        this.setState({ decorative: res.data, open1: !this.state.open1 });
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
        <Link to="/decorative" onClick={() => this.handleDecorative(1)}>
          Decorative
        </Link>
        <Panel collapsible expanded={this.state.open1} eventKey="1">
          <ListGroup fill>
            {this.state.decorative.map(function(c) {
              return <ListGroupItem key={c.id}>
                  <Link to="/">
                    {c.collection_name}
                  </Link>
                </ListGroupItem>
            })}
          </ListGroup>
        </Panel>
      </div>
    );
  }
});



module.exports = Decorative;
