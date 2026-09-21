import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import UserForm from '../components/UserForm'
import { API_BASE } from '../config'

// /users/new (admin, logged in) and /signup (public) both render this page.
function UserCreatePage() {
    const navigate = useNavigate()
    const loggedIn = Boolean(localStorage.getItem('token'))

    const handleSubmit = async (formData) => {
        await axios.post(API_BASE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        // Admin adding a user stays in the app; a public signup goes to sign in.
        navigate(loggedIn ? '/users' : '/login')
    }

    return (
        <div>
            <div className="row spread">
                <h2>{loggedIn ? 'Add user' : 'Sign up'}</h2>
                {loggedIn && (
                    <Link className="btn-link" to="/users">
                        ← Back to list
                    </Link>
                )}
            </div>
            <UserForm onSubmit={handleSubmit} />
        </div>
    )
}

export default UserCreatePage
