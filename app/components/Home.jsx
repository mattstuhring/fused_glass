import React from 'react';
import {Image} from 'cloudinary-react';


export default class Home extends React.Component {
  constructor(props) {
    super(props);


  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">

          <h1 className="text-center">Home</h1>
          {/* <Image cloudName="fusedglassbyceleste" publicId="r0wjayi288vmhztxr86k" width="300" crop="scale"/> */}
        </div>
      </div>
    );
  }
}
