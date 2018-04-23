import React from 'react';
import PropTypes from 'prop-types';
import {
  extend as _extend,
  isEmpty as _isEmpty,
  findKey as _findKey,
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

    const annualList = !!(this.props.params && this.props.params.type &&
      (this.props.params.type === 'childrens' || this.props.params.type === 'ya'));
    this.state = _extend({ annualList }, this.props, BookStore.getState());
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
    // temporarily add the check here for staff picks config
    let heroData = undefined;

    if (_isEmpty(this.props.params)) {
      heroData = config.heroData.staffPicks;
    } else {
      // Check if the params are from Best Book URL or Staff Picks URL
      if (_findKey(this.props.params, 'type')) {
        heroData = config.heroData.annual[this.props.params.type];
      } else {
        heroData = config.heroData.staffPicks;
      }
    }

    return (
      <div className="app-wrapper">
        <Header
          navData={navConfig.current}
          skipNav={{ target: 'app-content' }}
        />

        <main className="main-page">
          <Hero
            heroData={heroData}
          />

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
  params: PropTypes.object,
};


App.contextTypes = {
  // Assigns router as React context
  router: PropTypes.object,
};

export default App;
