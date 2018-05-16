import React from 'react';
import axios from 'axios';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, Checkbox, InputGroup}
  from 'react-bootstrap';
import Header from 'Header';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';
import classNames from 'classnames';



export default class ProductUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryId: null,
      collections: '',
      collectionIds: [],
      options: null,
      description: '',
      primaryImage: [],
      secondaryImages: [],
      name: '',
      price: '',
      size: '',
      primaryDropzone: {},
      initialPrimaryDropzone: null,
      pdzValid: null,
      pdz: true,
      pdzError: false,
      secondaryDropzone: {},
      initialSecondaryDropzone: null,
      sdzValid: null,
      sdz: true,
      sdzError: false
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
    this.handleSecondaryDropzone = this.handleSecondaryDropzone.bind(this);
    this.handleSecondaryImages = this.handleSecondaryImages.bind(this);
    this.handleSecondaryRemoveImage = this.handleSecondaryRemoveImage.bind(this);
    this.categoryValidation = this.categoryValidation.bind(this);
    this.collectionValidation = this.collectionValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
  }


  componentDidMount() {
    axios.get(`api/products/${this.props.params.id}`)
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
          collections: collectionNames,
          collectionIds: collectionIds,
          description: product.product_description,
          name: product.product_name,
          price: product.product_price,
          size: product.product_size,
          initialPrimaryDropzone: primeDrop,
          category: categoryName,
          categoryId: categoryId,
          options: options
        });
      })
      .then(() => {
        return axios.get(`api/images/${this.props.params.id}`)
          .then((r) => {
            let secondDrop;

            if (r.data) {
              r.data.forEach((item) => {
                const dz2 = this.state.secondaryDropzone;
                const imgName = item.image_public_id;
                const thumb = { name: imgName, size: 0, dataURL: 'https://res.cloudinary.com/fusedglassbyceleste/image/upload/' + imgName };

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

              this.setState({
                initialSecondaryDropzone: secondDrop
              });
            }

          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

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

  // GET ALL COLLECTIONS FOR CATEGORY -> ON CLICK OF COLLECTIONS INPUT
  handleOpenCollections() {
    console.log(this.state.categoryId, '********** catID');
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
    console.log(file, '******** remove file');
    if (this.state.primaryDropzone.files.length === 1) {
      this.setState({ pdzValid: true, pdz: false, pdzError: false });
    } else if (file) {
      this.setState({ pdzValid: false, pdz: false, pdzError: true });
    }
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
    } else {
      this.setState({ sdzValid: true, sdz: false, sdzError: false });
    }
  }

  // SDZ -> REMOVE IMAGE
  handleSecondaryRemoveImage(file) {
    console.log(file, 'removed secondary image');
    if (this.state.secondaryDropzone.files.length > 0) {
      this.setState({ sdzValid: true, sdz: false, sdzError: false });
    } else {
      this.setState({ sdzValid: null, sdz: true, sdzError: false });
    }
  }






  // ---------------  FORM SUBMIT  ---------------
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

    console.log(this.state.categoryId, '******* categoryId');
    console.log(category, '******** category');
    console.log(collections, '******* collections');
    console.log(name, '********* name');
    console.log(description, '*********** description');
    console.log(price, '****** price');
    console.log(size, '******* size');
    console.log(primary, '*********** PRIMARY');
    console.log(secondary, '*********** SECONDARY');

    let reqPrimaryImg;

    // CHECK PRIMARY DROPZONE CHANGE
    if (this.state.initialPrimaryDropzone.files !== primary) {
      reqPrimaryImg = superagent.put('/api/products')
        .attach('primary', primary[0]);
    } else {
      reqPrimaryImg = superagent.put('/api/products');
    }

    // SEND UPDATE REQUEST TO PRODUCTS PUT ROUTE
    reqPrimaryImg
      .field('productId', this.props.params.id)
      .field('category', this.state.category)
      .field('categoryId', this.state.categoryId)
      .field('collections', this.state.collections)
      .field('name', this.state.name)
      .field('description', this.state.description)
      .field('price', this.state.price)
      .field('size', this.state.size)
      .then((res) => {
        console.log(res, '******* res');
        const initSecondDPZ = this.state.initialSecondaryDropzone;

        // CHECK SECONDARY DPZ FILES
        if (initSecondDPZ && initSecondDPZ.files !== secondary) {
          console.log('Started from the bottom!');

          // let productId = this.props.params.id;
          // let reqSecondaryImg = superagent.put('/api/images');
          //
          // // POST SECONDARY IMAGES
          // secondary.forEach((img) => {
          //   reqSecondaryImg
          //     .field('id', productId)
          //     .field('category', this.state.category)
          //     .attach('images', img)
          // });
          //
          // reqSecondaryImg.end((err, res) => {
          //   if (err) {
          //     console.log(err);
          //     return;
          //   }
          //
          //   console.log('UPDATE COMPLETE');
          //   return;
          // });
        } else {
          console.log('Now we here!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

    return (
      <div className="product-update">

        {/* HEADER */}
        <Header category="Admin"/>

        <Panel header="UPDATE PRODUCT DETAILS" bsStyle="warning">
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
                  validationState={this.collectionValidation()}
                >
                  {/* COLLECTION */}
                  <ControlLabel>Collection</ControlLabel>
                  <Select
                    multi={true}
                    simpleValue={true}
                    value={this.state.collections}
                    options={this.state.options}
                    onChange={this.handleCollections}
                    onOpen={this.handleOpenCollections}
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



                <div className="row">
                  <div className="col-sm-6">
                    <FormGroup
                      controlId="formControlsText"
                      validationState={this.textValidation(this.state.price)}
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
                      validationState={this.textValidation(this.state.size)}
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
                      init: (obj) => this.handlePrimaryDropzone(obj)
                    }}
                    djsConfig={{addRemoveLinks: true, maxFiles: 1}}
                  />
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
                      init: (obj) => this.handleSecondaryDropzone(obj)
                    }}
                    djsConfig={{addRemoveLinks: true, maxFiles: 4}}
                  />
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
        </Panel>
      </div>
    );
  }
}
