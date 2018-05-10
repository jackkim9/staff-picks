// Library import
import React from 'react';
import PropTypes from 'prop-types';

const Hero = ({ heroData }) => {
  // Check if this list is one of "Staff Picks"
  const isStaffPicksList = heroData.header === 'Staff Picks';
  const image = heroData.heroImageUrl;
  // "Staff Picks" lists have section title
  const sectionTitle = isStaffPicksList ?
    <p className="hero-section-title">{heroData.sectionTitle}</p> : null;
  const staffPicksHeroClassName = isStaffPicksList ? ' staff-picks-hero' : '';
  // "Staff Picks" lists do not have a hero image but a full red background color
  const heroImageDOM = isStaffPicksList ? null :
    <div className="hero-image">
      <img src={image} alt="" />
    </div>;

  return (
    <div className={`hero${staffPicksHeroClassName}`}>
      {heroImageDOM}
      <div className="hero-container">
        <div className="nypl-full-width-wrapper">
          <div className="hero-content nypl-column-three-quarters nypl-column-offset-one">
            {sectionTitle}
            <h1>{heroData.header}</h1>
            <p className="hero-content-description">
              {heroData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  heroData: PropTypes.object.isRequired,
};

export default Hero;
