import React from 'react';
import Relay from 'react-relay';
import AppBar from 'material-ui/AppBar';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';

import LogoutMutation from '../../../mutation/LogoutMutation';
import logout from '../../../common/logout';

import {ROLES} from '../../../../config';

function _logout (user) {
  logout(user,
    {
      onFailure: (transaction) => {
        console.log('onFailure');
        console.log(transaction.getError());
      },
      onSuccess: (response) => location.assign(location.protocol + '//' + location.host)
    }
  );
}

function getUserMenu (props, router) {
  const user = props.viewer.user ? props.viewer.user : {};

  // ROLES
  /*if (user.role === ROLES.logged) {
    return (
      <IconMenu
        iconButtonElement={ <IconButton><PersonIcon /></IconButton> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >

        <MenuItem
          primaryText="Profile"
          onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Logout"
          onClick={() => _logout(user)} />

      </IconMenu>
    );
  }
  else if (user.role === ROLES.anonymous) {*/
    return (
      <IconButton
        onClick={() => router.push('/login')}
      >
        <PersonIcon />
      </IconButton>
    )
  //}
}

const Header = (props, context) => (
  <AppBar
    title="Relay Authentication"
    onLeftIconButtonTouchTap={props.toggleNavigation}
    iconElementRight={getUserMenu(props, context.router)}
  />
);

Header.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(Header, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          firstName,
          lastName,
          role,
          ${LogoutMutation.getFragment('user')}
        },
      }
    `,
  }
});

