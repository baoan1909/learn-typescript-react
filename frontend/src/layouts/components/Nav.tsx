import { NavLink } from "react-router-dom";

const menus = [
    {
        url: "/",
        text: "Dashboard"
    },
    {
        url: "/categories",
        text: "Categories"
    },
    {
        url: "/products",
        text: "Products"
    },
    {
        url: "/orders",
        text: "Orders"
    },
    {
        url: "/users",
        text: "Users"
    },

]

export default function Nav() {
    const activeClassName = ({isActive}: {isActive:boolean}) => {
        return isActive 
        ? "bg-blue-500 block py-4 rounded-sm px-3 text-white" 
        : "block py-4 px-3";
    };
    return (
        <ul className="mt-5 px-5">
            {menus.map((menu, index) => (
                <li key={index}>
                    <NavLink to={menu.url} className={activeClassName}>
                        {menu.text}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}
