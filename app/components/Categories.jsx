var React = require('react');
var axios = require('axios');
var {Button, Modal, Tooltip, OverlayTrigger, Image} = require('react-bootstrap');
var {Link} = require('react-router');
import Header from 'Header';

export default class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      categoryId: null,
      showModal: false,
      name: '',
      description: '',
      price: '',
      id: null
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleProductDelete = this.handleProductDelete.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/categories/${this.props.params.id}`)
      .then((res) => {
        this.setState({
          products: res.data,
          categoryId: this.props.params.id
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // GET ALL PRODUCTS WHEN NEW SIDENAV CATEGORY IS CLICKED
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      axios.get(`/api/categories/${nextProps.params.id}`)
        .then((res) => {
          this.setState({
            products: res.data,
            categoryId: nextProps.params.id
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // CLOSE PRODUCT DELETE MODAL
  close() {
    this.setState({ showModal: false, name: '', description: '', price: '', id: null });
  }

  // OPEN PRODUCT DELETE MODAL
  open(name, description, price, id) {
    this.setState({ showModal: true, name, description, price, id });
  }

  // DELETE PRODUCT FROM DATABASE BY ID
  handleProductDelete(productId) {
    axios.delete(`/api/products/${productId}`)
      .then((res) => {
        return;
      })
      .then(() => {
        axios.get(`/api/categories/${this.state.categoryId}`)
          .then((res) => {
            this.setState({
              products: res.data
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(error);
      });

    this.setState({ showModal: false, name: '', description: '', price: '', id: null });
  }


  // ***************************  RENDER  ********************************
  render() {
    const edit = (
      <Tooltip id="tooltip"><strong>Edit</strong></Tooltip>
    );

    const remove = (
      <Tooltip id="tooltip"><strong>Delete</strong></Tooltip>
    );

    return (
      <div>
        <Header category={this.props.params.category}/>

        {this.state.products.map((p) => {
          return <div className="col-sm-4" key={p.id}>
            <div>

              {/* DELETE PRODUCT MODAL */}
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to delete this product?</p>
                  <h4>{this.state.name}</h4>
                  <p>{this.state.description}</p>
                  <p>{this.state.price}</p>
                  <p>Product ID: {this.state.id}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => this.handleProductDelete(this.state.id)}>
                    Yes
                  </Button>
                  <Button onClick={this.close}>No</Button>
                </Modal.Footer>
              </Modal>

              <div className="thumbnail">
                <div className="row btn-wrap">
                  <div className="col-sm-12 text-right">
                    <OverlayTrigger placement="top" overlay={edit}>

                      {/* LINK TO UPDATE PRODUCT FORM */}
                      <Link to={`/playground/Update%20product/${p.id}`}>

                        <Button bsStyle="success">
                          <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </Button>
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={remove}>
                      <Button
                        bsStyle="danger"
                        onClick={() => this.open(p.product_name, p.product_description, p.product_price, p.id)}
                      >
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>

                <Image src={`images/uploads/${p.product_image}`} responsive alt="..." style={{height: "200px"}} />
                <div className="caption">
                  <h4>{p.product_name}</h4>
                  <p>{p.product_description}</p>
                  <p>{p.product_price}</p>
                  <Link to={`/productdetails/${p.id}`}>
                    <Button bsStyle="primary">Buy</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    );
  }
}