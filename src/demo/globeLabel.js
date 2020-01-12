/* eslint-disable react/state-in-constructor */
/* eslint-disable import/no-extraneous-dependencies */
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
  label: PropTypes.string,
  image: PropTypes.string,
  margin: PropTypes.bool,
};
GlobeLabel.defaultProps = {
  label: '',
  image: '',
  margin: false,
};
