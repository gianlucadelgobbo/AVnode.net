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
import EventUsers from '../events/users/';
import EventProgram from '../events/program/';
import EventGalleries from '../events/galleries/';
import EventVideos from '../events/videos/';
import EventCalls from '../events/calls/';
import EventSettings from '../events/settings/';

// // Performances
import Performances from '../performances/index.js';
import PerformancesPublic from '../performances/public';
import PerformancesGalleries from '../performances/galleries';
import PerformancesVideos from '../performances/videos';

// // Crews
import Crews from '../crews/index.js';
import CrewsPublic from '../crews/public';
import CrewsImages from '../crews/images';
import CrewsMembers from '../crews/members';
import CrewsOrganization from '../crews/organization';

// // Preferences
import Preferences from '../preferences/index';


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

                    <Crews path="/admin/crews"/>
                    <CrewsPublic path="/admin/crews/:_id/public/"/>
                    <CrewsImages path="/admin/crews/:_id/images/"/>
                    <CrewsMembers path="/admin/crews/:_id/members/"/>
                    <CrewsOrganization path="/admin/crews/:_id/organization/"/>

                    <Performances path="/admin/performances"/>
                    <PerformancesPublic path="/admin/performances/:_id/public/"/>
                    <PerformancesGalleries path="/admin/performances/:_id/galleries/"/>
                    <PerformancesVideos path="/admin/performances/:_id/videos/"/>

                    <Events path="/admin/events"/>
                    <EventPublic path="/admin/events/:_id/public/"/>
                    <EventImages path="/admin/events/:_id/images/"/>
                    <EventUsers path="/admin/events/:_id/users/"/>
                    <EventProgram path="/admin/events/:_id/program/"/>
                    <EventGalleries path="/admin/events/:_id/galleries/"/>
                    <EventVideos path="/admin/events/:_id/videos/"/>
                    <EventCalls path="/admin/events/:_id/calls/"/>
                    <EventSettings path="/admin/events/:_id/settings/"/>

                    <Preferences path="/admin/preferences"/>

                    <PageNotFound type="404" default/>
                </Router>

                <ModalRoot/>

            </div>
        </div>
    );
};

export default App;
