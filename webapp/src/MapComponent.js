/*
 * Base Google Map example
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import GoogleMap from 'google-map-react';

export default class MapComponent extends Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    greatPlaceCoords: PropTypes.any
  };

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  render() {
    return (
       <GoogleMap
        center={this.props.center}
        zoom={this.props.zoom}>
      </GoogleMap>
    );
  }
}