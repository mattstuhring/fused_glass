import decode from 'jwt-decode';

export default class AuthService {
    // Initializing important variables
    constructor() {

      this.getProfile = this.getProfile.bind(this);
      this.getToken = this.getToken.bind(this);
      this.loggedIn = this.loggedIn.bind(this);
      this.logout = this.logout.bind(this);
      this.isTokenExpired = this.isTokenExpired.bind(this);
    }

    getProfile() {
      // Decode the token from localStorage
      return decode(this.getToken());
    }

    getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('id_token');
    }

    setToken(idToken) {
      // Saves user token to localStorage
      return localStorage.setItem('id_token', idToken)
    }

    loggedIn() {
      // Checks if there is a saved token and it's still valid
      const token = localStorage.getItem('id_token'); // Getting token from localstorage
      return token && !this.isTokenExpired(token); // handwaiving here
    }

    logout() {
      // Clear token from localStorage
      return localStorage.removeItem('id_token');
    }

    isTokenExpired(token) {
      try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
          return true;
        }
        else {
          return false;
        }
      }
      catch (err) {
        return false;
      }
    }
}
