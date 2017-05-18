import React from 'react';
import {Button, Image, FormGroup, ControlLabel, FormControl, Thumbnail, Panel, PageHeader}
  from 'react-bootstrap';
import FieldGroup from 'FieldGroup';
import Header from 'Header';


export default class Admin extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const title = (
      <h3>Add New Product</h3>
    );


    return (
      <div>
        {/* HEADER */}
        <Header title="Admin"/>

        <Panel header={title} bsStyle="primary">
          <form>
            <div className="row">
              <div className="col-sm-5 col-sm-offset-1">

                {/* CATEGORY & COLLECTION */}
                <div className="row">
                  <div className="col-sm-6">
                    <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Category</ControlLabel>
                      <FormControl componentClass="select" placeholder="select">
                        <option value="select">select</option>
                        <option value="other">...</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                  <div className="col-sm-6">
                    <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Collection</ControlLabel>
                      <FormControl componentClass="select" placeholder="select">
                        <option value="select">select</option>
                        <option value="other">...</option>
                      </FormControl>
                    </FormGroup>
                  </div>
                </div>

                {/* NAME */}
                <FieldGroup
                  id="formControlsText"
                  type="text"
                  label="Name"
                  placeholder="Enter text"
                />

                {/* DESCRIPTION */}
                <FieldGroup
                  id="formControlsText"
                  type="text"
                  componentClass="textarea"
                  label="Description"
                  placeholder="Enter description"
                />

                {/* PRICE & SIZE */}
                <div className="row">
                  <div className="col-sm-6">
                    <FieldGroup
                      id="formControlsText"
                      type="text"
                      label="Price"
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="col-sm-6">
                    <FieldGroup
                      id="formControlsText"
                      type="text"
                      label="Size"
                      placeholder="Enter text"
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE & FILE */}
              <div className="col-sm-5">
                <Thumbnail src="http://www.fillmurray.com/300/200">
                  <FieldGroup
                    id="formControlsFile"
                    type="file"
                    help="Example block-level help text here."
                  />
                </Thumbnail>
              </div>
            </div>

            {/* SUBMIT & CANCEL BTN */}
            <div className="row">
              <div className="col-sm-3 col-sm-offset-3">
                <Button bsStyle="primary" type="submit">Submit</Button>
              </div>
              <div className="col-sm-3">
                <Button bsStyle="danger" type="button">Cancel</Button>
              </div>
            </div>
          </form>
        </Panel>
      </div>
    );
  }
}
