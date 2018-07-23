import React from 'react';
import{Route, IndexRoute} from 'react-router';
import App from './components/App';
import HomePage from './components/home/homePage';
import AboutPage from './components/about/aboutPage';
import citysPage from './components/city/citysPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage}  />
        <Route path='city' component={citysPage} />
        <Route path='about' component={AboutPage} />
    </Route>
);
