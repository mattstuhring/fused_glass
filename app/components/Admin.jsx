import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel}
  from 'react-bootstrap';
import FieldGroup from 'FieldGroup';
import Header from 'Header';


export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: [],
      collectionId: null,
      description: '',
      name: '',
      price: '',
      size: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleCollection = this.handleCollection.bind(this);
  }

  // HANDLE CHANGE
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  // GET ALL COLLECTIONS FROM CATEGORY
  handleCategory(event) {
    const value = event.target.value;
    let categoryId;

    switch (value) {
      case 'decorative':
        categoryId = 1;
        break;
      case 'houseware':
        categoryId = 2;
        break;
      case 'jewelry':
        categoryId = 3;
        break;
      case 'garden':
        categoryId = 4;
        break;
    }

    axios.get(`/api/categories/${categoryId}/collections`)
      .then((res) => {
        console.log(res.data, '********** res.data');
        this.setState({collections: res.data, category: value, categoryId: categoryId})
      })
      .catch((err) => {
        console.log(err, 'error');
      });
  }

  // HANDLE COLLECTIONS
  handleCollection(event) {
    console.log(event.target.value, '****** collection');
    const id = event.target.value;

    this.setState({
      collectionId: id
    });
  }

  // HANDLE FORM SUBMIT
  handleSubmit(event) {
    event.preventDefault();

    const product = {
      category: this.state.category,
      categoryId: this.state.categoryId,
      collectionId: this.state.collectionId,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      size: this.state.size
    };
    console.log(product, '****** product');

    axios({
      method: 'post',
      url: '/api/categories/collections',
      data: { product }
    });

    this.setState({
      category: '',
      categoryId: null,
      collection: '',
      collectionId: null,
      name: '',
      description: '',
      price: '',
      size: ''
    });
  }


  render() {
    const title = (
      <h3>Add New Product</h3>
    );

    return (
      <div className="admin">

        {/* HEADER */}
        <Header title="Admin"/>

        <Panel header={title} bsStyle="primary">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-sm-6">

                {/* CATEGORY & COLLECTION */}
                <div className="row">
                  <div className="col-sm-6">
                    <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Category</ControlLabel>
                      <FormControl
                        componentClass="select"
                        placeholder="select"
                        onChange={this.handleCategory}
                        value={this.state.category}
                      >
                        <option>select...</option>
                        <option value="decorative">Decorative</option>
                        <option value="houseware">Houseware</option>
                        <option value="jewelry">Jewelry</option>
                        <option value="garden">Garden</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                  <div className="col-sm-6">
                    <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Collection</ControlLabel>
                      <FormControl
                        componentClass="select"
                        placeholder="select"
                        onChange={this.handleCollection}
                        value={this.state.collection}
                      >
                        <option>Select...</option>
                        {this.state.collections.map((e) => {
                          return <option
                            key={e.id}
                            value={e.id}
                          >
                            {e.collection_name}
                          </option>
                        }, this)}
                      </FormControl>
                    </FormGroup>
                  </div>
                </div>

                {/* NAME */}
                <FieldGroup
                  id="formControlsText"
                  type="text"
                  label="Name"
                  placeholder="Enter name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />

                {/* DESCRIPTION */}
                <FieldGroup
                  id="formControlsText"
                  type="text"
                  componentClass="textarea"
                  label="Description"
                  placeholder="Enter description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />

                {/* PRICE & SIZE */}
                <div className="row">
                  <div className="col-sm-6">
                    <FieldGroup
                      id="formControlsText"
                      type="text"
                      label="Price"
                      placeholder="Enter price"
                      name="price"
                      value={this.state.price}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <FieldGroup
                      id="formControlsText"
                      type="text"
                      label="Size"
                      placeholder="Enter size"
                      name="size"
                      value={this.state.size}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE & FILE */}
              <div className="col-sm-6 text-center">
                <Thumbnail src="http://www.fillmurray.com/300/200">
                  <FieldGroup
                    id="formControlsFile"
                    type="file"
                    help="Example block-level help text here."
                  />
                </Thumbnail>
              </div>
            </div>

            {/* SUBMIT & CANCEL BTN */}
            <div className="row">
              <div className="col-sm-3 col-sm-offset-3">
                <Button bsStyle="primary" type="submit">Submit</Button>
              </div>
              <div className="col-sm-3">
                <Button bsStyle="danger" type="button">Cancel</Button>
              </div>
            </div>
          </form>
        </Panel>
      </div>
    );
  }
}
