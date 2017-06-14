var React = require('react');
var axios = require('axios');
import Item from 'Item';
import Header from 'Header';

export default class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    axios.get(`/api/collections/${this.props.params.id}`)
      .then((res) => {
        this.setState({
          products: res.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // GET ALL COLLECTIONS WHEN NEW SIDENAV COLLECTION IS CLICKED
  componentWillReceiveProps(nextProps) {
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
  }

  render() {
    return (
      <div>
        <Header category={this.props.params.category} collection={this.props.params.collection}/>

        {this.state.products.map(function(item) {
          return <div className="col-sm-4" key={item.id}>
            <Item item={item}/>
          </div>
        })}
      </div>
    );
  }
}
