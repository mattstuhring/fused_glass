var React = require('react');
var {Button, Modal, Tooltip, OverlayTrigger} = require('react-bootstrap');
var {Link} = require('react-router');
var axios = require('axios');

export default class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
        console.log(res, '******** res product delete');
      })
      .catch((err) => {
        console.log(error);
      });

    this.props.onCategoryProducts();

    this.setState({ showModal: false, name: '', description: '', price: '', id: null });
  }



  // ********************** RENDER ****************************
  render() {
    var { product_name, product_description, product_price, product_image, id } = this.props.product;

    const edit = (
      <Tooltip id="tooltip"><strong>Edit</strong></Tooltip>
    );

    const remove = (
      <Tooltip id="tooltip"><strong>Delete</strong></Tooltip>
    );

    return (
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
                <Link to={`/productform/Update%20product/1`}>
                  <Button bsStyle="success">
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                  </Button>
                </Link>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={remove}>
                <Button
                  bsStyle="danger"
                  onClick={() => this.open(product_name, product_description, product_price, id)}
                >
                  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </Button>
              </OverlayTrigger>
            </div>
          </div>

          <img src={product_image} alt="..." />
          <div className="caption">
            <h4>{product_name}</h4>
            <p>{product_description}</p>
            <p>{product_price}</p>
            <p><a href="#" className="btn btn-primary" role="button">Buy</a></p>
          </div>
        </div>
      </div>
    );
  }
}
