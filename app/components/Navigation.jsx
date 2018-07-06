import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, IndexLink, browserHistory } from 'react-router';
import decode from 'jwt-decode';
import AuthService from 'AuthService';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.Auth = new AuthService();
  }

  handleLogout() {
    // Clear token from localStorage
    this.Auth.logout();

    browserHistory.push('/');

    this.setState({
      user: null
    });
  }


  render() {
    const checkUserLogin = () => {
      if (this.Auth.getToken()) {
        return <li className="nav-item">
          <a className="nav-link" href="#" onClick={() => {this.handleLogout()}}>LOGOUT</a>
        </li>;
      } else {
        return <li>
          <Link to="/login" activeClassName="active-link">LOGIN</Link>
        </li>;
      }
    };

    return (
      <div className="top-nav">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <IndexLink to="/" activeClassName="active-link">HOME</IndexLink>
                </li>
                <li>
                  <Link to="/about" activeClassName="active-link">ABOUT</Link>
                </li>
                <li>
                  <Link to="/gallery" activeClassName="active-link">GALLERY</Link>
                </li>
                <li>
                  <Link to="/contact" activeClassName="active-link">CONTACT</Link>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">

                {checkUserLogin()}

                <li>
                  <Link to={`/productadd`} activeClassName="active-link">ADD</Link>
                </li>
                <li>
                  <Link to="/cart" activeClassName="active-link"><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Cart (0)</Link>
                </li>
              </ul>

            </div>
          </div>
        </nav>
      </div>
    );
  }
}
