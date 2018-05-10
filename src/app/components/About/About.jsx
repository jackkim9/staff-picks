/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FaceBookIcon,
  TwitterIcon,
} from '@nypl/dgx-svg-icons';

import appConfig from '../../../../appConfig';
import utils from '../../utils/utils';

const {
  aboutUrls,
  socialSharing,
  pageTitle,
} = appConfig;

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = { location: {} };
    this.gaSocialMediaEvent = this.gaSocialMediaEvent.bind(this);
  }

  componentDidMount() {
    this.setState({ location: window.location });
  }

  gaSocialMediaEvent(type) {
    utils.trackPicks('Social Share', type);
  }

  render() {
    const displayType = this.props.displayType;
    const shareUrl = this.state.location.href;
    const shareText = encodeURI(pageTitle[displayType]);
    const aboutBestBooksLink = ['teens', 'kids'].includes(displayType) ?
      <p><a className="about-best-books-link" href={aboutUrls.about}>About Best Books</a></p>
      : null;

    return (
      <div className="about nypl-row">
        <h2>Additional Information</h2>
        <p>Many of these titles are available in formats for&nbsp;
          <a href={aboutUrls.print}>patrons with print disabilities.</a>
        </p>
        {aboutBestBooksLink}
        <ul>
          <li>
            <a
              className="twitter-link"
              href={`${socialSharing.twitter}text=${shareText}&url=${shareUrl}&via=NYPL`}
              onClick={() => this.gaSocialMediaEvent('Twitter')}
            >
              <TwitterIcon iconId="about-twitter" />
              <span className="replaced-text visuallyHidden">Share on Twitter</span>
            </a>
          </li>
          <li>
            <a
              className="facebook-link"
              href={`${socialSharing.facebook}${this.state.location}`}
              onClick={() => this.gaSocialMediaEvent('Facebook')}
            >
              <FaceBookIcon iconId="about-facebook" />
              <span className="replaced-text visuallyHidden">Share on Facebook</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

About.propTypes = {
  displayType: PropTypes.string,
};

export default About;
