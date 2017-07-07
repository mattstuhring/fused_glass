import React from 'react';
import axios from 'axios';
import Header from 'Header';
import {Image, Thumbnail, Panel} from 'react-bootstrap';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      image: 'http://www.fillmurray.com/300/200',
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
          image: data.product_image,
          name: data.product_name,
          price: data.product_price,
          size: data.product_size
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.setState({description: '', image: '', name: '', price: '', size: ''});
  }

  handleImage(img) {
    console.log(img, '********** image');
    this.setState({ image: img });
  }


  // *************************  RENDER  *************************
  render() {
    const {description, image, name, price, size} = this.state;

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
                <Image className="primary-image" src={this.state.image} rounded responsive/>
              </Panel>
            </div>
          </div>

          <div className="row">
            {this.props.images.map((img, i) => {
              return <div className="col-sm-3" key={i}>
                <Thumbnail href="#" src={img} onClick={() => this.handleImage(img)}/>
              </div>
            })}
          </div>
        </div>


        <div className="col-sm-6">
          <h3>Name: <small>{name}</small></h3>
          <h3>Description: <small>{description}</small></h3>
          <h3>Size: <small>{size}</small></h3>
          <h3>Price: <small>{price}</small></h3>
        </div>
      </div>
    </div>
  }
}

ProductDetails.defaultProps = {
  images: [
    'http://www.fillmurray.com/300/200',
    'https://placebear.com/300/200',
    'http://baconmockup.com/300/200',
    'http://lorempizza.com/300/200'
  ]
};
