import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import Header from 'Header';
import { Thumbnail, Table, Image, Button } from 'react-bootstrap';

export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    }

    this.removeProduct = this.removeProduct.bind(this);
  }


  componentDidMount() {
    if (this.props.params.id) {
      axios.get(`/api/products/${this.props.params.id}`)
        .then((res) => {
          console.log(res, '******** res');
          const data = res.data[0];

          const product = {
            productId: this.props.params.id,
            name: data.product_name,
            image: data.product_image_public_id,
            price: data.product_price,
            size: data.product_size
          };

          let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

          if (!existingProducts) {
            console.log('storage does not exist');

            existingProducts = [];
          }

          let exists = false;

          for (let i = 0; i < existingProducts.length; i++) {
            if (existingProducts[i].productId === this.props.params.id) {
              exists = true;
              break;
            }
          }

          if (exists) {
            console.log('Product already in shopping cart!');

            sessionStorage.removeItem('product');

            this.setState({products: JSON.parse(sessionStorage.getItem('allProducts'))});
          } else {
            console.log(product, '***** product to add in shopping cart ');

            sessionStorage.setItem('product', JSON.stringify(product));

            // Save allProducts back to local storage
            existingProducts.push(product);
            sessionStorage.setItem('allProducts', JSON.stringify(existingProducts));

            this.setState({products: JSON.parse(sessionStorage.getItem('allProducts'))});
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

      if (!existingProducts) {
        console.log('storage does not exist');

        existingProducts = [];
      }

      this.setState({ products: existingProducts });
    }
  }


  removeProduct(productId) {
    let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

    for (let i = 0; i < existingProducts.length; i++) {
      if (existingProducts[i].productId === productId) {
        existingProducts.splice(i, 1);
        break;
      }
    }

    sessionStorage.removeItem('product');
    sessionStorage.setItem('allProducts', JSON.stringify(existingProducts));

    this.setState({products: JSON.parse(sessionStorage.getItem('allProducts'))});

    browserHistory.push('/cart');
  }


  // ***************************  RENDER  ********************************
  render() {
    const checkProducts = () => {
      if (this.state.products.length > 0) {
        return this.state.products.map((p) => {
          return <tr key={p.productId}>
            <td style={{width: '200px'}}>

              <Thumbnail
                href="#"
                src={`https://res.cloudinary.com/fusedglassbyceleste/w_300,h_200,c_pad/${p.image}`}
                onClick={() => this.handleImage(p.image)}
              />

            </td>
            <td>{p.name}</td>
            <td>{p.price}</td>
            <td>
              <Button
                bsStyle="danger"
                onClick={() => this.removeProduct(p.productId)}
              >
                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </Button>
            </td>
          </tr>
        });
      } else {
        return <tr>
          <td>Your shopping cart is empty.  Time to go shopping!</td>
        </tr>
      }
    };

    return (
      <div className="row">
        <div className="col-sm-12">
          <Header category="Shopping Cart"/>
        </div>

        <div className="col-sm-12">
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td>Total:</td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              { checkProducts() }
            </tbody>

          </Table>
        </div>

      </div>
    );
  }
}
