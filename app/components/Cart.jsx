import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import Header from 'Header';
import { Thumbnail, Table, Image, Button } from 'react-bootstrap';

export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      total: '0.00' // DISPLAY AS STRING DATA TYPE
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
        existingTotal = '0.00'
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



    const checkoutPayPal = () => {
      return paypal.Button.render({

        // Set up a getter to create a Payment ID using the payments api, on your server side:

        payment: function() {
            return new paypal.Promise(function(resolve, reject) {

                // Make an ajax call to get the Payment ID. This should call your back-end,
                // which should invoke the PayPal Payment Create api to retrieve the Payment ID.

                // When you have a Payment ID, you need to call the `resolve` method, e.g `resolve(data.paymentID)`
                // Or, if you have an error from your server side, you need to call `reject`, e.g. `reject(err)`

                axios.post('/my-api/create-payment')
                  .then(function(data) {
                    resolve(data.paymentID);
                  })
                  .catch(function(err)  {
                    reject(err);
                  });
            });
        },

        // Pass a function to be called when the customer approves the payment,
        // then call execute payment on your server:

        onAuthorize: function(data) {

            console.log('The payment was authorized!');
            console.log('Payment ID = ',   data.paymentID);
            console.log('PayerID = ', data.payerID);

            // At this point, the payment has been authorized, and you will need to call your back-end to complete the
            // payment. Your back-end should invoke the PayPal Payment Execute api to finalize the transaction.

            axios.post('/my-api/execute-payment', { paymentID: data.paymentID, payerID: data.payerID })
                .done(function(data) { /* Go to a success page */ })
                .fail(function(err)  { /* Go to an error page  */  });
        },

        // Pass a function to be called when the customer cancels the payment

        onCancel: function(data) {

            console.log('The payment was cancelled!');
            console.log('Payment ID = ', data.paymentID);
        }

      });
    }








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
                <td>Total: ${this.state.total}</td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              {checkProducts()}
            </tbody>

          </Table>
        </div>

        <div className="row">
          <div className="col-sm-12">



          </div>
        </div>
      </div>
    );
  }
}
