import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup}
  from 'react-bootstrap';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';


export default class ProductForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: [],
      description: '',
      primaryImage: [],
      secondaryImages: [],
      name: '',
      price: '',
      size: '',
      options: null,
      primaryDropzone: {},
      secondaryDropzone: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleCollections = this.handleCollections.bind(this);
    this.handlePrimaryImage = this.handlePrimaryImage.bind(this);
    this.handleSecondaryImages = this.handleSecondaryImages.bind(this);
    this.handlePrimaryDropzone = this.handlePrimaryDropzone.bind(this);
    this.handleSecondaryDropzone = this.handleSecondaryDropzone.bind(this);
    this.removeAllFiles = this.removeAllFiles.bind(this);
    this.categoryValidation = this.categoryValidation.bind(this);
    this.collectionValidation = this.collectionValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
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


  // ADD NEW PRODUCT TO DATABASE
  handleSubmit(event) {
    event.preventDefault();

    // let request;
    //
    // if (this.props.params.id) {
    //   request = superagent.put('/api/products/update')
    //     .field('productId', this.props.params.id);
    // } else {
    //   request = superagent.post('/api/categories/collections');
    // }

    const primary = this.state.primaryImage;
    const secondary = this.state.secondaryImages;
    const collections = this.state.collections.split(',');
    const product = {
      category: this.state.category,
      categoryId: this.state.categoryId,
      collections: collections,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      size: this.state.size
    };

    superagent
      .post('/api/categories/collections')
      .field('category', this.state.category)
      .field('categoryId', this.state.categoryId)
      .field('collections', this.state.collections)
      .field('name', this.state.name)
      .field('description', this.state.description)
      .field('price', this.state.price)
      .field('size', this.state.size)
      .attach('primary', primary)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.log(err);
          return;
        }

        const req = superagent.post('/api/products/images');

        // POST ALL SECONDARY IMAGES
        secondary.forEach((img)=> {
          req.attach('images', img).field('id', res.body[0])
        });

        req.end((err, res) => {
         if (err) {
           console.log(err);
           return;
         }

         console.log(res.body, '********** SUCCESS');
        });
      });

    this.removeAllFiles(this.state.primaryDropzone);
    this.removeAllFiles(this.state.secondaryDropzone);

    this.setState({
      category: '',
      categoryId: null,
      collections: [],
      name: '',
      description: '',
      price: '',
      size: '',
      primaryDropzone: null,
      secondaryDropzone: null
    });
  }


  // HANDLE NEW COLLECTION INPUT CHANGE EVENTS
  handleCollections(val) {
    this.setState({collections: val})
  }

  // ASSIGN PRIMARY DROPZONE OBJECT TO STATE
  handlePrimaryDropzone(obj) {
    this.setState({ primaryDropzone: obj });
  }

  // ASSIGN SECONDARY DROPZONE OBJECT TO STATE
  handleSecondaryDropzone(obj) {
    this.setState({ secondaryDropzone: obj });
  }

  // REMOVE ALL FILES FROM DROPZONE COMPONENT ON FORM SUBMIT
  removeAllFiles(dropzone) {
    if (dropzone) {
      dropzone.removeAllFiles();
    }
  }

  // UPDATE PRIMARY IMAGE STATE
  handlePrimaryImage(file) {
    this.setState({ primaryImage: file })
  }

  // UPDATE SECONDARY IMAGES STATE
  handleSecondaryImages(files) {
    let images = Object.assign([], this.state.secondaryImages);
    images.push(files);

    this.setState({ secondaryImages: images });
  }


  categoryValidation() {
    if (this.state.category === '') return null;
    else if (this.state.category.length > 0) return 'success';
  }

  collectionValidation() {
    if (this.state.collections === []) return null;
    else if (this.state.collections.length > 0) return 'success';
  }

  textValidation(field) {
    if (field === '') return null;
    else if (field.length > 0) return 'success';
  }














  // **************************   RENDER   ***********************************
  render() {
    const title = (
      <h3>{this.props.params.action}</h3>
    );

    // CONDITIONAL TO DISPLAY THE ADD OR UPDATE PRODUCT BUTTON CONFIG
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

                <div className="page-header text-center">
                  <h4>Product Details</h4>
                </div>

                {/* CATEGORY & COLLECTION */}
                <FormGroup
                  controlId="formControlsSelect"
                  validationState={this.categoryValidation()}
                >
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
                <FormGroup
                  controlId="formControlsSelect"
                  validationState={this.collectionValidation()}
                >
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
                <FormGroup
                  controlId="formControlsText"
                  validationState={this.textValidation(this.state.name)}
                >
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </FormGroup>


                {/* DESCRIPTION */}
                <FormGroup
                  controlId="formControlsTextarea"
                  validationState={this.textValidation(this.state.description)}
                >
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    placeholder="textarea"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </FormGroup>


                {/* PRICE & SIZE */}
                <div className="row">
                  <div className="col-sm-6">
                    <FormGroup
                      controlId="formControlsText"
                      validationState={this.textValidation(this.state.price)}
                    >
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
                    <FormGroup
                      controlId="formControlsText"
                      validationState={this.textValidation(this.state.size)}
                    >
                      <ControlLabel>Size</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Enter size"
                        name="size"
                        value={this.state.size}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>


              {/* IMAGES */}
              <div className="col-sm-6 text-center">
                <div className="page-header">
                  <h4>Primary Image <small>(Max: 1)</small></h4>
                </div>
                <DropzoneComponent
                  config={{
                    iconFiletypes: ['.jpg', '.png'],
                    showFiletypeIcon: true,
                    postUrl: 'no-url',
                    maxFiles: 1
                  }}
                  eventHandlers={{
                    addedfile: (file) => this.handlePrimaryImage(file),
                    init: (obj) => this.handlePrimaryDropzone(obj)
                  }}
                  djsConfig={{addRemoveLinks: true}}
                />

                <div className="page-header">
                  <h4>Secondary Images <small>(Max: 4)</small></h4>
                </div>
                <DropzoneComponent
                  config={{
                    iconFiletypes: ['.jpg', '.png'],
                    showFiletypeIcon: true,
                    postUrl: 'no-url'
                  }}
                  eventHandlers={{
                    addedfile: (file) => this.handleSecondaryImages(file),
                    init: (obj) => this.handleSecondaryDropzone(obj)
                  }}
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
