var React = require('react');
var {Button, Collapse, Well} = require('react-bootstrap');

var SideNavCategory = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },

  render: function() {
    return (
      <div>
        <Button onClick={ ()=> this.setState({ open: !this.state.open }) }>
          {this.props.name}
        </Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              We make whimsical art!
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
});

module.exports = SideNavCategory;
