// Library import
import React from 'react';
import PropTypes from 'prop-types';

const Hero = ({ heroData, isStaffPicksHero = true }) => {
  const image = heroData.heroImageUrl;
  let sectionTitleDOM = null;
  let staffPicksHeroClassName = '';
  let heroImageDOM = (
    <div className="hero-image">
      <img src={image} alt="" />
    </div>
  );

  if (isStaffPicksHero) {
    // "Staff Picks" lists have the section title
    sectionTitleDOM = <p className="hero-section-title">{heroData.sectionTitle}</p>;
    staffPicksHeroClassName = ' staff-picks-hero';
    // "Staff Picks" lists do not have a hero image but a full red background color
    heroImageDOM = null;
  }

  return (
    <div className={`hero${staffPicksHeroClassName}`}>
      {heroImageDOM}
      <div className="hero-container">
        <div className="nypl-full-width-wrapper">
          <div className="hero-content nypl-column-three-quarters nypl-column-offset-one">
            {sectionTitleDOM}
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
  isStaffPicksHero: PropTypes.bool,
};

export default Hero;
