## CHANGELOG

### 4.0.0
> Update the routes. The base route is now `/books-music-movies/recommendations/best-books/`. And `staff-picks`, `ya`, `childrens` are three lists on the same level of the structure.
> Update the BookPage component to support legacy staff-picks direct links and homepage's staff-picks component as the modal replacement from the previous staff-picks application. No direct links to picks in lists is supported at this time.
> Add an `.env.example` and update the related README.md so now the developer can set a `.env` to run the application locally.

### 3.2.6
> Updating Travis CI configuration for CD to AWS Elastic Beanstalk

### 3.2.5
> Update the header component to 2.4.7.
> Added OptinMonster for advocacy 2018.

### 3.2.4
> Added Travis CI configuration for AWS EB
> Integrated swap-space configuration in ./ebextensions
> Updated README to include AWS CI/CD workflow

### 3.2.3
> Update the header component to 2.4.5.

### 3.2.2
> Update the header component to 2.4.2.

### 3.2.1
> Update the header to v2.4.1 and footer to v0.4.1.

### 3.2.0
> Update to the header, v2.4.0.

### 3.1.0
> Updating dgx-react-ga related functions for Header Component and dgx-react-ga updates.

### 3.0.3
> Updating URL of hero images to be relative.

### 3.0.2
> Updated header to v2.3.0 -- Includes FundraisingBanner integration

### 3.0.1
> Adding Twitter and FB OG tags for images.
> Small style update to the # books found in the sidebar.

### 3.0.0
> 2017 Best Books for Kids and Best Books for Teens!
> We've refactored the base Node/React application based off [Discovery](https://github.com/NYPL-discovery/discovery-front-end), added unit tests, cleaned up and updated npm packages, completed accessibility and cross-browser reviews, and updated the routes for the next big version of Staff Picks. This initial re-implementation kicks off with the 2017 annual lists for kids and teens and will later incorporate the rest of the data. The data is now coming from NYPL Digital's API platform located on AWS. The app is also updated to use the [Design Toolkit](https://github.com/NYPL/design-toolkit)! Making huge progress to unify our designs and conventions.

### 2.5.0
> Removing unnecessary npm packages, removing the modal, and updating routes. Also an update to React Router.

### 2.4.0
> Adding unit tests, updating a few npm packages, and updating readme.

### v2.3.1
> Updating the Header to version 2.1.1.

### v2.3.0
> Adding Feature Flag for displaying the List view by default, through Optimizely.

### v2.2.2
> Updating the Header to version 2.1.0.

### v2.2.1
> Fix to time/season display.

### v2.2.0
> Updated to React 15.

### v2.1.11
> Updated the logic in BookFilters.jsx to render one list of tags starting from summer 2016.

### v2.1.10
> Updated the Header Component to v1.5.5. The updates include integrating the log in related functions with login server, removing console loggings for patron token expiration, and turning off the feature flag of OAuth Login and set it as default.

### v2.1.9
> Updated the variable check for "id" in ApiRoutes.js to fix the bug that the routes can't deal with dates.

> Updated the variable check for "catalogSlug" in BookContent.jsx.

### v2.1.8
> Updated the Header Component to v1.5.1. The update includes HTTPS fix and the JavaScript fallback for the log in button on the Header Component.

### v2.1.7
#### Added
> Enabled Feature Flags plugin on the client-side and added Optimizely script in the index.ejs file.
