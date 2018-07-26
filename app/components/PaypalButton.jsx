import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-load-script';

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false,
    };
  }

  componentDidMount() {
    const {
      isScriptLoaded,
      isScriptLoadSuccess
    } = this.props;

    if (isScriptLoaded && isScriptLoadSuccess) {
      this.setState({ showButton: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isScriptLoaded,
      isScriptLoadSuccess,
    } = nextProps;

    const isLoadedButWasntLoadedBefore =
      !this.state.showButton &&
      !this.props.isScriptLoaded &&
      isScriptLoaded;

   if (isLoadedButWasntLoadedBefore) {
     if (isScriptLoadSuccess) {
       this.setState({ showButton: true });
     }
   }
 }

  render() {
    const {
      total,
      currency,
      env,
      commit,
      client,
      onSuccess,
      onError,
      onCancel
    } = this.props;

    const { showButton } = this.state;

    const payment = // Todo

    const onAuthorize = // Todo

    return (
      <div>
        {showButton && <paypal.Button.react
          env={env}
          client={client}
          commit={commit}
          payment={payment}
          onAuthorize={onAuthorize}
          onCancel={onCancel}
          onError={onError}
        />}
      </div>
    );
  }
}


export default scriptLoader([
  'https://www.paypalobjects.com/api/checkout.js'
])(PaypalButton);
