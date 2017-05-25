var React = require('react');
var { Link, IndexLink } = require('react-router');

var Navigation = () => {
  return (
    <div className="top-nav">
      <nav className="navbar navbar-fixed-top">
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
              <li>
                <Link to={`/productform/Add%20new%20product`} activeClassName="active-link">ADD</Link>
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
};

module.exports = Navigation;
