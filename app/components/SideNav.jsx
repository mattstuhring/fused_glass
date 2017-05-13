var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var SideNav = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      decorative: [],
      houseware: [],
      jewelry: [],
      garden: [],
      open1: false,
      open2: false,
      open3: false,
      open4: false
    };
  },

  handleDecorative: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Decorative');
        this.setState({ decorative: res.data, open1: !this.state.open1 });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  handleHouseware: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Houseware');
        this.setState({ houseware: res.data, open2: !this.state.open2 });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  handleJewelry: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Jewelry');
        this.setState({ jewelry: res.data, open3: !this.state.open3 });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  handleGarden: function(id) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(res.data, 'Garden');
        this.setState({ garden: res.data, open4: !this.state.open4 });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  render: function() {
    return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title text-center">Art for Sale</h3>
          </div>
          <div className="panel-body">

            {/* DECORATIVE */}
            <div>
              <Link to={`/decorative/${1}`} onClick={() => this.handleDecorative(1)}>
                Decorative
              </Link>
              <Panel collapsible expanded={this.state.open1} eventKey="1">
                <ListGroup fill>
                  {this.state.decorative.map(function(d) {
                    return <ListGroupItem key={d.id}>
                        <Link to="/">
                          {d.collection_name}
                        </Link>
                      </ListGroupItem>
                  })}
                </ListGroup>
              </Panel>
            </div>

            {/* HOUSEWARE */}
            <div>
              <Link to={`/houseware/${2}`} onClick={() => this.handleHouseware(2)}>
                Houseware
              </Link>
              <Panel collapsible expanded={this.state.open2} eventKey="2">
                <ListGroup fill>
                  {this.state.houseware.map(function(d) {
                    return <ListGroupItem key={d.id}>
                        <Link to="/">
                          {d.collection_name}
                        </Link>
                      </ListGroupItem>
                  })}
                </ListGroup>
              </Panel>
            </div>

            {/* JEWELRY */}
            <div>
              <Link to={`/jewelry/${3}`}  onClick={() => this.handleJewelry(3)}>
                Jewelry
              </Link>
              <Panel collapsible expanded={this.state.open3} eventKey="3">
                <ListGroup fill>
                  {this.state.jewelry.map(function(d) {
                    return <ListGroupItem key={d.id}>
                        <Link to="/">
                          {d.collection_name}
                        </Link>
                      </ListGroupItem>
                  })}
                </ListGroup>
              </Panel>
            </div>

            {/* GARDEN */}
            <div>
              <Link to={`/houseware/${4}`} onClick={() => this.handleGarden(4)}>
                Garden
              </Link>
              <Panel collapsible expanded={this.state.open4} eventKey="4">
                <ListGroup fill>
                  {this.state.garden.map(function(d) {
                    return <ListGroupItem key={d.id}>
                        <Link to="/">
                          {d.collection_name}
                        </Link>
                      </ListGroupItem>
                  })}
                </ListGroup>
              </Panel>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = SideNav;

{/* {this.state.categories.map(function(category) {
  console.log(category, 'category contents');
  return <SideNavCategory
    key={category.id}
    id={category.id}
    name={category.name}
    collection_name={category.collection_name}
    onCategoryProducts={this.handleCategoryProducts}
  />
}, this)} */}
