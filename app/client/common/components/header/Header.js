import React from "react";
import Relay from "react-relay";
import AppBar from "material-ui/AppBar";

import IconButton from "material-ui/IconButton";
import PersonIcon from "material-ui/svg-icons/social/person";

import LogoutMutation from "../../../mutation/LogoutMutation";
import logout from "../../../common/logout";

function _logout(user) {
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

function getUserMenu(props, router) {
    const user = props.viewer.user ? props.viewer.user : {};

    return (
        <IconButton
            onClick={() => router.push('/')}
        >
          <PersonIcon />
        </IconButton>
    )

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
};

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

