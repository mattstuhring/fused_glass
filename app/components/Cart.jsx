import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import axios from 'axios';
import Header from 'Header';
import { Thumbnail, Table, Image, Button } from 'react-bootstrap';
import paypal from 'paypal-checkout';
import qs from 'qs';
let PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      total: '0.00', // DISPLAY AS STRING DATA TYPE
      env: 'sandbox',
      client: {
          sandbox: 'AX3x_CybpUYv5tqxs48pCnRO4yifsqtc8ZPnS_DHTfx9aXP5JkXeUMvXBM-Fn9W90WqMjwsTYLyX-4-k'
      },
      commit: true
    }

    this.removeProduct = this.removeProduct.bind(this);
    this.handleAddTotal = this.handleAddTotal.bind(this);
    this.handleSubtractTotal = this.handleSubtractTotal.bind(this);
  }


  componentDidMount() {
    let productId = this.props.params.id;

    if (productId) {
      axios.get(`/api/products/${productId}`)
        .then((res) => {
          const data = res.data[0];

          const product = {
            productId: productId,
            name: data.product_name,
            image: data.product_image_public_id,
            price: data.product_price,
            size: data.product_size
          };

          // CHECK STORAGE FOR ALL EXISTING PRODUCTS
          let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

          // IF NO PRODUCTS EXIST
          if (!existingProducts) {
            existingProducts = [];
          }

          let exists = false;

          // CHECK STORAGE ALL EXISTING PRODUCTS FOR IF PRODUCT ALREADY EXISTING IN STORAGE
          for (let i = 0; i < existingProducts.length; i++) {
            if (existingProducts[i].productId === productId) {
              exists = true;
              break;
            }
          }

          // IF PRODUCT ALREADY EXISTS IN ALL PRODUCTS STORAGE
          if (exists) {
            console.log('already in cart!');

            // REMOVE PRODUCT FROM PRODUCT STORAGE
            sessionStorage.removeItem('product');

            // GET CART TOTAL FROM STORAGE
            let existingTotal = sessionStorage.getItem('total');

            this.setState({products: JSON.parse(sessionStorage.getItem('allProducts')), total: existingTotal });
          } else {
            console.log(product, '***** add in cart ');

            // SAVE PRODUCT TO PRODUCT STORAGE
            sessionStorage.setItem('product', JSON.stringify(product));

            // PUSH NEW PRODUCT IN EXISTING PRODUCTS ARRAY
            existingProducts.push(product);

            // SAVE ALL PRODUCTS TO ALL EXISTING PRODUCTS STORAGE
            sessionStorage.setItem('allProducts', JSON.stringify(existingProducts));

            // HANDLE CART CURRENCY TOTAL ADDITION
            this.handleAddTotal(data.product_price);

            this.setState({products: JSON.parse(sessionStorage.getItem('allProducts'))});
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // IF NO PRODUCT ID PARAMS EXISTS

      // GET ALL EXISTING PRODUCTS FROM STORAGE
      let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

      // GET CART TOTAL FROM STORAGE
      let existingTotal = sessionStorage.getItem('total');

      if (!existingProducts) {
        existingProducts = [];
      }

      if (!existingTotal) {
        existingTotal = '0.00';
      }

      this.setState({ products: existingProducts, total: existingTotal });
    }
  }







  handleAddTotal(price) {
    let total = parseFloat(sessionStorage.getItem('total'));
    let sum;

    if (!total) {
      total = parseFloat(this.state.total);
    }

    price = parseFloat(price);
    sum = (total + price).toFixed(2); // RETURNS STRING

    sessionStorage.setItem('total', sum);

    this.setState({ total: sum });
  }




  handleSubtractTotal(price) {
    let total = parseFloat(sessionStorage.getItem('total'));
    let sum;

    price = parseFloat(price);
    sum = (total - price).toFixed(2); // RETURNS STRING

    if (parseFloat(sum) <= 0) {
      sum = '0.00';
    }

    sessionStorage.setItem('total', sum);

    this.setState({ total: sum });
  }








  removeProduct(productId, price) {
    let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));

    this.handleSubtractTotal(price);

    for (let i = 0; i < existingProducts.length; i++) {
      if (existingProducts[i].productId === productId) {
        existingProducts.splice(i, 1);
        break;
      }
    }

    // GET CART TOTAL FROM STORAGE
    let existingTotal = sessionStorage.getItem('total');

    sessionStorage.removeItem('product');
    sessionStorage.setItem('allProducts', JSON.stringify(existingProducts));

    this.setState({products: JSON.parse(sessionStorage.getItem('allProducts')), total: existingTotal});

    browserHistory.push('/cart');
  }





  // ***************************  RENDER  ********************************
  render() {






    let payment = (data, actions) => {

      // GET ALL EXISTING PRODUCTS FROM SESSION STORAGE
      let existingProducts = JSON.parse(sessionStorage.getItem('allProducts'));
      console.log(existingProducts, '********* products from storage');

      // CHECK SHOPPING CART FOR PRODUCTS
      if (existingProducts.length > 0) {

        // PAYLOAD ARRAY OF PRODUCT ID'S
        let payload = {
          productsIDs: []
        };

        // ITERATE THROUGH EXISTING PRODUCTS AND CREATE PAYLOAD
        existingProducts.forEach((el) => {
          return payload.productsIDs.push(el.productId);
        });


        console.log(payload, '********* payload');

        // GET PRODUCTS FROM DB
        axios.post('/api/productQty', payload)
          .then((prod) => {
            console.log(prod, '***** products from DB');


            // CHECK IF EACH PRODUCT HAS A QUANTITY > 0
            


            // return actions.request.post('/api/createPayment')
            //   .then((res) => {
            //     return res.id;
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //   });

          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        console.log('No products');
      }


      // return actions.request.post('/api/createPayment')
      //   .then((res) => {
      //     return res.id;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }




















    let onAuthorize = (data, actions) => {
      let payload = {
        paymentID: data.paymentID,
        payerID:   data.payerID
      }

      return axios.post('/api/executePayment', payload)
        .then((res) => {
          console.log(res, '******* onAuthorize success!')
        })
        .catch((err) => {
          console.log(err);
        });
    };

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
                onClick={() => this.removeProduct(p.productId, p.price)}
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

    const paypalCheckout = () => {
      if (this.state.products.length > 0) {
        return <div className="row">
          <div className="col-sm-12">
            <PayPalButton
              commit={this.state.commit}
              env={this.state.env}
              payment={payment}
              onAuthorize={onAuthorize}
            />
          </div>
        </div>
      }
    };


    // ***********************  JSX COMPONENT  ************************
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
            <tbody>
              {checkProducts()}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Total: ${this.state.total}</td>
              </tr>
            </tfoot>
          </Table>
        </div>

        {paypalCheckout()}
      </div>
    );
  }
}
