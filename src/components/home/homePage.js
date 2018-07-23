import React from 'react';
import {Link} from 'react-router';

class HomePage extends React.Component {
    render() {
        return (
            <div className='jumbotron'>
                <h1>Weather App</h1>
                <p>Задействованы React, Redux и React Router</p>
                <div><Link to='about'>О нас</Link></div>
                <div><Link to='city'>Посмотреть погоду</Link></div>
            </div>
        );
    }
}

export default HomePage;
