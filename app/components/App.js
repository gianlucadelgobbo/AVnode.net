import { h } from 'preact';
import Router from 'preact-router';

import Nav from './Nav';
import Profile from './user/GeneralContainer';
import ProfileAbouts from './user/ProfileAboutsContainer';
import ProfileImages from './user/ProfileImagesContainer';
import ProfileLinks from './user/ProfileLinksContainer';
import ProfileEmails from './user/ProfileEmailsContainer';
import ProfileAddresses from './user/ProfileAddressesContainer';
import Events from './Events';
import EventEdit from './event/Edit';
import Crews from './Crews';
import CrewEdit from './crew/Edit';
import Performances from './Performances';
import PerformanceEdit from './performance/Edit';
import PerformanceAbouts from './performance/PerformanceAbouts';
import Preferences from './PreferencesContainer';
import { FormattedMessage } from 'preact-intl';

const App = () => {
  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4"><FormattedMessage
            id="Account"
            defaultMessage="Account"
          /></h1>
        </div>
      </div>
      <div className="container-fluid account-nav-wrap">
        <div className="container">
          <Nav />
        </div>
      </div>
      <div className="container">
        <Router>
          <Profile path="/account/profile" />
          <ProfileAbouts path="/account/profileabouts" />
          <ProfileImages path="/account/profileimages" />
          <ProfileLinks path="/account/profilelinks" />
          <ProfileEmails path="/account/profileemails" />
          <ProfileAddresses path="/account/profileaddresses" />
          <Events path="/account/events" />
          <EventEdit path="/account/events/:_id" />
          <Crews path="/account/crews" />
          <CrewEdit path="/account/crews/:_id" />
          <Performances path="/account/performances" />
          <PerformanceAbouts path="/account/performanceabouts/:_id" />
          <PerformanceEdit path="/account/performances/:_id" />
          <Preferences path="/account/preferences" />
        </Router>
      </div>
    </div>
  );
};

export default App;
