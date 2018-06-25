/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Error404Page from '../../src/app/components/Error404Page/Error404Page';
import config from '../../appConfig';

describe('Error404Page', () => {
  describe('Default', () => {
    let component;

    before(() => {
      component = shallow(<Error404Page />);
    });

    after(() => {
      component.unmount();
    });

    it('should have an <h1> title with the correct contents.', () => {
      const title = component.find('h1');

      expect(title.length).to.equal(1);
      expect(title.text()).to.equal('404 | Not Found');
    });

    it('should have three <p>s with correct contents.', () => {
      const descriptionParagraphs = component.find('p');

      expect(descriptionParagraphs.length).to.equal(3);
      expect(descriptionParagraphs.at(0).text()).to.equal(
        'We’re sorry. The page you were looking for doesn’t exist.'
      );
      expect(descriptionParagraphs.at(1).text()).to.equal(
        'Ready to discover your next great read? Browse and filter our Staff Picks.'
      );
      expect(descriptionParagraphs.at(2).text()).to.equal(
        'Need help or have a question? Contact us.'
      );
    });

    it('should have a link to "Staff Picks".', () => {
      const askNyplLink = component.find('a');

      expect(askNyplLink.length).to.equal(2);
      expect(askNyplLink.nodes[0].props.href).to.equal(`${config.baseUrl}/staff-picks`);
      expect(askNyplLink.nodes[0].props.children).to.equal('Staff Picks.');
    });

    it('should have a link to "Ask NYPL".', () => {
      const askNyplLink = component.find('a');

      expect(askNyplLink.length).to.equal(2);
      expect(askNyplLink.nodes[1].props.href).to.equal('https://www.nypl.org/get-help/contact-us');
      expect(askNyplLink.nodes[1].props.children).to.equal('Contact us.');
    });
  });
});
