import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class GlobeLabel extends Component {
  state = {}

  render() {
    const { label, image, margin } = this.props;
    return (
      <div className={`globe ${margin && 'margin'}`}>
        <div className="image" style={{ backgroundImage: `url('${image}')` }} />
        <div className="label">{label}</div>
      </div>
    );
  }
}

GlobeLabel.propTypes = {
  label: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  margin: PropTypes.string,
};
GlobeLabel.defaultProps = {
  margin: '',
};
