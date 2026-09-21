import { NavLink, useNavigate } from 'react-router-dom'

// Shared chrome for the authenticated pages: top bar + nav + the page passed in.
function Layout({ children }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
    }

    return (
        <div className="App">
            <header className="topbar">
                <h1>repo-react User Manager</h1>
                <nav className="nav">
                    <NavLink to="/users" end>
                        Users
                    </NavLink>
                    <NavLink to="/users/new">Add user</NavLink>
                    <button className="ghost" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>

            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout
