import React from 'react';
import axios from 'axios';
import { Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router';
import Header from 'Header';
import { Image } from 'cloudinary-react';
import AuthService from 'AuthService';
const cloudName = 'fusedglassbyceleste';


export default class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      collectionId: null,
      name: '',
      description: '',
      price: '',
      id: null
    };

    this.Auth = new AuthService();
  }

  componentDidMount() {
    axios.get(`/api/collections/${this.props.params.id}`)
      .then((res) => {
        this.setState({
          products: res.data,
          collectionId: this.props.params.id
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
            products: res.data,
            collectionId: nextProps.params.id
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // ***************************  RENDER  ********************************
  render() {
    const { collection } = this.props.params;

    const edit = (
      <Tooltip id="tooltip"><strong>Edit</strong></Tooltip>
    );

    const availableProducts = () => {
      if (this.state.products.length === 0) {
        return (<div>
          <h4 className="text-center"><em>No products to display!</em></h4>
        </div>);
      } else {
        if (this.Auth.loggedIn()) {
          return this.state.products.map((p) => {
            return <div className="col-sm-4" key={p.product_id}>
              <div className="thumbnail">
                <div className="row btn-wrap">
                  <div className="col-sm-12 text-right">
                    <OverlayTrigger placement="top" overlay={edit}>
                      {/* LINK TO UPDATE PRODUCT FORM */}
                      <Link to={`/productupdate/${p.product_id}`}>
                        <Button bsStyle="success">
                          <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </Button>
                      </Link>
                    </OverlayTrigger>
                  </div>
                </div>

                <Image cloudName={cloudName} publicId={p.product_image_public_id} width="300" height="200" crop="pad" />

                <div className="caption">
                  <h4>{p.product_name}</h4>
                  <p>{p.product_description}</p>
                  <p>{p.product_price}</p>
                  <Link to={`/productdetails/${p.product_id}`}>
                    <Button bsStyle="primary">Buy Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          });
        } else {
          return this.state.products.map((p) => {
            return <div className="col-sm-4" key={p.product_id}>
              <div className="thumbnail img-padd">

                <Image cloudName={cloudName} publicId={p.product_image_public_id} width="300" height="200" crop="pad" />

                <div className="caption">
                  <h4>{p.product_name}</h4>
                  <p>{p.product_description}</p>
                  <p>{p.product_price}</p>
                  <Link to={`/productdetails/${p.product_id}`}>
                    <Button bsStyle="primary">Buy Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          });
        }
      }
    }

    return (
      <div>
        <Header category={this.props.params.category} collection={this.props.params.collection}/>

        {availableProducts()}

      </div>
    );
  }
}
