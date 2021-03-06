import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup, Alert, Modal }
  from 'react-bootstrap';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';
import classNames from 'classnames';
import _ from 'underscore';



export default class ProductUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: null,
      category: '',
      categoryId: null,
      collections: '',
      checkCollections: false,
      collectionIds: [],
      options: null,
      description: '',
      name: '',
      price: '',
      size: '',
      primaryDropzone: {},
      checkPrimaryFiles: false,
      pdzValid: null,
      pdz: true,
      pdzError: false,
      secondaryDropzone: {},
      checkSecondaryFiles: false,
      sdzValid: null,
      sdz: true,
      sdzError: false,
      alertVisible: false,
      requireError: false,
      showModal: false,
      nameValidationState: true,
      descriptionValidationState: true,
      priceValidationState: true,
      sizeValidationState: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleCollections = this.handleCollections.bind(this);
    this.handleOpenCollections = this.handleOpenCollections.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
    this.handlePrimaryDropzone = this.handlePrimaryDropzone.bind(this);
    this.handlePrimaryImage = this.handlePrimaryImage.bind(this);
    this.handlePrimaryRemoveImage = this.handlePrimaryRemoveImage.bind(this);
    this.handlePrimarySuccess = this.handlePrimarySuccess.bind(this);
    this.handleSecondaryDropzone = this.handleSecondaryDropzone.bind(this);
    this.handleSecondaryImages = this.handleSecondaryImages.bind(this);
    this.handleSecondaryRemoveImage = this.handleSecondaryRemoveImage.bind(this);
    this.handleSecondarySuccess = this.handleSecondarySuccess.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.categoryValidation = this.categoryValidation.bind(this);
    this.collectionsValidation = this.collectionsValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleProductDelete = this.handleProductDelete.bind(this);
  }


  componentDidMount() {
    axios.get(`/api/products/${this.props.params.id}`)
      .then((res) => {
        const product = res.data[0];
        const collections = res.data[1];
        const categoryName = product.category_name.toLowerCase();
        const categoryId = parseInt(product.category_id);

        let collectionNames = [];
        let collectionIds = [];

        collections.forEach((c) => {
          collectionNames.push(c.collection_name);
          collectionIds.push(c.collection_id);
          return;
        });

        let options = collections.map((e) => {
          return {
            value: e.collection_name,
            label: e.collection_name
          }
        });

        let primeDrop = {};

        if (product.product_image_public_id) {
          const dz = this.state.primaryDropzone;
          const imgName = product.product_image_public_id;
          const thumb = { name: imgName, size: 0, dataURL: 'https://res.cloudinary.com/fusedglassbyceleste/image/upload/' + imgName };

          primeDrop = Object.assign({}, this.state.primaryDropzone);
          primeDrop.files.push(thumb);

          // Call the default addedfile event handler
          dz.emit('addedfile', thumb);

          dz.createThumbnailFromUrl(thumb, 'https://res.cloudinary.com/fusedglassbyceleste/image/upload/' + imgName, function (thumbnail) {
            // console.log('Primary made it!');
          }, 'anonymous');

          // Make sure that there is no progress bar, etc...
          dz.emit('complete', thumb);

          // If you use the maxFiles option, make sure you adjust it to the
          // correct amount:
          var existingFileCount = 1; // The number of files already uploaded
          dz.options.maxFiles = dz.options.maxFiles - existingFileCount;
        }

        this.setState({
          productId: this.props.params.id,
          collections: collectionNames,
          collectionIds: collectionIds,
          description: product.product_description,
          name: product.product_name,
          price: product.product_price,
          size: product.product_size,
          category: categoryName,
          categoryId: categoryId,
          options: options
        });
      })
      .then(() => {
        return axios.get(`/api/images/${this.props.params.id}`)
          .then((r) => {
            let secondDrop;

            r.data.forEach((item) => {
              const dz2 = this.state.secondaryDropzone;
              const imgName = item.image_public_id;
              const thumb = { accepted: false, imagePublicId: imgName, size: 0, dataURL: 'https://res.cloudinary.com/fusedglassbyceleste/image/upload/' + imgName };

              secondDrop = Object.assign({}, this.state.secondaryDropzone);
              secondDrop.files.push(thumb);

              // Call the default addedfile event handler
              dz2.emit('addedfile', thumb);

              dz2.createThumbnailFromUrl(thumb, 'https://res.cloudinary.com/fusedglassbyceleste/image/upload/' + imgName, function (thumbnail) {
                // console.log('Secondary made it!');
              }, 'anonymous');

              // Make sure that there is no progress bar, etc...
              dz2.emit('complete', thumb);

              // If you use the maxFiles option, make sure you adjust it to the
              // correct amount:
              var existingFileCount = secondDrop.files.length; // The number of files already uploaded
              dz2.options.maxFiles = dz2.options.maxFiles - existingFileCount;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
        [field]: null
      });
    }
  }


  // -------------  FORM VALIDATIONS -------------
  // ---------------------------------------------
  categoryValidation() {
    return 'success';
  }

  collectionsValidation() {
    return 'success';
  }

  textValidation(field) {
    let fieldValidationState;

    switch (field) {
      case 'name':
        fieldValidationState = this.state.nameValidationState;
        break;
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
    } else if (!fieldValidationState) {
      return 'error';
    } else {
      return null;
    };
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
    this.setState({ collections: val, checkCollections: true });
  }

  // GET ALL COLLECTIONS FOR CATEGORY -> ON CLICK OF COLLECTIONS INPUT
  handleOpenCollections() {
    const categoryId = this.state.categoryId;
    const categoryName = this.state.category;


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


  handleRemoveCollection(val) {
    console.log(val, '************ val');
    this.setState({ checkCollections: true });
  }





  // ----------  PRIMARY DROPZONE  --------------
  // --------------------------------------------
  // PDZ -> CAPTURE DROPZONE OBJ
  handlePrimaryDropzone(dropzone) {
    this.setState({ primaryDropzone: dropzone });
  }
  // PDZ -> ADD IMAGE
  handlePrimaryImage(file) {
    if (this.state.primaryDropzone.files.length >= 2) {
      this.state.primaryDropzone.removeFile(file);
    } else {
      this.setState({ pdzValid: true, pdz: false, pdzError: false });
    }
  }
  // PDZ -> REMOVE IMAGE
  handlePrimaryRemoveImage(file) {
    if (this.state.primaryDropzone.files.length === 1) {
      this.setState({ pdzValid: true, pdz: false, pdzError: false, checkPrimaryFiles: true });
    } else if (file) {
      this.setState({ pdzValid: false, pdz: false, pdzError: true, checkPrimaryFiles: true });
    }
  }
  // PDZ -> SUCCESS
  handlePrimarySuccess(file) {
    console.log('********* primary success');
    this.setState({ checkPrimaryFiles: true });
  }


  // ----------  SECONDARY DROPZONE  --------------
  // ----------------------------------------------
  // SDZ -> CAPTURE DROPZONE OBJ
  handleSecondaryDropzone(dropzone) {
    this.setState({ secondaryDropzone: dropzone });
  }
  // SDZ -> ADD IMAGE
  handleSecondaryImages(file) {
    if (this.state.secondaryDropzone.files.length > 4) {
      this.state.secondaryDropzone.removeFile(file);
      this.setState({ sdzError: true });
    } else {
      this.setState({ sdzValid: true, sdz: false, sdzError: false });
    }
  }
  // SDZ -> REMOVE IMAGE
  handleSecondaryRemoveImage(file) {
    // console.log(file, '************ remove sec img');
    if (!file.accepted) {
      // REMOVE SECONDARY FILE FROM CLOUDINARY & DB
      const imgPublicIdEncoded = encodeURIComponent(file.imagePublicId);

      axios.delete(`/api/images/${imgPublicIdEncoded}`)
        .then((res) => {
          console.log(res, '********* delete res');
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (this.state.secondaryDropzone.files.length > 0) {
      this.setState({ sdzValid: true, sdz: false, sdzError: false, checkSecondaryFiles: true });
    } else {
      this.setState({ sdzValid: null, sdz: true, sdzError: false, checkSecondaryFiles: true });
    }
  }
  // SDZ -> SUCCESS
  handleSecondarySuccess(file) {
    console.log('********* secondary success');
    this.setState({ checkSecondaryFiles: true });
  }






  // ---------------  FORM SUBMIT  ---------------
  handleSubmit(event) {
    event.preventDefault();

    const category = this.state.category;
    const categoryId = this.state.categoryId;
    let collections = this.state.collections;
    const name = this.state.name;
    const description = this.state.description;
    const price = this.state.price;
    const size = this.state.size;
    let productId = this.props.params.id;
    let primaryFiles = this.state.primaryDropzone.files;
    const checkPrimaryFiles = this.state.checkPrimaryFiles;
    const checkCollections = this.state.checkCollections;
    let superProductUpdate;

    if (name.length === 0) {
      this.setState({ nameValidationState: false });
    }
    if (description.length === 0) {
      this.setState({ descriptionValidationState: false });
    }
    if (price.length === 0) {
      this.setState({ priceValidationState: false });
    }
    if (size.length === 0) {
      this.setState({ sizeValidationState: false });
    }

    if (name.length === 0 || description.length === 0 || price.length === 0 || primaryFiles.length === 0) {
      if (primaryFiles.length === 0) {
        this.setState({ pdzError: true, pdzValid: false, pdz: false });
      }
      this.setState({ alertVisible: true });
    } else {
      this.setState({ alertVisible: false });

      // CHECK PRIMARY DROPZONE CHANGE & COLLECTIONS CHANGE
      if (checkPrimaryFiles) {
        if (checkCollections) {
          superProductUpdate = superagent.put('/api/products')
            .attach('primary', primaryFiles[0])
            .field('collections', collections);
        } else {
          superProductUpdate = superagent.put('/api/products')
            .attach('primary', primaryFiles[0]);
        }
      } else {
        if (checkCollections) {
          superProductUpdate = superagent.put('/api/products')
            .field('collections', collections);
        } else {
          superProductUpdate = superagent.put('/api/products');
        }
      }

      // SEND UPDATE REQUEST TO PRODUCTS PUT ROUTE
      superProductUpdate
        .field('productId', productId)
        .field('category', category)
        .field('categoryId', categoryId)
        .field('name', name)
        .field('description', description)
        .field('price', price)
        .field('size', size)
        .then((res) => {
          let secondaryFiles = this.state.secondaryDropzone.files;
          const checkSecondaryFiles = this.state.checkSecondaryFiles;

          if (checkSecondaryFiles) {
            let superSecondaryImg = superagent.put('/api/images');

            if (secondaryFiles.length > 0) {
              // POST SECONDARY IMAGES
              secondaryFiles.forEach((img) => {
                superSecondaryImg
                  .field('id', productId)
                  .field('category', category)
                  .attach('images', img);
              });

              superSecondaryImg.end((err, res) => {
                if (err) {
                  console.log(err);
                  return;
                }
                // console.log('2nd COMPLETE');
                return;
              });
            } else {
              superagent.put('/api/images')
                .field('id', productId)
                .field('category', category)
                .end((err, res) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  // console.log('2nd COMPLETE');
                  return;
                });
            }
          } else {
            console.log('********* Nothing to do');
          }

          this.setState({
            checkPrimaryFiles: false,
            checkSecondaryFiles: false,
            checkCollections: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  // DELETE PRODUCT FROM DATABASE BY ID
  handleProductDelete(productId, category) {
    axios.delete(`/api/products/${productId}/${category}`)
      .then((res) => {
        console.log(res, '******* delete res');
        this.close();
      })
      .catch((err) => {
        console.log(error);
      });

    // this.setState({ showModal: false, name: '', description: '', price: '', id: null });
  }

  // ----------  -------------
  // CLOSE PRODUCT DELETE MODAL
  close() {
    this.setState({ showModal: false });
  }
  // OPEN PRODUCT DELETE MODAL
  open() {
    this.setState({ showModal: true });
  }


  // -----------  BOOTSTRAP ALERT TOGGLES ------------
  // -------------------------------------------------
  // DISMISS
  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }
  // SHOW
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
            <h4>Whoops!</h4>
            <p>Please fill in all form fields highlighted in red.</p>
          </Alert>
        );
      }
    };


    return (
      <div className="product-update">
        {/* DELETE PRODUCT MODAL */}
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this product?</p>
            <p>Product ID: {this.state.productId}</p>
            <p>{this.state.category}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleProductDelete(this.state.productId, this.state.category)}>
              Yes
            </Button>
            <Button onClick={this.close}>No</Button>
          </Modal.Footer>
        </Modal>

        {/* HEADER */}
        <Header category="Admin"/>

        <Panel bsStyle="warning">

          {alertVisible()}

          <Panel.Heading>
            <Panel.Title componentClass="h3">UPDATE PRODUCT DETAILS</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-6">

                  <div className="page-header text-center">
                    <h4>Product Details</h4>
                  </div>

                  <FormGroup
                    controlId="formControlsSelect"
                    validationState={this.categoryValidation()}
                  >
                    {/* CATEGORY */}
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      onChange={this.handleCategory}
                      value={this.state.category}
                      disabled="disabled"
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
                    validationState={this.collectionsValidation()}
                  >
                    {/* COLLECTION */}
                    <ControlLabel>Collection</ControlLabel>
                    <Select
                      multi={true}
                      simpleValue={true}
                      placeholder="Optional..."
                      value={this.state.collections}
                      options={this.state.options}
                      onChange={this.handleCollections}
                      onOpen={this.handleOpenCollections}
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
                      placeholder="Enter name"
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
                      placeholder="textarea"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange}
                    />
                  </FormGroup>



                  <div className="row">
                    <div className="col-sm-6">
                      <FormGroup
                        controlId="formControlsText"
                        validationState={this.textValidation('price')}
                      >
                        {/* PRICE */}
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
                        validationState={this.textValidation('size')}
                      >
                        {/* SIZE */}
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





                {/* REACT DROPZONE COMONENTS */}
                <div className="col-sm-6 text-center">
                  <div className="page-header">
                    <h4>DISPLAY IMAGE <small>(Choose: 1)</small></h4>
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
                        addedfile: (file) => this.handlePrimaryImage(file),
                        removedfile: (file) => this.handlePrimaryRemoveImage(file, 'primary'),
                        init: (obj) => this.handlePrimaryDropzone(obj),
                        success: (file) => this.handlePrimarySuccess(file)
                      }}
                      djsConfig={{addRemoveLinks: true, maxFiles: 1}}
                    />

                    {pdzError()}
                  </div>

                  <div className="page-header">
                    <h4>MORE IMAGES <small>(Max: 4)</small></h4>
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
                        addedfile: (file) => this.handleSecondaryImages(file),
                        removedfile: (file) => this.handleSecondaryRemoveImage(file, 'secondary'),
                        init: (obj) => this.handleSecondaryDropzone(obj),
                        success: (file) => this.handleSecondarySuccess(file)
                      }}
                      djsConfig={{addRemoveLinks: true, maxFiles: 4}}
                    />

                    {sdzError()}
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-sm-3 col-sm-offset-3">
                  <Button bsStyle="primary" type="submit">UPDATE</Button>
                </div>
                <div className="col-sm-3">
                  <Button
                    bsStyle="danger"
                    type="button"
                    onClick={() => window.history.back()}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </form>

            <div className="row delete-product">
              <div className="col-sm-12 text-center">
                <Button
                  bsStyle="link"
                  onClick={() => this.open()}
                  >
                    Or completely remove product
                  </Button>
              </div>
            </div>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
