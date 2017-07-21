import React from 'react';
import axios from 'axios';
import Header from 'Header';
import {Image, Thumbnail, Panel, Button} from 'react-bootstrap';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

        this.setState({
          description: data.product_description,
          primaryImage: data.product_image,
          image: data.product_image,
          name: data.product_name,
          price: data.product_price,
          size: data.product_size
        });
      })
      .then(() => {
        axios.get(`api/images/${this.props.params.id}`)
          .then((r) => {
            console.log(r.data, '********* secondary images');

            let images = Object.assign([], this.state.secondaryImages);

            r.data.forEach((img) => {
              return images.push(img.image_name);
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
    this.setState({description: '', primaryImage: '', name: '', price: '', size: ''});
  }

  handleImage(img) {
    this.setState({ image: img });
  }


  // *************************  RENDER  *************************
  render() {
    const {description, primaryImage, name, price, size} = this.state;

    return <div className="row details">
      {/* HEADER */}
      <div className="col-sm-12">
        <Header category="Product Details"/>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12">
              <Panel>
                <Image className="primary-image" src={`images/uploads/${this.state.image}`} rounded responsive/>
              </Panel>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3">
              <Thumbnail href="#" src={`images/uploads/${this.state.primaryImage}`} onClick={() => this.handleImage(this.state.primaryImage)}/>
            </div>

            {this.state.secondaryImages.map((img, i) => {
              return <div className="col-sm-3" key={i}>
                <Thumbnail href="#" src={`images/uploads/${img}`} onClick={() => this.handleImage(img)}/>
              </div>
            })}
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
              <Button bsStyle="primary">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
