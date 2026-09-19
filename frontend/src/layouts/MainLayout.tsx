import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function MainLayout() {
    return (
        <div className="flex">
            <Sidebar />
            <div>
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
