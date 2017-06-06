var React = require('react');
var axios = require('axios')
var { Link } = require('react-router');
var { Button, ListGroup, ListGroupItem, Panel, FormGroup, FormControl, InputGroup } = require('react-bootstrap');

var SideNav = React.createClass({
  getInitialState: function() {
    return {
      decoratives: [],
      housewares: [],
      jewelrys: [],
      gardens: [],
      collection: '',
      categoryId: null,
      open1: false,
      open2: false,
      open3: false,
      open4: false
    };
  },

  handleCollections: function(id, category) {
    axios.get(`/api/categories/${id}/collections`)
      .then((res) => {
        switch (category) {
          case 'decorative':
            this.setState({decoratives: res.data, open1: !this.state.open1});
            break;
          case 'houseware':
            this.setState({housewares: res.data, open2: !this.state.open2});
            break;
          case 'jewelry':
            this.setState({jewelrys: res.data, open3: !this.state.open3});
            break;
          case 'garden':
            this.setState({gardens: res.data, open4: !this.state.open4});
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  handleChange(event) {
    const value = event.target.value;
    const id = event.target.name;

    this.setState({ collection: value, categoryId: id });
  },

  handleSubmit(event) {
    event.preventDefault();
    const id = this.state.categoryId.toString();

    axios.post('/api/categories/collection', {
      name: this.state.collection,
      categoryId: this.state.categoryId
    })
    .then((res) => {
      switch (id) {
        case '1':
          this.setState({ decoratives: res.data });
          break;
        case '2':
          this.setState({ housewares: res.data });
          break;
        case '3':
          this.setState({ jewelrys: res.data });
          break;
        case '4':
          this.setState({ gardens: res.data });
          break;
      }
    })
    .catch((err) => {
      console.log(error);
    });

    this.setState({ collection: '', categoryId: null });
  },

  render: function() {
    return (
      <div className="panel panel-primary side-nav">
        <div className="panel-heading">
          <h3 className="panel-title text-center">Art for Sale</h3>
        </div>
        <div className="panel-body">


          {/* DECORATIVE */}
          <div className="row">
            <div className="col-sm-12">
              <Link to={`/products/${1}/Decorative`} onClick={() => this.handleCollections(1, 'decorative')}>
                Decorative
              </Link>
              <Panel collapsible expanded={this.state.open1}>
                <ListGroup fill>

                  <ListGroupItem>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="formControlsText">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Enter name"
                            name={1}
                            value={this.state.collection}
                            onChange={this.handleChange}
                          />
                          <InputGroup.Button>
                            <Button type="submit">Add</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                    </form>
                  </ListGroupItem>

                  {this.state.decoratives.map(function(e) {
                    return <ListGroupItem key={e.id}>
                        <div className="row">
                          <div className="col-sm-8">
                            <Link to={`/collections/Decorative/${e.id}/${e.collection_name}`}>
                              {e.collection_name}
                            </Link>
                          </div>
                          <div className="col-sm-4 text-right">
                            <Link>
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </Link>
                          </div>
                        </div>
                      </ListGroupItem>
                  }, this)}
                </ListGroup>
              </Panel>
            </div>
          </div>


          {/* HOUSEWARE */}
          <div className="row">
            <div className="col-sm-12">
              <Link to={`/products/${2}/Houseware`} onClick={() => this.handleCollections(2, 'houseware')}>
                Houseware
              </Link>
              <Panel collapsible expanded={this.state.open2}>
                <ListGroup fill>
                  <ListGroupItem>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="formControlsText">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Enter name"
                            name={2}
                            value={this.state.collection}
                            onChange={this.handleChange}
                          />
                          <InputGroup.Button>
                            <Button type="submit">Add</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                    </form>
                  </ListGroupItem>
                  {this.state.housewares.map(function(e) {
                    return <ListGroupItem key={e.id}>
                        <div className="row">
                          <div className="col-sm-8">
                            <Link to={`/collections/Houseware/${e.id}/${e.collection_name}`}>
                              {e.collection_name}
                            </Link>
                          </div>
                          <div className="col-sm-4 text-right">
                            <Link>
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </Link>
                          </div>
                        </div>
                      </ListGroupItem>
                  }, this)}
                </ListGroup>
              </Panel>
            </div>
          </div>


          {/* JEWELRY */}
          <div className="row">
            <div className="col-sm-12">
              <Link to={`/products/${3}/Jewelry`}  onClick={() => this.handleCollections(3, 'jewelry')}>
                Jewelry
              </Link>
              <Panel collapsible expanded={this.state.open3}>
                <ListGroup fill>
                  <ListGroupItem>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="formControlsText">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Enter name"
                            name={3}
                            value={this.state.collection}
                            onChange={this.handleChange}
                          />
                          <InputGroup.Button>
                            <Button type="submit">Add</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                    </form>
                  </ListGroupItem>
                  {this.state.jewelrys.map(function(e) {
                    return <ListGroupItem key={e.id}>
                        <div className="row">
                          <div className="col-sm-8">
                            <Link to={`/collections/Jewelry/${e.id}/${e.collection_name}`}>
                              {e.collection_name}
                            </Link>
                          </div>
                          <div className="col-sm-4 text-right">
                            <Link>
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </Link>
                          </div>
                        </div>
                      </ListGroupItem>
                  }, this)}
                </ListGroup>
              </Panel>
            </div>
          </div>


          {/* GARDEN */}
          <div className="row">
            <div className="col-sm-12">
              <Link to={`/products/${4}/Garden`} onClick={() => this.handleCollections(4, 'garden')}>
                Garden
              </Link>
              <Panel collapsible expanded={this.state.open4}>
                <ListGroup fill>
                  <ListGroupItem>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="formControlsText">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Enter name"
                            name={4}
                            value={this.state.collection}
                            onChange={this.handleChange}
                          />
                          <InputGroup.Button>
                            <Button type="submit">Add</Button>
                          </InputGroup.Button>
                        </InputGroup>
                      </FormGroup>
                    </form>
                  </ListGroupItem>
                  {this.state.gardens.map(function(e) {
                    return <ListGroupItem key={e.id}>
                        <div className="row">
                          <div className="col-sm-8">
                            <Link to={`/collections/Garden/${e.id}/${e.collection_name}`}>
                              {e.collection_name}
                            </Link>
                          </div>
                          <div className="col-sm-4 text-right">
                            <Link>
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </Link>
                          </div>
                        </div>
                      </ListGroupItem>
                  }, this)}
                </ListGroup>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SideNav;
