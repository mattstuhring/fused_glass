var React = require('react');
var {PageHeader} = require('react-bootstrap');

var Header = React.createClass({

  render: function() {

    var pageHeader = () => {
      if (this.props.collection) {
        return <PageHeader>
          {this.props.category} <small>{this.props.collection}</small>
        </PageHeader>;
      } else {
        return <PageHeader>
          {this.props.category}
        </PageHeader>;
      }
    }

    return (
      <div className="text-center">
        {pageHeader()}
      </div>
    );
  }
});

module.exports = Header;
