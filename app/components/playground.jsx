import React from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

export default class playground extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          primaryDropzone: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePrimaryDropzone = this.handlePrimaryDropzone.bind(this);
        this.handlePrimaryImage = this.handlePrimaryImage.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
    }

    handlePrimaryImage(file) {
      console.log(file, '******* added');
    }

    handleRemoveImage(str, file) {
      console.log(str, '********* name');
      console.log(file, '******** remove');
    }

    handlePrimaryDropzone(dropzone) {
      console.log(dropzone, '********** init');
      this.setState({ primaryDropzone: dropzone})
    }


    // FORM SUBMIT NEW PRODUCT
    handleSubmit(event) {
      event.preventDefault();


      console.log(this.state.primaryDropzone, '******** primaryDropzone');
      this.state.primaryDropzone.removeAllFiles();
    }



    render() {
        return <div>

          <form onSubmit={this.handleSubmit}>
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
                djsConfig={{
                  addRemoveLinks: true,
                  maxFiles: 1,
                  acceptedFiles: "image/jpeg,image/png"
                }}
              />

            <button type="submit">ADD NEW IMAGE</button>
          </form>
        </div>
    }
}
