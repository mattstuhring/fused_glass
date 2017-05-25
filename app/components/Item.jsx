var React = require('react');
var {Button, Modal} = require('react-bootstrap');
var {Link} = require('react-router');

var Item = React.createClass({
  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render: function() {
    var { product_name, product_description, product_price, product_image } = this.props.item;

    return (
      <div>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this product?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Yes</Button>
            <Button onClick={this.close}>No</Button>
          </Modal.Footer>
        </Modal>

        <div className="thumbnail">
          <div className="row btn-wrap">
            <div className="col-sm-6">
              <Button
                bsStyle="success"
              >

                {/* Link contains test (ID = 1) as URL param */}
                <Link to={`/productform/Update%20product/1`}>
                  <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </Link>
              </Button>
            </div>
            <div className="col-sm-6 text-right">
              <Button
                bsStyle="danger"
                onClick={this.open}
              >
                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </Button>
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
});

module.exports = Item;
