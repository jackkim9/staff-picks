import React from 'react';
import PropTypes from 'prop-types';
import {
  extend as _extend,
  isEmpty as _isEmpty,
  allKeys as _allKeys,
  isString as _isString,
} from 'underscore';

// NYPL Components
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Hero from '../Hero/Hero';
import BookActions from '../../actions/BookActions';
import BookStore from '../../stores/BookStore';
import config from '../../../../appConfig';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({}, this.props, BookStore.getState());
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BookStore.listen(this.onChange);
    BookActions.setIsJsEnabled(true);
  }

  componentWillUnmount() {
    BookStore.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend({}, this.props, BookStore.getState()));
  }

  render() {
    let heroData;
    let isStaffPicksHero;
    let heroDOM;
    // Use pathname index as type since routes.jsx specifies them directly.
    let type = _isString(this.props.location.pathname) ? this.props.location.pathname.split('/')[4] : '';
    // Convert '/' path or 'staff-picks' to use the heroData key 'staffPicks' to properly
    // match the heroData configuration.
    if (type === 'staff-picks' || _isEmpty(type)) {
      type = 'staffPicks';
    }

    // Check if the params type is included in valid data set
    if (type && _allKeys(config.heroData).includes(type)) {
      heroData = config.heroData[type];
      isStaffPicksHero = type === 'staffPicks';
      heroDOM = <Hero heroData={heroData} isStaffPicksHero={isStaffPicksHero} />;
    }

    return (
      <div className="app-wrapper">
        <Header
          navData={navConfig.current}
          skipNav={{ target: 'app-content' }}
        />

        <main className="main-page">
          {heroDOM}

          <div id="app-content" className="nypl-full-width-wrapper">
            {React.cloneElement(this.props.children, this.state)}
          </div>
        </main>

        <Footer id="footer" className="footer" />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};


App.contextTypes = {
  // Assigns router as React context
  router: PropTypes.object,
};

export default App;
