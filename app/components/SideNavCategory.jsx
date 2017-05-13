var React = require('react');
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel } = require('react-bootstrap');

var SideNavCategory = React.createClass({
  getInitialState: function() {
    return {
      open: false
    };
  },

  // onProducts: function(id) {
  //   this.props.onProducts(id);
  //   this.props.onCategories(id);
  //   this.setState({ open: !this.state.open })
  // },
  onCollections: function(id) {
    this.props.onCollections(id);
    this.setState({ open: !this.state.open });
  },

  render: function() {
    var { id, name } = this.props;

    return (
      <div>
        {/* <Link to="/" onClick={() => this.onProducts(id)}>
          {name}
        </Link> */}
        <Link to="/" onClick={() => this.onCollections(id)}>
          {name}
        </Link>
        <Panel collapsible expanded={this.state.open}>

          <ListGroup fill>
            <ListGroupItem>
              <Link to="/">
                row
              </Link>
            </ListGroupItem>
          </ListGroup>


          {/* <ListGroup fill>
            {this.props.collections.map(function(c) {
              console.log(c, 'what is this?');
              return <ListGroupItem key={c.id}>
                <Link to="/">
                  row
                </Link>
              </ListGroupItem>
            })}
          </ListGroup> */}

        </Panel>
      </div>
    );
  }
});

module.exports = SideNavCategory;
