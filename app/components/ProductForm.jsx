import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup}
  from 'react-bootstrap';
import FieldGroup from 'FieldGroup';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';


export default class ProductForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: [],
      description: '',
      images: [],
      name: '',
      price: '',
      size: '',
      options: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleCollections = this.handleCollections.bind(this);
    this.handleImages = this.handleImages.bind(this);
  }


  // HANDLE ALL FORM INPUT CHANGE EVENTS
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
        var options = res.data.map((e) => {
          return {
            value: e.collection_name,
            label: e.collection_name
          }
        });

        this.setState({
          category: value,
          categoryId: categoryId,
          options: options
        });
      })
      .catch((err) => {
        console.log(err, 'error');
      });
  }


  // SUBMIT NEW PRODUCT TO DATABASE
  handleSubmit(event) {
    event.preventDefault();
    var collections = this.state.collections.split(',');

    const product = {
      category: this.state.category,
      categoryId: this.state.categoryId,
      collections: collections,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      size: this.state.size
    };

    axios({
      method: 'post',
      url: '/api/categories/collections',
      data: { product }
    });

    this.setState({
      category: '',
      categoryId: null,
      collections: [],
      name: '',
      description: '',
      price: '',
      size: ''
    });
  }


  // HANDLE NEW COLLECTION INPUT CHANGE EVENTS
  handleCollections(val) {
    this.setState({collections: val})
  }

  // removeImage(event) {
  //   event.preventDefault();
  //
  //   let updatedImages = Object.assign([], this.state.images);
  //   updatedImages.splice(event.target.id, 1);
  //
  //   this.setState({ images: updatedImages });
  // }

  handleImages(images) {
    console.log(images);
  }


  // **************************   RENDER   ***********************************
  render() {
    const title = (
      <h3>{this.props.params.action}</h3>
    );

    // CONDITIONAL TO DISPLAY ADD OR UPDATE PRODUCT BUTTON CONFIG
    const buttonAction = () => {
      if (this.props.params.id) {
        return <div className="row">
          <div className="col-sm-3 col-sm-offset-3">
            <Button bsStyle="primary" type="submit">Save</Button>
          </div>
          <div className="col-sm-3">
            <Button
              bsStyle="danger"
              type="button"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </div>;
      } else {
        return <div className="row">
          <div className="col-sm-3 col-sm-offset-3">
            <Button bsStyle="primary" type="submit">Add</Button>
          </div>
          <div className="col-sm-3">
            <Button bsStyle="danger" type="button">Clear</Button>
          </div>
        </div>;
      }
    };


    return (
      <div className="admin">

        {/* HEADER */}
        <Header category="Admin"/>

        <Panel header={title} bsStyle="primary">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-sm-6">


                {/* CATEGORY & COLLECTION */}
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
                <FormGroup controlId="formControlsSelect">
                  <ControlLabel>Collection</ControlLabel>
                  <Select
                    multi={true}
                    simpleValue={true}
                    value={this.state.collections}
                    options={this.state.options}
                    onChange={this.handleCollections}
                  />
                </FormGroup>


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
                    <FormGroup controlId="formControlsText">
                      <ControlLabel>Price</ControlLabel>
                      <InputGroup>
                        <InputGroup.Addon>$</InputGroup.Addon>
                        <FormControl
                          type="text"
                          placeholder="Enter price"
                          name="price"
                          value={this.state.price}
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                    </FormGroup>
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
                <DropzoneComponent
                  config={{
                    showFiletypeIcon: true,
                    postUrl: 'no-url'
                  }}
                  eventHandlers={{addedfile: (file) => this.handleImages(file)}}
                  djsConfig={{addRemoveLinks: true}}
                />
              </div>
            </div>


            {/* SUBMIT & CANCEL BTN */}
            {buttonAction()}
          </form>
        </Panel>
      </div>
    );
  }
}
