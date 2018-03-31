import {h} from 'preact';
import Router from 'preact-router';
import {FormattedMessage} from 'preact-intl';

import TopMenu from '../topMenu/index';
import ModalRoot from '../modal/root'

// 404 page
import PageNotFound from '../pageNotFound'

// Profile
import ProfilePublic from '../profile/public/index'
import ProfileEmails from '../profile/emails/index';
import ProfileImages from '../profile/images/index';
import ProfilePrivate from '../profile/private/index';
import ProfilePassword from '../profile/password/index';
import ProfileConnections from '../profile/connections/index';

// Events
import Events from '../events/index.js';
import EventPublic from '../events/public/';
import EventImages from '../events/images/';
import EventCalls from '../events/calls/';

import EventSettings from '../events/settings/';

// // Performances
import Performances from '../performances/index.js';
import PerformancesPublic from '../performances/public';

// import EventPerformances from './_to_review/event/EventPerformances';
// import EventPartners from './_to_review/event/EventPartners';
// import EventPhotoGallery from './_to_review/event/EventPhotoGallery';
// import EventVideoGallery from './_to_review/event/EventVideoGallery';


// // Crews
// import Crews from './_to_review/Crews';
// import CrewOrganization from './_to_review/crew/CrewOrganization';
// import CrewPublic from './_to_review/crew/CrewPublic';
// import CrewImages from './_to_review/crew/CrewImages';
// import CrewMembers from './_to_review/crew/CrewMembers';

// // import PerformanceEdit from './_to_review/performance/Edit';
// import PerformancePublic from './_to_review/performance/PerformancePublic';
// //import PerformanceAbouts from './_to_review/performance/PerformanceAbouts';
// import PerformanceImages from './_to_review/performance/PerformanceImages';
// import PerformanceEvents from './_to_review/performance/PerformanceEvents';
// import PerformanceAuthors from './_to_review/performance/PerformanceAuthors';
// import PerformancePhotoGallery from './_to_review/performance/PerformancePhotoGallery';
// import PerformanceVideoGallery from './_to_review/performance/PerformanceVideoGallery';
// import PerformanceSettings from './_to_review/performance/PerformanceSettings';
// // Preferences
// import Preferences from './_to_review/PreferencesContainer';


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
                    <TopMenu/>
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



                    {/*<Crews path="/admin/crews"/>*/}
                    {/*<CrewPublic path="/admin/crew/public/:_id"/>*/}
                    {/*<CrewOrganization path="/admin/crew/organization/:_id"/>*/}
                    {/*<CrewImages path="/admin/crew/images/:_id"/>*/}
                    {/*<CrewMembers path="/admin/crew/members/:_id"/>*/}

                    <Performances path="/admin/performances"/>
                    <PerformancesPublic path="/admin/performances/:_id/public/"/>

                    {/*<PerformanceImages path="/admin/performance/images/:_id"/>*/}
                    {/*<PerformanceEvents path="/admin/performance/events/:_id"/>*/}
                    {/*<PerformanceAuthors path="/admin/performance/authors/:_id"/>*/}
                    {/*<PerformancePhotoGallery path="/admin/performance/photogallery/:_id"/>*/}
                    {/*<PerformanceVideoGallery path="/admin/performance/videogallery/:_id"/>*/}
                    {/*<PerformanceSettings path="/admin/performance/settings/:_id"/>*/}


                    <Events path="/admin/events"/>
                    <EventPublic path="/admin/events/:_id/public/"/>
                    <EventImages path="/admin/events/:_id/images/"/>
                    <EventCalls path="/admin/events/:_id/calls/"/>
                    {/*<EventPerformances path="/admin/events/performances/:_id"/>*/}
                    {/*<EventPartners path="/admin/event/partners/:_id"/>*/}
                    {/*<EventPhotoGallery path="/admin/event/photogallery/:_id"/>*/}
                    {/*<EventVideoGallery path="/admin/event/videogallery/:_id"/>*/}
                    <EventSettings path="/admin/events/:_id/settings/"/>

                    {/*<Preferences path="/admin/preferences"/>*/}

                    <PageNotFound type="404" default/>
                </Router>

                <ModalRoot/>

            </div>
        </div>
    );
};

export default App;
