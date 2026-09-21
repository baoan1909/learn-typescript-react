import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';
import Nav from './Nav';

export default function Sidebar() {
  return (
    <aside className="w-62.5 bg-white p-5">
         <div className="text-center">
            <Link to="/">
                <img src={logo} alt="Logo" className="w-20 inline-block"/>
            </Link>
         </div>
         <Nav />
         <hr />
    </aside>
  )
}
