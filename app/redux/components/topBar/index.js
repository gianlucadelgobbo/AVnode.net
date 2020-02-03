import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";

class TopBar extends Component {
  createMenuItem = ({ model, index }) => {
    return (
      <li key={index} className="nav-item mt-2 mb-2 d-block d-lg-none">
        <NavLink to={model.href} activeClassName="active" className="nav-link">
          <span className={model.icon}></span>
          <span>{model.label} </span>

          <span className="badge badge-pill badge-info float-right">
            {model.counter}
          </span>
        </NavLink>
      </li>
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
      <nav className="navbar navbar_extended_template navbar-toggleable-md navbar-fixed-top navbar-inverse bg-inverse navbar-expand-lg">
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-collapse_admin"
        >
          <span className="lnr lnr-menu toggle_icon"></span>
        </button>
        <a className="navbar-brand" href="/" title="AVnode.net">
          <img
            className="main_logo"
            src="/images/LogoAVnode-bar.svg"
            height="30"
            alt="AVnode.net"
          />
        </a>

        <div className="collapse navbar-collapse" id="navbar-collapse_admin">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item mt-2 mb-2 d-block d-lg-none">
              <b>Control panel</b>
            </li>
            {items.map((model, index) => this.createMenuItem({ model, index }))}
            <li className="nav-item mt-2 mb-2 d-block d-lg-none">
              <a className="nav-link" href="/admin/subscriptions">
                <span className="fas fa-calendar-check fa-fw mr-3"></span>
                <span>Subscriptions</span>
              </a>
            </li>
            <li className="nav-item mt-2 mb-2 d-block d-lg-none">
              <a className="nav-link" href="/adminpro/">
                <span className="fas fa-tools fa-fw mr-3"></span>
                <span>Advanced Tools</span>
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
              <a
                className="nav-link dropdown-toggle"
                id="userDropdown"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="lnr lnr-user"></span>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="userDropdown"
              >
                <a className="dropdown-item" href={user_url}>
                  <span className="pr-2 lnr lnr-eye"></span> Profile
                </a>
                <a className="dropdown-item" href={items[0].href}>
                  <span className="pr-2 lnr lnr-cog"></span> Control Panel
                </a>
                <a className="dropdown-item" href="/logout">
                  <span className="pr-2 lnr lnr-exit"></span> Log out
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default TopBar;
