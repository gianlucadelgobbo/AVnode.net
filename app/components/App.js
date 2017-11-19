import { h } from 'preact';
import Router from 'preact-router';
import Match from 'preact-router/match';
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
import CrewPublic from './crew/CrewPublicContainer';
import CrewImages from './crew/CrewImagesContainer';
import CrewMembers from './crew/CrewMembersContainer';
// Performances
import Performances from './Performances';
import PerformanceEdit from './performance/Edit';
import PerformancePublic from './performance/PerformancePublicContainer';
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
import EventPublic from './event/EventPublicContainer';
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
          <h1 className="display-4">
          <FormattedMessage
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
{ /*     <div className="container-fluid">
        <Match>
          { ({ url }) => <SideNav url={url} /> }
        </Match>
  </div>*/}
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
          <CrewPublic path="/account/crew/public/:_id" />
          <CrewImages path="/account/crew/images/:_id" />
          <CrewMembers path="/account/crew/members/:_id" />
          <CrewEdit path="/account/crew/:_id" />
          <Performances path="/account/performances" />
          <PerformancePublic path="/account/performance/public/:_id" />
          <PerformanceEdit path="/account/performances/:_id" />
          <PerformanceImages path="/account/performance/images/:_id" />
          <PerformanceEvents path="/account/performance/events/:_id" />
          <PerformanceAuthors path="/account/performance/authors/:_id" />
          <PerformancePhotoGallery path="/account/performance/photogallery/:_id" />
          <PerformanceVideoGallery path="/account/performance/videogallery/:_id" />
          <PerformanceSettings path="/account/performance/settings/:_id" />
          <Events path="/account/events" />
          <EventPublic path="/account/event/public/:_id" />
          <EventEdit path="/account/event/:_id" />
          <EventImages path="/account/event/images/:_id" />
          <EventPerformances path="/account/event/performances/:_id" />
          <EventPartners path="/account/event/partners/:_id" />
          <EventPhotoGallery path="/account/event/photogallery/:_id" />
          <EventVideoGallery path="/account/event/videogallery/:_id" />
          <EventSettings path="/account/event/settings/:_id" />
          <Preferences path="/account/preferences" />
        </Router>
      </div>
    </div>
  );
};

export default App;
