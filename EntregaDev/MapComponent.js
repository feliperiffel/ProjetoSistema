/*
 * Base Google Map example
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import GoogleMap from 'google-map-react';

const K_WIDTH = 40;
const K_HEIGHT = 40;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  overflow: 'hidden',
  zIndex: 900
};

const greatPlaceStyleHover = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  zIndex: 900
};


class MapPin extends Component {
  static propTypes = {
    text: PropTypes.string,
    pin: PropTypes.object
  };

  static defaultProps = {};


  render() {
    const st = this.props.$hover ? greatPlaceStyleHover : greatPlaceStyle;
    const style = this.props.$hover ? "pinDetailsHover" : "pinDetails";

    return (
       <div style={st}>
          {this.props.$hover ? "" : this.props.text}
          <div className={style}>
            <label>{this.props.pin.title}</label>
            <label className="desc">{this.props.pin.description}</label>
          </div>
       </div>
    );
  }
}

export default class MapComponent extends Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    greatPlaceCoords: PropTypes.any,
    onClick: PropTypes.func,
    pinList: PropTypes.array
  };

  constructor(props) {
    super(props)

    this.onMapClick = this.onMapClick.bind(this);
  }

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };


  onMapClick(e){
    if (this.props.onClick){
      this.props.onClick(e.lat,e.lng);
    }
  };

  render() {

    var pins = [];
    if (this.props.pinList){
      this.props.pinList.forEach(function(p){
        pins.push(<MapPin key={pins.lenght} pin={p} lat={p.lat} lng={p.lng} text={p.title}/>)
      })
    }

    return (
       <GoogleMap
        center={this.props.center}
        zoom={this.props.zoom}
        onClick={this.onMapClick}>
        {pins}
      </GoogleMap>
    );
  }
}