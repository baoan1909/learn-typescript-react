import logo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-20 bg-white">
         <div>
            <Link to="/">
                <img src={logo} alt="Logo"/>
            </Link>
         </div>
    </aside>
  )
}
