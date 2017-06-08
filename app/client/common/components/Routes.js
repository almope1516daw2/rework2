import React from "react";
import {IndexRoute, Route} from "react-router";

import App from "./App";
import LoginPage from "../../pages/user/login/login";
import RegisterPage from "../../pages/user/register/register";
import ProfilePage from "../../pages/user/Profile";

import ViewerQuery from "../../queries/ViewerQuery";


export default (
    <Route path="/" component={App} queries={ViewerQuery}>
        <IndexRoute component={LoginPage} queries={ViewerQuery}/>
        <Route path="register" component={RegisterPage} queries={ViewerQuery}/>
        <Route path="user" component={ProfilePage} queries={ViewerQuery}/>
    </Route>
);
