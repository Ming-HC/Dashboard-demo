import React from 'react';
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home';
import Navigation from './components/Navigation/Navigation';

function App(): JSX.Element {
  return (
    // <BrowserRouter>
    <HashRouter>
      <div>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/Dashboard-demo/:year/:county/:district" component={Home} />
        </Switch>
      </div>
    </HashRouter>
    // </BrowserRouter>
  );
}

export default App;
