import React from 'react';
import { Panel, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import decode from 'jwt-decode';
import { browserHistory } from 'react-router';
import AuthService from 'AuthService';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    this.Auth = new AuthService();
  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  handleSubmitLogin(event) {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    axios.post('/api/login', user)
      .then((res) => {
        this.Auth.setToken(res.data);

        this.setState({
          email: '',
          password: ''
        });

        browserHistory.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="login">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3">
            <Panel bsStyle="primary">
              <Panel.Heading>
                <Panel.Title>Login</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <form onSubmit={this.handleSubmitLogin}>

                  <FormGroup controlId="formControlsEmail">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                      name="email"
                      value={this.state.email}
                      type="email"
                      placeholder="Enter email"
                      onChange={this.handleChange}
                    />
                  </FormGroup>

                  <FormGroup controlId="formControlsPassword">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                      name="password"
                      value={this.state.password}
                      type="password"
                      placeholder="Enter password"
                      onChange={this.handleChange}
                    />
                  </FormGroup>

                  <Button type="submit" bsStyle="primary" block>Submit</Button>
                </form>
              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}
