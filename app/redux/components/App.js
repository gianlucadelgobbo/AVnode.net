import {h} from 'preact';
import Router from 'preact-router';
// Navigation
import Nav from './Nav';
// Profile

import ProfilePublic from './profile/public'
import ProfileImages from './profile/images';

//import ProfilePublic from './user/ProfilePublic';
//import ProfileImages from './user/ProfileImagesContainer';

import ProfileEmails from './user/ProfileEmails';
import ProfilePrivate from './user/ProfilePrivate';
import ProfilePassword from './user/ProfilePasswordContainer';
import ProfileConnections from './user/ProfileConnections';
// Crews
import Crews from './Crews';
import CrewOrganization from './crew/CrewOrganization';
import CrewPublic from './crew/CrewPublic';
import CrewImages from './crew/CrewImages';
import CrewMembers from './crew/CrewMembers';
// Performances
import Performances from './Performances';
// import PerformanceEdit from './performance/Edit';
import PerformancePublic from './performance/PerformancePublic';
//import PerformanceAbouts from './performance/PerformanceAbouts';
import PerformanceImages from './performance/PerformanceImages';
import PerformanceEvents from './performance/PerformanceEvents';
import PerformanceAuthors from './performance/PerformanceAuthors';
import PerformancePhotoGallery from './performance/PerformancePhotoGallery';
import PerformanceVideoGallery from './performance/PerformanceVideoGallery';
import PerformanceSettings from './performance/PerformanceSettings';
// Events
import Events from './Events';
// import EventEdit from './event/Edit';
import EventPublic from './event/EventPublic';
import EventImages from './event/EventImages';
import EventPerformances from './event/EventPerformances';
import EventPartners from './event/EventPartners';
import EventPhotoGallery from './event/EventPhotoGallery';
import EventVideoGallery from './event/EventVideoGallery';
import EventSettings from './event/EventSettings';
// Preferences
import Preferences from './PreferencesContainer';
import {FormattedMessage} from 'preact-intl';
import ModalRoot from './modal/root'

const App = () => {
    return (
        <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">
                        <FormattedMessage
                            id="admin"
                            defaultMessage="Control panel"
                        /></h1>
                </div>
            </div>
            <div className="container-fluid account-nav-wrap">
                <div className="container">
                    <Nav/>
                </div>
            </div>
            <div className="container">
                <Router>
                    <ProfilePublic path="/admin/profile/public"/>
                    <ProfileImages path="/admin/profile/images"/>
                    <ProfileEmails path="/admin/profile/emails"/>
                    <ProfilePrivate path="/admin/profile/private"/>
                    <ProfilePassword path="/admin/profile/password"/>
                    <ProfileConnections path="/admin/profile/connections"/>
                    <Crews path="/admin/crews"/>
                    <CrewPublic path="/admin/crew/public/:_id"/>
                    <CrewOrganization path="/admin/crew/organization/:_id"/>
                    <CrewImages path="/admin/crew/images/:_id"/>
                    <CrewMembers path="/admin/crew/members/:_id"/>
                    <Performances path="/admin/performances"/>
                    <PerformancePublic path="/admin/performance/public/:_id"/>
                    <PerformanceImages path="/admin/performance/images/:_id"/>
                    <PerformanceEvents path="/admin/performance/events/:_id"/>
                    <PerformanceAuthors path="/admin/performance/authors/:_id"/>
                    <PerformancePhotoGallery path="/admin/performance/photogallery/:_id"/>
                    <PerformanceVideoGallery path="/admin/performance/videogallery/:_id"/>
                    <PerformanceSettings path="/admin/performance/settings/:_id"/>
                    <Events path="/admin/events"/>
                    <EventPublic path="/admin/event/public/:_id"/>
                    <EventImages path="/admin/event/images/:_id"/>
                    <EventPerformances path="/admin/event/performances/:_id"/>
                    <EventPartners path="/admin/event/partners/:_id"/>
                    <EventPhotoGallery path="/admin/event/photogallery/:_id"/>
                    <EventVideoGallery path="/admin/event/videogallery/:_id"/>
                    <EventSettings path="/admin/event/settings/:_id"/>
                    <Preferences path="/admin/preferences"/>
                </Router>

                <ModalRoot/>

            </div>
        </div>
    );
};

export default App;
