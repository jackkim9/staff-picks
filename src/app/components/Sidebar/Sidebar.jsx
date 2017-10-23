import React from 'react';
import PropTypes from 'prop-types';
import { LeftWedgeIcon } from 'dgx-svg-icons';

import BookFilters from '../BookFilters/BookFilters.jsx';
import About from '../About/About.jsx';

const Sidebar = (props) => (
  <div className="sidebar nypl-column-one-quarter">
    <a href="#" className="back-link">
      <LeftWedgeIcon />
      Best Books for kids
    </a>

    <BookFilters filters={props.filters} />

    <About />
  </div>
);

Sidebar.propTypes = {
  filters: PropTypes.array,
};

export default Sidebar;
