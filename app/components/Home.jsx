import React from 'react';
import AuthService from 'AuthService';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.Auth = new AuthService();
  }

  render() {
    const isLoggedIn = () => {
      if (this.Auth.loggedIn()) {
        return <p>Welcome, Celeste</p>;
      }
    };


    return (
      <div className="row">
        <div className="col-sm-12">

          <h1 className="text-center">Home</h1>

          {isLoggedIn()}

        </div>
      </div>
    );
  }
}
