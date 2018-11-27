import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

class Maps extends Component {
  static defaultProps = {
    center: {
      lat: 5.341791,
      lng: 100.282081
    },
    zoom: 11
  };

  render = () => {
    return (
      <div style={{ height: 300, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCr00eAu1vzNBljgxgFB7PuDk6UeKWrXvM' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        />
      </div>
    );
  };
}

export default Maps;
