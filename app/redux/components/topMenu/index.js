import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";

class TopMenu extends Component {
  createMenuItem = ({ model, index }) => {
    return (
      <NavLink
        to={model.href}
        activeClassName="active"
        className="bg-dark list-group-item list-group-item-action"
        key={index}
      >
        <span className={model.icon}></span>
        <span className="menu-collapsed">{model.label} </span>

        <span className="badge badge-pill badge-info float-right">
          {model.counter}
        </span>
      </NavLink>
    );
  };

  render() {
    const { user } = this.props;

    const _id = user !== undefined ? user._id : "";
    const _crews = user !== undefined && user.stats && user.stats.crews ? user.stats.crews : "";
    const _performances = user !== undefined && user.stats && user.stats.performances ? user.stats.performances : "";
    const _events = user !== undefined && user.stats && user.stats.events ? user.stats.events : "";
    const _footage = user !== undefined && user.stats && user.stats.footage ? user.stats.footage : "";
    const _news = user !== undefined && user.stats && user.stats.news ? user.stats.news : "";
    const _playlists = user !== undefined && user.stats && user.stats.playlists ? user.stats.playlists : "";
    const _videos = user !== undefined && user.stats && user.stats.videos ? user.stats.videos : "";
    const _galleries = user !== undefined && user.stats && user.stats.galleries ? user.stats.galleries : "";
    const user_url = user !== undefined ? "/" + user.slug : "/";

    const items = [
      {
        href: `/admin/profile/${_id}/public`,
        icon: "fa fa-user fa-fw mr-3",
        counter: "me",
        label: <FormattedMessage id="profile" defaultMessage="Profile" />
        /* submenu: subitems[0] */
      },
      {
        href: "/admin/crews",
        icon: "fa fa-users fa-fw mr-3",
        counter: _crews,
        label: <FormattedMessage id="crews" defaultMessage="Crews" />
        /* submenu: subitems[1] */
      },
      {
        href: "/admin/performances",
        icon: "fa fa-theater-masks fa-fw mr-3",
        counter: _performances,
        label: (
          <FormattedMessage id="performances" defaultMessage="Performances" />
        )
        /* submenu: subitems[2] */
      },
      {
        href: "/admin/events",
        icon: "far fa-calendar fa-fw mr-3",
        counter: _events,
        label: <FormattedMessage id="events" defaultMessage="Events" />
        /* submenu: subitems[3] */
      },
      {
        href: "/admin/news",
        icon: "fa fa-newspaper fa-fw mr-3",
        counter: _news,
        label: <FormattedMessage id="news" defaultMessage="News" />
        /* submenu: subitems[4] */
      },
      {
        href: "/admin/videos",
        icon: "fa fa-video fa-fw mr-3",
        counter: _videos,
        label: <FormattedMessage id="videos" defaultMessage="Videos" />
        /* submenu: subitems[5] */
      },
      {
        href: "/admin/galleries",
        icon: "fa fa-images fa-fw mr-3",
        counter: _galleries,
        label: <FormattedMessage id="galleries" defaultMessage="Galleries" />
        /* submenu: subitems[6] */
      },
      {
        href: "/admin/footage",
        icon: "fa fa-film fa-fw mr-3",
        counter: _footage,
        label: <FormattedMessage id="footage" defaultMessage="Footage" />
        /* submenu: subitems[7] */
      },
      {
        href: "/admin/playlists",
        icon: "fa fa-clipboard-list fa-fw mr-3",
        counter: _playlists,
        label: <FormattedMessage id="playlists" defaultMessage="Playlists" />
        /* submenu: subitems[8] */
      }
    ];

    return (
      <div className="d-print-none">
        <div
          className="sidebar-expanded d-none d-lg-block"
          id="sidebar-container"
        >
          <nav id="account-nav" className="list-group">
            <div className="list-group-item sidebar-separator-title d-flex">
              <small className="menu-collapsed">Control panel</small>
            </div>
            {items.map((model, index) => this.createMenuItem({ model, index }))}
            <a
              className="bg-dark list-group-item"
              aria-current="false"
              href="/admin/subscriptions"
            >
              <div className="d-flex w-100 justify-content-start align-items-center">
                <span className="fa fa-calendar-check fa-fw mr-3"></span>
                <span className="menu-collapsed">Subscriptions</span>
              </div>
            </a>
            <a
              className="bg-dark list-group-item"
              href="#"
              data-toggle="sidebar-collapse"
            >
              <div className="d-flex w-100 justify-content-start align-items-center">
                <span className="fa fa-arrow-alt-circle-left fa-fw mr-3"></span>
                <span className="menu-collapsed">Collapse</span>
              </div>
            </a>
          </nav>
        </div>
      </div>
    );
  }
}

export default TopMenu;
