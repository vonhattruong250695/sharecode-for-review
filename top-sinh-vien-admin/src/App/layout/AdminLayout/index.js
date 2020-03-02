import React, { Component, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from 'react-full-screen';
import windowSize from 'react-window-size';
import PrivateRoute from '../../../hoc/PrivateRoute';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from '../Loader';
import routes from '../../../routes';
import Aux from '../../../hoc/_Aux';
import * as actionTypes from '../../../store/common/actions';

import './app.scss';

class AdminLayout extends Component {

  fullScreenExitHandler = () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      this.props.onFullScreenExit();
    }
  };

  componentWillMount() {
    if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
      this.props.onComponentWillMount();
    }
  }

  mobileOutClickHandler() {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  }

  render() {

    /* full screen exit call */
    document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
    document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);

    const menu = routes.map((route, index) => {
      return (route.component) ? (
        <PrivateRoute
          key={index}
          path={route.path}
          exact={route.exact}
          name={route.name}
          component={route.component}
          authorization={route.authorization}
        />
      ) : (null);
    });

    return (
      <Aux>
        <Fullscreen enabled={this.props.isFullScreen}>
          <Navigation />
          <NavBar />
          <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <Breadcrumb />
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Suspense fallback={<Loader />}>
                        <Switch>
                          {menu}
                          <Redirect from="/" to={this.props.defaultPath} />
                        </Switch>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fullscreen>
      </Aux>
    );
  }
}

const mapStateToProps = store => {
  return {
    defaultPath: store.common.defaultPath,
    isFullScreen: store.common.isFullScreen,
    collapseMenu: store.common.collapseMenu,
    configBlock: store.common.configBlock,
    layout: store.common.layout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));