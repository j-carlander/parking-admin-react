import { NavLink } from 'react-router-dom';
import './Navbar.css';

export function Navbar(){
    return (
        <nav>
            <ul className='nav-list'>
                <li><NavLink to={'/'} className={({isActive}) => isActive ? 'nav-link-active': 'nav-link'}>Bokningar</NavLink></li>
                <li><NavLink to={'/ordrar'} className={({isActive}) => isActive ? 'nav-link-active': 'nav-link'}>Ordrar</NavLink></li>
                <li><NavLink to={'/garage'} className={({isActive}) => isActive ? 'nav-link-active': 'nav-link'}>Garage</NavLink></li>
            </ul>
        </nav>
    )
}