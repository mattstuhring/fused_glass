import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup, Alert}
  from 'react-bootstrap';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';
import classNames from 'classnames';

import { browserHistory } from 'react-router';

export default class ProductAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: '',
      collectionIds: [],
      description: '',
      name: '',
      price: '',
      size: '',
      primaryDropzone: null,
      pdzValid: null,
      pdz: true,
      pdzError: false,
      secondaryDropzone: null,
      sdzValid: null,
      sdz: true,
      sdzError: false,
      options: null,
      alertVisible: false,
      requireError: false,
      nameValidationState: null,
      descriptionValidationState: null,
      priceValidationState: null,
      sizeValidationState: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleCollections = this.handleCollections.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
    this.handleCategoryCollections = this.handleCategoryCollections.bind(this);
    this.handleInitPDZ = this.handleInitPDZ.bind(this);
    this.handleAddImgPDZ = this.handleAddImgPDZ.bind(this);
    this.handleRemoveImgPDZ = this.handleRemoveImgPDZ.bind(this);
    this.handleSuccessPDZ = this.handleSuccessPDZ.bind(this);
    this.handleInitSDZ = this.handleInitSDZ.bind(this);
    this.handleAddImgSDZ = this.handleAddImgSDZ.bind(this);
    this.handleRemoveImgSDZ = this.handleRemoveImgSDZ.bind(this);
    // this.collectionValidation = this.collectionValidation.bind(this);
    this.categoryValidation = this.categoryValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }


  // -------------  HANDLE CHANGE ----------------
  // ---------------------------------------------
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    const field = `${name}ValidationState`;

    if (value.length > 0) {
      this.setState({
        [name]: value,
        [field]: true
      });
    } else {
      this.setState({
        [name]: value,
        [field]: false
      });
    }
  }


  // -------------  FORM VALIDATIONS -------------
  // ---------------------------------------------
  // CATEGORY
  categoryValidation() {
    if (this.state.category !== '') return 'success';
  }

  // COLLECTIONS
  collectionValidation() {
    if (this.state.category !== '') return 'success';
  }

  // // TEXT
  // textValidation(field) {
  //   console.log(field, '***** field');
  //   if (field.length > 0) return 'success';
  //   else if (field === '')  return 'error';
  // }

  textValidation(field) {
    let fieldValidationState;

    switch (field) {
      case 'name':
        fieldValidationState = this.state.nameValidationState;
        break;
      case 'description':
        fieldValidationState = this.state.descriptionValidationState;
        break;
      case 'price':
        fieldValidationState = this.state.priceValidationState;
        break;
      case 'size':
        fieldValidationState = this.state.sizeValidationState;
        break;
    }

    if (fieldValidationState === null) {
      return null;
    } else if (fieldValidationState) {
      return 'success';
    } else {
      return 'error';
    };
  }


  // GET ALL COLLECTIONS FROM CATEGORY
  // ---------------------------------
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



  // HANDLE NEW COLLECTION CHANGE
  // ----------------------------
  handleCollections(val) {
    this.setState({collections: val})
  }
  // REMOVE COLLECTION
  handleRemoveCollection(val) {
    console.log(val, '************ val');
  }





  // ----------  PRIMARY DROPZONE  --------------
  // --------------------------------------------
  // PDZ -> CAPTURE DROPZONE OBJ
  handleInitPDZ(dropzone) {
    this.setState({ primaryDropzone: dropzone });
  }
  // PDZ -> ADD IMAGE
  handleAddImgPDZ(file) {
    if (this.state.primaryDropzone.files.length >= 2) {
      this.state.primaryDropzone.removeFile(file);
    } else {
      this.setState({ pdzValid: true, pdz: false, pdzError: false });
    }
  }
  // PDZ -> REMOVE IMAGE
  handleRemoveImgPDZ(file) {
    if (this.state.primaryDropzone.files.length === 1) {
      this.setState({ pdzValid: true, pdz: false, pdzError: false });
    } else if (file) {
      this.setState({ pdzValid: false, pdz: false, pdzError: true });
    }
  }
  // PDZ -> SUCCESS
  handleSuccessPDZ(file) {
    console.log(file, '********* success');
  }



  // ----------  SECONDARY DROPZONE  --------------
  // ----------------------------------------------
  // SDZ -> CAPTURE DROPZONE OBJ
  handleInitSDZ(dropzone) {
    this.setState({ secondaryDropzone: dropzone });
  }
  // SDZ -> ADD IMAGE
  handleAddImgSDZ(file) {
    if (this.state.secondaryDropzone.files.length > 4) {
      this.state.secondaryDropzone.removeFile(file);
    } else {
      this.setState({ sdzValid: true, sdz: false, sdzError: false });
    }
  }
  // SDZ -> REMOVE IMAGE
  handleRemoveImgSDZ(file) {
    if (this.state.secondaryDropzone.files.length > 0) {
      this.setState({ sdzValid: true, sdz: false, sdzError: false });
    } else {
      this.setState({ sdzValid: null, sdz: true, sdzError: false });
    }
  }


  // // REMOVE IMAGES FROM PRIMARY & SECONDARY DROPZONE COMPONENTS
  // handleRemoveImgPDZ(file, component) {
  //   if (component === 'primary') {
  //     console.log(file, '******* pdz file remove');
  //     this.setState({pdzValid: false, pdzError: true})
  //
  //   } else if (component === 'secondary') {
  //     console.log(file, '********** sdz file remove');
  //
  //     // let imgPublicId = file.name;
  //     // axios.delete(`/api/images/${imgPublicId}/${this.prop.params.id}`)
  //     //   .then((res) => {
  //     //     console.log(res, '*********** RES');
  //     //   })
  //     //   .catch((err) => {
  //     //     console.log(err);
  //     //   });
  //   }
  // }


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






  // -------------  FORM SUBMIT NEW PRODUCT -------------
  // ----------------------------------------------------
  handleSubmit(event) {
    event.preventDefault();

    const category = this.state.category;
    let collections = this.state.collections;
    const name = this.state.name;
    const description = this.state.description;
    const price = this.state.price;
    const size = this.state.size;
    let primary = this.state.primaryDropzone.files;
    let secondary = this.state.secondaryDropzone.files;

    // console.log(category, '******** category');
    // console.log(this.state.categoryId, '******* cat ID');
    // console.log(collections, '******* collections');
    // console.log(name, '********* name');
    // console.log(description, '*********** description');
    // console.log(price, '****** price');
    // console.log(size, '******* size');
    // console.log(primary, '*********** PRIMARY');
    // console.log(secondary, '*********** SECONDARY');

    if (category === '' || name === '' || description === '' || price === '' || primary.length === 0) {
      // THROW ERROR MESSAGE
      this.setState({ alertVisible: true, requireError: true});
    } else {
      this.setState({ alertVisible: false, requireError: false });

      superagent.post('/api/products')
        .field('category', this.state.category)
        .field('categoryId', this.state.categoryId)
        .field('collections', collections)
        .field('name', this.state.name)
        .field('description', this.state.description)
        .field('price', this.state.price)
        .field('size', this.state.size)
        .attach('primary', primary[0])
        .then((res) => {
          let productId = parseInt(res.text);

          if (secondary.length > 0) {
            let reqImg = superagent.post('/api/images');

            // POST SECONDARY IMAGES
            secondary.forEach((img) => {
              reqImg
                .field('id', productId)
                .field('category', this.state.category)
                .attach('images', img)
            });

            reqImg.end((err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
          }

          this.state.primaryDropzone.removeAllFiles();
          this.state.secondaryDropzone.removeAllFiles();

          this.setState({
            category: '',
            categoryId: null,
            collections: '',
            name: '',
            description: '',
            price: '',
            size: '',
            pdzValid: null,
            pdz: true,
            pdzError: false,
            sdzValid: null,
            sdz: true,
            sdzError: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  // -----------  BOOTSTRAP ALERT TOGGLES ------------
  // -------------------------------------------------
  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }

  handleAlertShow() {
    this.setState({ alertVisible: true });
  }



  // **************************   RENDER   ***********************************
  // *************************************************************************
  render() {
    let pdzValidation = classNames({
      'pdz': this.state.pdz,
      'pdz-valid': this.state.pdzValid && !this.state.pdz,
      'pdz-invalid': !this.state.pdzValid && !this.state.pdz

    });

    let sdzValidation = classNames({
      'sdz': this.state.sdz,
      'sdz-valid': this.state.sdzValid && !this.state.sdz,
      'sdz-invalid': !this.state.sdzValid && !this.state.sdz
    });

    const pdzError = () => {
      if (this.state.pdzError) {
        return <span className="pdz-error"><small><em>* Display image is required!</em></small></span>;
      }
    };

    const sdzError = () => {
      if (this.state.sdzError) {
        return <span className="sdz-error"><small><em>* The 4 image maximum has been reached!</em></small></span>;
      }
    };

    const alertVisible = () => {
      if (this.state.alertVisible) {
        return (
          <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
            <h4>Oops! You got an error!</h4>
            <p>Please fill in all required form fields.</p>
          </Alert>
        );
      }
    };

    const requireError = () => {
      if (this.state.requireError) {
        return <span><small><em>* Required</em></small></span>
      }
    }

    return (
      <div className="product-add">

        {/* HEADER */}
        <Header category="Admin"/>

        <Panel header="ADD NEW PRODUCT" bsStyle="success">

          {alertVisible()}

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
                  validationState={this.textValidation('name')}
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
                  validationState={this.textValidation('description')}
                >
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </FormGroup>


                <div className="row">

                  {/* PRICE */}
                  <div className="col-sm-6">
                    <FormGroup
                      controlId="formControlsText"
                      validationState={this.textValidation('price')}
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

                  {/* SIZE */}
                  <div className="col-sm-6">
                    <FormGroup
                      controlId="formControlsText"
                      validationState={this.textValidation('size')}
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
                <div className={pdzValidation}>
                  <DropzoneComponent
                    config={{
                      iconFiletypes: ['.jpg', '.png'],
                      showFiletypeIcon: true,
                      postUrl: 'no-url'
                    }}
                    eventHandlers={{
                      addedfile: (file) => this.handleAddImgPDZ(file),
                      removedfile: (file) => this.handleRemoveImgPDZ(file),
                      init: (obj) => this.handleInitPDZ(obj),
                      success: (file) => this.handleSuccessPDZ(file)
                    }}
                    djsConfig={{
                      addRemoveLinks: true,
                      maxFiles: 1,
                      acceptedFiles: "image/jpeg,image/png"
                    }}
                  />

                  {pdzError()}
                </div>

                <div className="page-header">
                  <h4>MORE IMAGES <small><em>(Max: 4)</em></small></h4>
                </div>


                {/* SECONDARY DROPZONE */}
                <div className={sdzValidation}>
                  <DropzoneComponent
                    config={{
                      iconFiletypes: ['.jpg', '.png'],
                      showFiletypeIcon: true,
                      postUrl: 'no-url'
                    }}
                    eventHandlers={{
                      addedfile: (file) => this.handleAddImgSDZ(file),
                      removedfile: (file) => this.handleRemoveImgSDZ(file),
                      init: (obj) => this.handleInitSDZ(obj)
                    }}
                    djsConfig={{
                      addRemoveLinks: true,
                      maxFiles: 4,
                      acceptedFiles: "image/jpeg,image/png"
                    }}
                  />

                  {sdzError()}
                </div>
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
