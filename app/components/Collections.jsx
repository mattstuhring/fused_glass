var React = require('react');
var axios = require('axios');
var Item = require('Item');

var Collections = React.createClass({
  getInitialState: function() {
    return {
      products: []
    };
  },

  componentDidMount: function() {
    axios.get(`/api/collections/${this.props.params.id}`)
      .then((res) => {
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
      axios.get(`/api/collections/${nextProps.params.id}`)
        .then((res) => {
          this.setState({
            products: res.data
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

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



module.exports = Collections;
