import { h } from 'preact';
import Router from 'preact-router';
// Navigation
import Nav from './Nav';
import SideNav from './SideNav';
// Profile
import Profile from './user/ProfilePublicContainer';
import ProfileImages from './user/ProfileImagesContainer';
import ProfileLinks from './user/ProfileLinksContainer';
import ProfileEmails from './user/ProfileEmailsContainer';
import ProfileAddresses from './user/ProfileAddressesContainer';
import ProfilePrivate from './user/ProfilePrivate';
import ProfilePassword from './user/ProfilePassword';
import ProfileConnections from './user/ProfileConnections';
// Crews
import Crews from './Crews';
import CrewEdit from './crew/Edit';
import CrewImages from './crew/CrewImagesContainer';
import CrewMembers from './crew/CrewMembersContainer';
// Performances
import Performances from './Performances';
import PerformanceEdit from './performance/Edit';
//import PerformanceAbouts from './performance/PerformanceAbouts';
import PerformanceImages from './performance/PerformanceImagesContainer';
import PerformanceEvents from './performance/PerformanceEventsContainer';
import PerformanceAuthors from './performance/PerformanceAuthorsContainer';
import PerformancePhotoGallery from './performance/PerformancePhotoGalleryContainer';
import PerformanceVideoGallery from './performance/PerformanceVideoGalleryContainer';
import PerformanceSettings from './performance/PerformanceSettingsContainer';
// Events
import Events from './Events';
import EventEdit from './event/Edit';
import EventImages from './event/EventImagesContainer';
import EventPerformances from './event/EventPerformancesContainer';
import EventPartners from './event/EventPartnersContainer';
import EventPhotoGallery from './event/EventPhotoGalleryContainer';
import EventVideoGallery from './event/EventVideoGalleryContainer';
import EventSettings from './event/EventSettingsContainer';

// Preferences
import Preferences from './PreferencesContainer';
import { FormattedMessage } from 'preact-intl';

const App = () => {
  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4"><FormattedMessage
            id="account"
            defaultMessage="Account"
          /></h1>
        </div>
      </div>
      <div className="container-fluid account-nav-wrap">
        <div className="container">
          <Nav />
        </div>
      </div>
      <div className="container-fluid">
        <SideNav />
      </div>
      <div className="container">
        <Router>
          <Profile path="/account/profile" />
          <ProfileImages path="/account/profile/images" />
          <ProfileLinks path="/account/profile/links" />
          <ProfileEmails path="/account/profile/emails" />
          <ProfileAddresses path="/account/profile/addresses" />
          <ProfilePrivate path="/account/profile/private" />
          <ProfilePassword path="/account/profile/password" />
          <ProfileConnections path="/account/profile/connections" />
          <Crews path="/account/crews" />
          <CrewImages path="/account/crew/images" />
          <CrewMembers path="/account/crew/members" />
          <CrewEdit path="/account/crews/:_id" />
          <Performances path="/account/performances" />
          <PerformanceEdit path="/account/performances/:_id" />
          <PerformanceImages path="/account/performance/images" />
          <PerformanceEvents path="/account/performance/events" />
          <PerformanceAuthors path="/account/performance/authors" />
          <PerformancePhotoGallery path="/account/performance/photogallery" />
          <PerformanceVideoGallery path="/account/performance/videogallery" />
          <PerformanceSettings path="/account/performance/settings" />
          <Events path="/account/events" />
          <EventEdit path="/account/events/:_id" />
          <EventImages path="/account/event/images" />
          <EventPerformances path="/account/event/performances" />
          <EventPartners path="/account/event/partners" />
          <EventPhotoGallery path="/account/event/photogallery" />
          <EventVideoGallery path="/account/event/videogallery" />
          <EventSettings path="/account/event/settings" />
          <Preferences path="/account/preferences" />
        </Router>
      </div>
    </div>
  );
};

export default App;
