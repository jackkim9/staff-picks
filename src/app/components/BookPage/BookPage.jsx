import React from 'react';
import PropTypes from 'prop-types';
import {
  each as _each,
  isEmpty as _isEmpty,
} from 'underscore';
import { Link } from 'react-router';
import { LeftWedgeIcon } from '@nypl/dgx-svg-icons';

import Book from '../Book/Book';
import BookStore from '../../stores/BookStore';
import Actions from '../../actions/BookActions';
import appConfig from '../../../../appConfig';
import { staffPicksDate, annualDate } from '../../utils/DateService';

class BookPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = BookStore.getState();
    this.getPickAndAge = this.getPickAndAge.bind(this);
  }

  componentDidMount() {
    const { picks } = this.state.picksData;
    const { pick = {} } = this.getPickAndAge(picks);

    Actions.updateCurrentAudience(pick.ageGroup);
  }

  /**
   * getPickAndAge(picks)
   * Returns the found pick and its age.
   * @param {array} picks
   * @returns {object}
   */
  getPickAndAge(picks) {
    const paramId = this.props.params && this.props.params.id ? this.props.params.id : '';
    let pick;
    let age;

    _each(picks, (item) => {
      if (item.slug === paramId) {
        pick = item;
        age = appConfig.audienceMap[pick.ageGroup || 'Adult'];
      }
    });

    // No pick? Go to 404 instead of displaying an empty page.
    if (!pick || _isEmpty(pick)) {
      this.context.router.push(`${appConfig.baseUrl}404`);
    }

    return { pick, age };
  }

  render() {
    const { date, picks, type = '' } = this.state.picksData || {};
    const displayDate = (type === 'staff-picks') ? staffPicksDate(date) : annualDate(date);
    const { pick, age } = this.getPickAndAge(picks);

    return (
      <div className="nypl-row book-page">
        <div className="sidebar nypl-column-one-quarter">
          <nav aria-label="Breadcrumbs">
            <Link href={`${appConfig.baseUrl}${type}/${date}`} className="back-link">
              <LeftWedgeIcon ariaHidden />
              <span className="replaced-text visuallyHidden">Return to </span>
              Staff Picks
            </Link>
          </nav>
          <div className="book-filters">
            <div className="book-filters-heading" />
          </div>
        </div>

        <div className="booklist-section nypl-column-three-quarters">
          <h2>
            {displayDate.month} {displayDate.year} Picks for {age}
          </h2>
          <ul className="booklist">
            <Book pick={pick} isJsEnabled={this.props.isJsEnabled} />
          </ul>
        </div>
      </div>
    );
  }
}

BookPage.propTypes = {
  className: PropTypes.string,
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
  isJsEnabled: PropTypes.bool,
};

BookPage.defaultProps = {
  className: 'BookPage',
  isJsEnabled: false,
};

BookPage.contextTypes = {
  router: PropTypes.object,
};

export default BookPage;
