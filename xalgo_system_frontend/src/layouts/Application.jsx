// libraries
import { Router } from '@reach/router';
import React from 'react';

// rm-components
import Box from '../components/layout/Box';

// Pages
import Browse from './Browse';
import Dashboard from './Dashboard';
import Editor from './Editor';
import Landing from './Landing';
import Login from './Login';
import Theme from '../components/patterns/Theme';
import NewRule from './NewRule';

// other components
import ScrollUp from './components/ScrollUp';

// layouts
import Navigation from './components/Navigation';
import Query from './Query';
import Footer from './components/Footer';

// Styling

const baseBoxStyle = {
  minHeight: '100vh',
  margin: 0,
  paddingTop: 90,
};

// Primary Component
export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
      userInfo: {
        name: 'Aaron Anon',
        solidUsername: 'https://anon.solid.community/profile/card#me',
      },
      userRules: [
        {
          name: 'Quebec Gas Station Tax',
          path: 'anon.gas-tax',
        },
        {
          name: 'Singapore Property Tax',
          path: 'anon.property-tax-sg',
        },
      ],
    };

    // Bind functions
    this.toggleLoggedin = this.toggleLoggedin.bind(this);
  }

  toggleLoggedin() {
    const { authenticated } = this.state;
    this.setState({ authenticated: !authenticated });
  }

  render() {
    const { username, user, token, refresh } = this.props;
    const { authenticated, userRules, userInfo } = this.state;
    return (
      <ScrollUp>
        <Theme>
          <Navigation authenticated={authenticated} username={username} user={user} />

          <Box style={baseBoxStyle}>
            <Router primary={false} basepath="/apps/rm">
              <Landing
                path="/"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
              <Browse
                path="/browse"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
              <Editor
                path="/editor/:ruleUUID"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
              <NewRule
                path="/editor"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
                token={token}
                refresh={refresh}
              />
              <Login
                path="/login"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
              <Query
                path="/query"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
              <Dashboard
                path="/dashboard"
                authenticated={authenticated}
                userRules={userRules}
                userInfo={userInfo}
                toggleAuth={this.toggleLoggedin}
                username={username}
                user={user}
              />
            </Router>
          </Box>
          <Footer />
        </Theme>
      </ScrollUp>
    );
  }
}
