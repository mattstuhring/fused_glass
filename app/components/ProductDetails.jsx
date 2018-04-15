import React from 'react';
import axios from 'axios';
import Header from 'Header';
import { Link } from 'react-router';
import { Thumbnail, Panel, Button } from 'react-bootstrap';

import { Image } from 'cloudinary-react';

const cloudName = 'fusedglassbyceleste';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: null,
      description: '',
      image: '',
      primaryImage: '',
      secondaryImages: [],
      name: '',
      price: '',
      size: ''
    };

    this.handleImage = this.handleImage.bind(this);
  }


  // GET PRODUCT DETAILS BY ID
  componentDidMount() {
    axios.get(`api/products/${this.props.params.id}`)
      .then((res) => {
        const data = res.data[0];

        console.log(data, '************* data');

        this.setState({
          productId: this.props.params.id,
          description: data.product_description,
          primaryImage: data.product_image_public_id,
          image: data.product_image_public_id,
          name: data.product_name,
          price: data.product_price,
          size: data.product_size
        });
      })
      .then(() => {
        axios.get(`api/images/${this.props.params.id}`)
          .then((r) => {
            console.log(r, '********* response');
            let images = Object.assign([], this.state.secondaryImages);

            r.data.forEach((img) => {
              return images.push(img.image_public_id);
            });

            this.setState({ secondaryImages: images });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  componentWillUnmount() {
    this.setState({ productId: null, description: '', primaryImage: '', name: '', price: '', size: '', image: '' });
  }


  handleImage(img) {
    this.setState({ image: img });
  }


  // *************************  RENDER  *************************
  render() {
    const {productId, description, primaryImage, name, price, size, image} = this.state;

    const secondaryImgs = () => {
      if (this.state.secondaryImages > 0) {
        this.state.secondaryImages.map((img, i) => {
          console.log(img, '******** img');
          return <div className="col-sm-3" key={i}>
            <Thumbnail href="#" src={`https://res.cloudinary.com/fusedglassbyceleste/w_300,h_200,c_pad/${img}`} onClick={() => this.handleImage(img)}/>

            {/* <Image cloudName={cloudName} publicId={img} width="100" height="50" crop="pad" /> */}
          </div>;
        })
      }
     }

    return <div className="row details">
      {/* HEADER */}
      <div className="col-sm-12">
        <Header category="Product Details"/>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12 text-center">
              <Panel>
                <Image cloudName={cloudName} publicId={image} width="300" height="200" crop="pad" />
              </Panel>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3">
              <Thumbnail href="#" src={`https://res.cloudinary.com/fusedglassbyceleste/w_300,h_200,c_pad/${primaryImage}`} onClick={() => this.handleImage(primaryImage)}/>

                {/* <Image cloudName={cloudName} publicId={primaryImage} width="100" height="50" crop="pad" /> */}
            </div>

            {secondaryImgs()}
          </div>
        </div>


        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12">
              <h3>Name: <small>{name}</small></h3>
              <h3>Description: <small>{description}</small></h3>
              <h3>Size: <small>{size}</small></h3>
              <h3>Price: <small>{price}</small></h3>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Link to={`/cart/${productId}`}>
                <Button bsStyle="primary">
                  Add to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
