import React from 'react';
import axios from 'axios';
import Header from 'Header';
import { Table, Image, Button } from 'react-bootstrap';


export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    }

    this.removeProduct = this.removeProduct.bind(this);
  }


  componentDidMount() {
    axios.get(`api/products/${this.props.params.id}`)
      .then((res) => {
        const data = res.data[0];
        const entry = {
          productId: this.props.params.id,
          name: data.product_name,
          image: data.product_image,
          price: data.product_price,
          size: data.product_size
        };

        let existingEntries = JSON.parse(sessionStorage.getItem("allEntries"));

        if (existingEntries === null) {
          existingEntries = [];
          console.log('storage is null');
        }

        if (existingEntries.length >= 1) {
          let exists = false;

          for (let i = 0; i < existingEntries.length; i++) {
            if (existingEntries[i].productId === this.props.params.id) {
              exists = true;
              break;
            }
          }

          if (exists === true) {
            this.setState({products: JSON.parse(sessionStorage.getItem("allEntries"))});
            console.log('Product already in shopping cart!');

            return;
          }
        }

        sessionStorage.setItem("entry", JSON.stringify(entry));

        // Save allEntries back to local storage
        existingEntries.push(entry);
        sessionStorage.setItem("allEntries", JSON.stringify(existingEntries));

        this.setState({products: JSON.parse(sessionStorage.getItem("allEntries"))});
      })
      .catch((err) => {
        console.log(err);
      });
  }


  removeProduct(productId) {
    let existingEntries = JSON.parse(sessionStorage.getItem("allEntries"));

    for (let i = 0; i < existingEntries.length; i++) {
      if (existingEntries[i].productId === productId) {
        existingEntries.splice(i, 1);
        break;
      }
    }

    sessionStorage.setItem("allEntries", JSON.stringify(existingEntries));
    this.setState({products: JSON.parse(sessionStorage.getItem("allEntries"))});
  }


  // ***************************  RENDER  ********************************
  render() {
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
              {this.state.products.map((p) => {
                return <tr key={p.productId}>
                  <td style={{width: '200px'}}>
                    <Image src={`images/uploads/${p.image}`} thumbnail responsive />
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
              })}
            </tbody>

          </Table>
        </div>

      </div>
    );
  }
}
