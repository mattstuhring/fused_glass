import React from 'react';
import axios from 'axios';
import {Button} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import superagent from 'superagent';


export default class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImages = this.handleImages.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const files = this.state.images;
    console.log(files, '*************** files');

    var req = superagent.post('/api/categories/collections');
    files.forEach((file)=> {
       req.attach('images', file)
    });
    req.end((err, res) => {
      if (err) console.log(err);
      alert('File uploaded!');
    });
  }

  handleImages(files) {
    let images = Object.assign([], this.state.images);
    images.push(files);

    this.setState({ images: images });
  }

  render() {
    return <div>
      <h1>Playground</h1>

      <form onSubmit={this.handleSubmit}>

        <DropzoneComponent
          config={{
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'no-url'
          }}
          eventHandlers={{addedfile: (file) => this.handleImages(file)}}
          djsConfig={{addRemoveLinks: true}}
        />

        <Button bsStyle="primary" type="submit">Submit</Button>
      </form>
    </div>
  }
}
