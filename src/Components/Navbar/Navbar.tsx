import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { pages } from '../../main';

export function Navbar(){
    return (
        <nav>
            {pages.map(route => route.label ? <NavLink to={route.path} className={({isActive}) => isActive ? 'nav-link-active': 'nav-link'}>{route.label}</NavLink> : null)}
        </nav>
    )
}