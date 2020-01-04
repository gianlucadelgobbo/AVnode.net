import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { fetchList as fetchCrews } from "../crews/actions";
import { fetchList as fetchPerformances } from "../performances/actions";
import { fetchList as fetchEvents } from "../events/actions";
import { fetchList as fetchFootage } from "../footage/actions";
import { fetchList as fetchNews } from "../news/actions";
import { fetchList as fetchPlaylists } from "../playlists/actions";
import { fetchList as fetchVideos } from "../videos/actions";
import { fetchList as fetchGalleries } from "../galleries/actions";
import { getList as getCrews } from "../crews/selectors";
import { getList as getPerformances } from "../performances/selectors";
import { getList as getEvents } from "../events/selectors";
import { getList as getFootage } from "../footage/selectors";
import { getList as getNews } from "../news/selectors";
import { getList as getPlaylists } from "../playlists/selectors";
import { getList as getVideos } from "../videos/selectors";
import { getList as getGalleries } from "../galleries/selectors";

class TopBar extends Component {
  componentDidMount() {
    const {
      fetchCrews,
      fetchPerformances,
      fetchEvents,
      fetchFootage,
      fetchNews,
      fetchPlaylists,
      fetchVideos,
      fetchGalleries
    } = this.props;
    fetchCrews();
    fetchPerformances();
    fetchEvents();
    fetchFootage();
    fetchNews();
    fetchPlaylists();
    fetchVideos();
    fetchGalleries();
  }

  createMenuItem = ({ model, index }) => {
    return (
      <li key={index} className="nav-item mt-2 mb-2 d-block d-lg-none">
        
      <NavLink
        to={model.href}
        activeClassName="active"
        className="nav-link"
      >
        <span className={model.icon}></span>
        <span>{model.label}{" "}</span>
        
        <span className="badge badge-pill badge-info float-right">{model.counter}</span>
      </NavLink>
      </li>
    );
  };

  render() {
    const {
      crews,
      performances,
      events,
      footage,
      news,
      playlists,
      videos,
      galleries
    } = this.props;

    const items = [
      {
        href: "/admin/profile/public",
        icon: "fa fa-user fa-fw mr-3",
        counter: "me",
        label: <FormattedMessage id="profile" defaultMessage="Profile" />
        /* submenu: subitems[0] */
      },
      {
        href: "/admin/crews",
        icon: "fa fa-users fa-fw mr-3",
        counter: crews.length,
        label: <FormattedMessage id="crews" defaultMessage="Crews" />
        /* submenu: subitems[1] */
      },
      {
        href: "/admin/performances",
        icon: "fa fa-theater-masks fa-fw mr-3",
        counter: performances.length,
        label: (
          <FormattedMessage id="performances" defaultMessage="Performances" />
        )
        /* submenu: subitems[2] */
      },
      {
        href: "/admin/events",
        icon: "far fa-calendar fa-fw mr-3",
        counter: events.length,
        label: <FormattedMessage id="events" defaultMessage="Events" />
        /* submenu: subitems[3] */
      },
      {
        href: "/admin/news",
        icon: "fa fa-newspaper fa-fw mr-3",
        counter: news.length,
        label: <FormattedMessage id="news" defaultMessage="News" />
        /* submenu: subitems[4] */
      },
      {
        href: "/admin/videos",
        icon: "fa fa-video fa-fw mr-3",
        counter: videos.length,
        label: <FormattedMessage id="videos" defaultMessage="Videos" />
        /* submenu: subitems[5] */
      },
      {
        href: "/admin/galleries",
        icon: "fa fa-images fa-fw mr-3",
        counter: galleries.length,
        label: <FormattedMessage id="galleries" defaultMessage="Galleries" />
        /* submenu: subitems[6] */
      },
      {
        href: "/admin/footage",
        icon: "fa fa-film fa-fw mr-3",
        counter: footage.length,
        label: <FormattedMessage id="footage" defaultMessage="Footage" />
        /* submenu: subitems[7] */
      },
      {
        href: "/admin/playlists",
        icon: "fa fa-clipboard-list fa-fw mr-3",
        counter: playlists.length,
        label: <FormattedMessage id="playlists" defaultMessage="Playlists" />
        /* submenu: subitems[8] */
      }
    ];

    return (
      <nav className="navbar navbar_extended_template navbar-toggleable-md navbar-fixed-top navbar-inverse bg-inverse navbar-expand-lg">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar-collapse_admin">
          <span className="lnr lnr-menu toggle_icon"></span>
        </button>
        <a className="navbar-brand" href="/" title="AVnode.net"><img className="main_logo" src="/images/LogoAVnode-bar.svg" height="30" alt="AVnode.net" /></a>

        <div className="collapse navbar-collapse" id="navbar-collapse_admin">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item mt-2 mb-2 d-block d-lg-none"><b>Control panel</b></li>
            {items.map((model, index) => this.createMenuItem({ model, index }) )}
            <li className="nav-item mt-2 mb-2 d-block d-lg-none">
                <a className="nav-link" href="/admin/subscriptions">
                  <span className="fas fa-calendar-check fa-fw mr-3"></span>
                  <span>Subscriptions</span>
                </a>
            </li>
            <li className="nav-item mt-4 mb-2 d-block d-lg-none">
                <a className="nav-link" href="/logout">
                  <span className="fas fa-sign-out-alt fa-fw mr-3"></span>
                  <span>Log out</span>
                </a>
            </li>
        </ul>
        <ul className="user_navbar navbar-nav d-none d-sm-block">
            <li className="nav-item dropdown user_menu user_menu_logged">
                <a className="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="lnr lnr-user"></span></a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <a className="dropdown-item" href="/gianlucadelgobbo">
                      <span className="pr-2 lnr lnr-eye"></span> Profile</a>
                    <a className="dropdown-item" href="/admin/profile/public">
                        <span className="pr-2 lnr lnr-cog"></span> Control Panel</a>
                    <a className="dropdown-item" href="/logout">
                        <span className="pr-2 lnr lnr-exit"></span> Log out</a>
                </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  crews: getCrews(state),
  performances: getPerformances(state),
  events: getEvents(state),
  footage: getFootage(state),
  news: getNews(state),
  playlists: getPlaylists(state),
  videos: getVideos(state),
  galleries: getGalleries(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCrews,
      fetchPerformances,
      fetchEvents,
      fetchFootage,
      fetchNews,
      fetchPlaylists,
      fetchVideos,
      fetchGalleries
    },
    dispatch
  );

TopBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);

export default TopBar;
