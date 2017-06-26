import React from 'react';
import axios from 'axios';
import {Button, Panel} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';

export default class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      primaryImage: [],
      images: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImages = this.handleImages.bind(this);
    this.handlePrimaryImage = this.handlePrimaryImage.bind(this);
  }


  handleSubmit(event) {
    event.preventDefault();
    const primary = this.state.primaryImage;
    const images = this.state.images;


    superagent
     .post('/api/categories/collections')
     .attach('primary', primary)
     .send({ product })
     .set('Accept', 'application/json')
     .end((err, res) => {
       if (err) {
         console.log(err);
         return;
       }

       console.log(res, '************** res');
     });





    // const req = superagent.post('/api/categories/collections');
    //
    // // POST PRIMARY IMAGE
    // req.attach('primary', primary);
    //
    // // POST ALL SECONDARY IMAGES
    // images.forEach((img)=> {
    //    req.attach('images', img)
    // });
    //
    // req.end((err, res) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //
    //   console.log(res.body, '********** res');
    // });
  }

  handlePrimaryImage(file) {
    this.setState({ primaryImage: file })
  }

  handleImages(files) {
    let images = Object.assign([], this.state.images);
    images.push(files);

    this.setState({ images: images });
  }


  render() {
    return <div className="row">
      <h1>Playground</h1>
      <div className="col-sm-6"></div>

      <div className="col-sm-6">

        <form onSubmit={this.handleSubmit}>

          <Panel header="Primary Image">
            <DropzoneComponent
              config={{
                iconFiletypes: ['.jpg', '.png'],
                showFiletypeIcon: true,
                postUrl: 'no-url',
                maxFiles: 1
              }}
              eventHandlers={{
                addedfile: (file) => this.handlePrimaryImage(file)
              }}
              djsConfig={{addRemoveLinks: true}}
            />
          </Panel>

          <Panel header="Images">
            <DropzoneComponent
              config={{
                iconFiletypes: ['.jpg', '.png'],
                showFiletypeIcon: true,
                postUrl: 'no-url'
              }}
              eventHandlers={{addedfile: (file) => this.handleImages(file)}}
              djsConfig={{addRemoveLinks: true}}
            />
          </Panel>

          <Button bsStyle="primary" type="submit">Submit</Button>
        </form>
      </div>
    </div>
  }
}
