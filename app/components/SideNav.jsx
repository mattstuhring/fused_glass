var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var SideNav = React.createClass({
  getInitialState: function() {
    return {
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

  handleCollections: function(id, category) {
    axios.get(`/api/categories/collections/${id}`)
      .then((res) => {
        console.log(category, 'category');

        switch (category) {
          case 'decorative':
            this.setState({decorative: res.data, open1: !this.state.open1});
            break;
          case 'houseware':
            this.setState({houseware: res.data, open2: !this.state.open2});
            break;
          case 'jewelry':
            this.setState({jewelry: res.data, open3: !this.state.open3});
            break;
          case 'garden':
            this.setState({garden: res.data, open4: !this.state.open4});
            break;
        }
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
              <Link to={`/products/${1}/Decorative`} onClick={() => this.handleCollections(1, 'decorative')}>
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
              <Link to={`/products/${2}/Houseware`} onClick={() => this.handleCollections(2, 'houseware')}>
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
              <Link to={`/products/${3}/Jewelry`}  onClick={() => this.handleCollections(3, 'jewelry')}>
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
              <Link to={`/products/${4}/Garden`} onClick={() => this.handleCollections(4, 'garden')}>
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
