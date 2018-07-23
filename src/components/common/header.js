import React, {PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';

const Header = () => {
    return (
        <nav>
            <IndexLink to='/' activeClassName='active'>Главная</IndexLink>
            {" | "}
            <Link to='/city' activeClassName='active'>Погода</Link>
            {" | "}
            <Link to='/about' activeClassName='active'>О нас</Link>
        </nav>
    );
};

export default Header;
