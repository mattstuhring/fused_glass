import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup}
  from 'react-bootstrap';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';



export default class ProductAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: [],
      collectionIds: [],
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
    this.categoryValidation = this.categoryValidation.bind(this);
    // this.collectionValidation = this.collectionValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
    this.handleCategoryCollections = this.handleCategoryCollections.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
  }


  // componentDidMount() {
  //
  // }


  // HANDLE ALL FORM INPUT CHANGE EVENTS
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }


  // GET ALL COLLECTIONS FROM CATEGORY
  handleCategory(event, val) {
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



  // HANDLE NEW COLLECTION INPUT CHANGE EVENTS
  handleCollections(val) {
    this.setState({collections: val})
  }

  handleRemoveCollection(val) {
    console.log(val, '************ val');
  }





  // INIT PRIMARY DROPZONE
  handlePrimaryDropzone(obj) {
    this.setState({ primaryDropzone: obj });
  }

  // UPDATE PRIMARY IMAGE CHANGE
  handlePrimaryImage(file) {
    this.setState({ primaryImage: file});
  }

  // ASSIGN SECONDARY DROPZONE OBJECT TO STATE
  handleSecondaryDropzone(obj) {
    this.setState({ secondaryDropzone: obj });
  }


  // UPDATE SECONDARY IMAGES STATE
  handleSecondaryImages(files) {
    let images = Object.assign([], this.state.secondaryImages);
    images.push(files);

    this.setState({ secondaryImages: images });
  }


  // REMOVE IMAGES FROM PRIMARY & SECONDARY DROPZONE COMPONENTS
  handleRemoveImage(file, component) {
    if (component === 'primary') {
      console.log(file, '******* pdz file remove');

    } else if (component === 'secondary') {
      console.log(file, '********** sdz file remove');

      // let imgPublicId = file.name;
      // axios.delete(`/api/images/${imgPublicId}/${this.prop.params.id}`)
      //   .then((res) => {
      //     console.log(res, '*********** RES');
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }
  }


  // SHOW SELECTED CATEGORY WHEN COMPONENT MOUNTS FOR UPDATING A PRODUCT
  handleCategoryCollections(categoryName, categoryId) {
    axios.get(`/api/categories/${categoryId}/collections`)
      .then((res) => {
        var options = res.data.map((e) => {
          return {
            value: e.collection_name,
            label: e.collection_name
          }
        });

        this.setState({
          category: categoryName,
          categoryId: categoryId,
          options: options
        });
      })
      .catch((err) => {
        console.log(err, 'error');
      });
  }





  // FORM SUBMIT NEW PRODUCT
  handleSubmit(event) {
    event.preventDefault();

    const primary = this.state.primaryDropzone.files;
    const secondary = this.state.secondaryDropzone.files;

    console.log(primary, '*********** PRIMARY');
    console.log(secondary, '*********** SECONDARY');

    // superagent.post('/api/products')
    //   .field('category', this.state.category)
    //   .field('categoryId', this.state.categoryId)
    //   .field('collections', this.state.collections)
    //   .field('name', this.state.name)
    //   .field('description', this.state.description)
    //   .field('price', this.state.price)
    //   .field('size', this.state.size)
    //   .attach('primary', primary[0])
    //   .then((res) => {
    //     let productId;
    //     productId = res.text;
    //     productId = parseInt(productId);
    //
    //     let reqImg = superagent.post('/api/images');
    //
    //     // POST SECONDARY IMAGES
    //     secondary.forEach((img) => {
    //       reqImg
    //         .field('id', productId)
    //         .field('category', this.state.category)
    //         .attach('images', img)
    //     });
    //
    //     reqImg.end((err, res) => {
    //       if (err) {
    //         console.log(err);
    //         return;
    //       }
    //
    //       console.log('NEW PRODUCT SUCCESS');
    //
    //       this.state.primaryDropzone.removeAllFiles();
    //       this.state.secondaryDropzone.removeAllFiles();
    //
    //       this.setState({
    //         category: '',
    //         categoryId: null,
    //         collections: [],
    //         name: '',
    //         description: '',
    //         price: '',
    //         size: '',
    //         primaryImage: [],
    //         secondaryImages: []
    //       });
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }















  // CATEGORY FORM VALIDATION
  categoryValidation() {
    if (this.state.category === '') return null;
    else if (this.state.category.length > 0) return 'success';
  }
  // COLLECTIONS FORM VALIDATION
  collectionValidation() {
    if (this.state.collections === []) return null;
    else if (this.state.collections.length > 0) return 'success';
  }

  // TEXT FORM VALIDATION
  textValidation(field) {
    if (field === '') return null;
    else if (field.length > 0) return 'success';
  }



  // **************************   RENDER   ***********************************
  render() {

    return (
      <div className="admin">

        {/* HEADER */}
        <Header category="Admin"/>

        <Panel header="ADD NEW PRODUCT" bsStyle="success">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-sm-6">

                <div className="page-header text-center">
                  <h4>PRODUCT DETAILS</h4>
                </div>

                {/* CATEGORY */}
                <FormGroup
                  controlId="formControlsSelect"
                  validationState={this.categoryValidation()}
                >
                  <ControlLabel>Category</ControlLabel>
                  <FormControl
                    componentClass="select"
                    // placeholder="Select a product category"
                    onChange={this.handleCategory}
                    value={this.state.category}
                  >
                    <option></option>
                    <option value="decorative">Decorative</option>
                    <option value="houseware">Houseware</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="garden">Garden</option>
                  </FormControl>
                </FormGroup>

                {/* COLLECTIONS */}
                <FormGroup
                  controlId="formControlsSelect"
                  validationState={this.collectionValidation()}
                >
                  <ControlLabel>Collections</ControlLabel>
                  <Select
                    multi={true}
                    simpleValue={true}
                    placeholder="Optional..."
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
                        name="size"
                        value={this.state.size}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>





              {/* REACT DROPZONE COMONENTS */}
              <div className="col-sm-6 text-center">
                <div className="page-header">
                  <h4>DISPLAY IMAGE <small><em>(Choose: 1)</em></small></h4>
                </div>


                {/* PRIMARY DROPZONE */}
                <DropzoneComponent
                  config={{
                    iconFiletypes: ['.jpg', '.png'],
                    showFiletypeIcon: true,
                    postUrl: 'no-url'
                  }}
                  eventHandlers={{
                    addedfile: (file) => this.handlePrimaryImage(file),
                    removedfile: (file) => this.handleRemoveImage(file, 'primary'),
                    init: (obj) => this.handlePrimaryDropzone(obj)
                  }}
                  djsConfig={{addRemoveLinks: true, maxFiles: 1}}
                />

                <div className="page-header">
                  <h4>MORE IMAGES <small><em>(Max: 4)</em></small></h4>
                </div>


                {/* SECONDARY DROPZONE */}
                <DropzoneComponent
                  config={{
                    iconFiletypes: ['.jpg', '.png'],
                    showFiletypeIcon: true,
                    postUrl: 'no-url'
                  }}
                  eventHandlers={{
                    addedfile: (file) => this.handleSecondaryImages(file),
                    removedfile: (file) => this.handleRemoveImage(file, 'secondary'),
                    init: (obj) => this.handleSecondaryDropzone(obj)
                  }}
                  djsConfig={{addRemoveLinks: true, maxFiles: 4}}
                />
              </div>
            </div>


            <div className="row">
              <div className="col-sm-4 col-sm-offset-4">
                <Button bsStyle="primary" type="submit">ADD NEW PRODUCT</Button>
              </div>
            </div>
          </form>
        </Panel>
      </div>
    );
  }
}
