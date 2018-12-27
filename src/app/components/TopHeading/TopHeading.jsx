import React from 'react';
import PropTypes from 'prop-types';
import { LeftWedgeIcon } from '@nypl/dgx-svg-icons';

import appConfig from '../../../../appConfig';
import ListTitle from '../ListTitle/ListTitle';

const TopHeading = ({ displayInfo, displayType, picksCount }) => (
  <div className="nypl-row top-headings bx--row">
    <div className="nypl-column-one-quarter bx--col-xs-3">
      <nav aria-label="Breadcrumbs" className="book-filters-heading-top">
        <a href={appConfig.recommendationsLink.url} className="back-link">
          <LeftWedgeIcon ariaHidden />
          {appConfig.recommendationsLink.label}
        </a>
      </nav>
    </div>

    <div className="nypl-column-three-quarters bx--col-xs-9">
      <ListTitle
        displayInfo={displayInfo}
        displayType={displayType}
        picksCount={picksCount}
      />
    </div>
  </div>
);

TopHeading.propTypes = {
  displayInfo: PropTypes.object,
  displayType: PropTypes.string,
  picksCount: PropTypes.number,
};

export default TopHeading;
