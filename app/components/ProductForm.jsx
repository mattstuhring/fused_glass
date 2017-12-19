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
    this.collectionValidation = this.collectionValidation.bind(this);
    this.textValidation = this.textValidation.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
  }


  componentDidMount() {
    if (this.props.params.id) {
      axios.get(`api/products/${this.props.params.id}`)
        .then((res) => {
          const data = res.data[0];
          const categoryName = data.category_name.toLowerCase();

          this.getCategory(categoryName, data.category_id);

          let collectionNames = [];
          let collectionIds = [];
          res.data.forEach((p) => {
            collectionNames.push(p.collection_name);
            collectionIds.push(p.collection_id);
            return;
          });

          if (data.product_image !== '') {
            const img = data.product_image;
            const file = {name: img}

            this.state.primaryDropzone.emit("addedfile", file);
            this.state.primaryDropzone.createThumbnailFromUrl(file, `images/uploads/${img}`);
            this.state.primaryDropzone.emit("complete", file);
            const existingFileCount = 1;
            this.state.primaryDropzone.options.maxFiles = this.state.primaryDropzone.options.maxFiles - existingFileCount;

            this.setState({primaryImage: file})
          }

          this.setState({
            collections: collectionNames,
            collectionIds: collectionIds,
            description: data.product_description,
            name: data.product_name,
            price: data.product_price,
            size: data.product_size
          });
        })
        .then(() => {
          axios.get(`api/images/${this.props.params.id}`)
            .then((r) => {
              let images = Object.assign([], this.state.secondaryImages);

              r.data.forEach((img) => {
                if (img.image_name !== '') {
                  const secondFile = {name: img.image_name};
                  images.push(secondFile);

                  this.state.secondaryDropzone.emit("addedfile", secondFile);
                  this.state.secondaryDropzone.createThumbnailFromUrl(secondFile, `images/uploads/${img.image_name}`);
                  this.state.secondaryDropzone.emit("complete", secondFile);
                }
              });

              this.setState({ secondaryImages: images });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

  handleRemoveCollection(val) {
    console.log(val, '************ val');
  }





  // ASSIGN PRIMARY DROPZONE OBJECT TO STATE
  handlePrimaryDropzone(obj) {
    // console.log(obj, '********** PRIMARY DROPZONE');
    this.setState({ primaryDropzone: obj });
  }

  // UPDATE PRIMARY IMAGE STATE
  handlePrimaryImage(file) {
    // console.log(file, '********* PRIMARY IMAGE FILE');
    this.setState({ primaryImage: file })
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
    if (this.props.params.id) {
      const id = this.props.params.id;

      axios.delete(`/api/images/${file.name}/${component}/${id}`)
        .then((res) => {
          console.log(res.data, '********** remove image');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  // SHOW SELECTED CATEGORY WHEN COMPONENT MOUNTS FOR UPDATING A PRODUCT
  getCategory(categoryName, categoryId) {
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


  // // FORM SUBMIT NEW PRODUCT TO DATABASE
  // handleSubmit(event) {
  //   event.preventDefault();
  //
  //   const primary = this.state.primaryImage;
  //   const secondary = this.state.secondaryImages;
  //   let request;
  //
  //   if (this.props.params.id) {
  //     request = superagent.put('/api/products')
  //       .field('productId', this.props.params.id);
  //   } else {
  //     request = superagent.post('/api/products');
  //   }
  //
  //   request
  //     .field('category', this.state.category)
  //     .field('categoryId', this.state.categoryId)
  //     .field('collections', this.state.collections)
  //     .field('name', this.state.name)
  //     .field('description', this.state.description)
  //     .field('price', this.state.price)
  //     .field('size', this.state.size)
  //     .attach('primary', primary)
  //     .set('Accept', 'application/json')
  //     .end((err, res) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //
  //       let productId;
  //       let reqImg;
  //
  //       if (this.props.params.id) {
  //         productId = this.props.params.id;
  //         reqImg = superagent.post('/api/images');
  //       } else {
  //         productId = res.body[0];
  //         reqImg = superagent.post('/api/images');
  //       }
  //
  //       // POST OR UPDATE SECONDARY IMAGES
  //       secondary.forEach((img)=> {
  //         reqImg.attach('images', img).field('id', productId)
  //       });
  //
  //       reqImg.end((err, res) => {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  //
  //         console.log(res.text);
  //       });
  //     });
  //
  //   this.removeAllFiles(this.state.primaryDropzone);
  //   this.removeAllFiles(this.state.secondaryDropzone);
  //
  //   this.setState({
  //     category: '',
  //     categoryId: null,
  //     collections: [],
  //     name: '',
  //     description: '',
  //     price: '',
  //     size: '',
  //     primaryDropzone: null,
  //     secondaryDropzone: null
  //   });
  // }

















  // FORM SUBMIT NEW PRODUCT TO DATABASE
  handleSubmit(event) {
    event.preventDefault();

    const primary = this.state.primaryDropzone.files;
    const secondary = this.state.secondaryDropzone.files;

    console.log(primary, '*********** PRIMARY');
    console.log(secondary, '*********** SECONDARY');

    superagent.post('/api/products')
      .field('category', this.state.category)
      .field('categoryId', this.state.categoryId)
      .field('collections', this.state.collections)
      .field('name', this.state.name)
      .field('description', this.state.description)
      .field('price', this.state.price)
      .field('size', this.state.size)
      .attach('primary', primary[0])
      .then((res) => {
        let productId;
        productId = res.text;
        productId = parseInt(productId);

        let reqImg;
        reqImg = superagent.post('/api/images');

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

          this.state.primaryDropzone.removeAllFiles();
          this.state.secondaryDropzone.removeAllFiles();

          this.setState({
            category: '',
            categoryId: null,
            collections: [],
            name: '',
            description: '',
            price: '',
            size: '',
            primaryImage: [],
            secondaryImages: []
          });
        });
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





              {/* REACT DROPZONE COMONENTS */}
              <div className="col-sm-6 text-center">
                <div className="page-header">
                  <h4>Display Image <small>(Choose: 1)</small></h4>
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
                  <h4>More Images <small>(Max: 4)</small></h4>
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


            {/* SUBMIT & CANCEL BTN */}
            {buttonAction()}
          </form>
        </Panel>
      </div>
    );
  }
}
