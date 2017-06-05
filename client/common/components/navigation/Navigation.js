import React from 'react';
import Relay from 'react-relay';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

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

function getAccountMenu (props) {
  const user = props.viewer.user ? props.viewer.user : {};
  if (user.role === ROLES.anonymous) {
    return <MenuItem onClick={() => props.navigateTo('/login')}>Login</MenuItem>;
  }
  else {
    return (
      <span>
        <MenuItem
          onClick={() => props.navigateTo('/user')}
        >
          Profile
        </MenuItem>


        <MenuItem
          onClick={() => _logout(user)}
        >
          Logout
        </MenuItem>
      </span>
    )
  }
}

const Navigation = (props) => (
  <Drawer open={props.open}>
    <IconButton onClick={() => props.close()}>
      <NavigationClose />
    </IconButton>

    <Divider />

    {getAccountMenu(props)}

    <Divider />

  </Drawer>
);

export default Relay.createContainer(Navigation, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          firstName,
          role,
          ${LogoutMutation.getFragment('user')}
        }
      }
    `,
  }
});