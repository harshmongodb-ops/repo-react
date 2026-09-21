import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import UserForm from '../components/UserForm'

const API_BASE = 'http://localhost:5000/api/userdata'

// /users/:id/edit
function UserEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios
            .get(`${API_BASE}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setUser(res.data.data))
            .catch((err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token')
                    navigate('/login', { replace: true })
                    return
                }
                setError(err.response?.data?.message || err.message)
            })
    }, [id, navigate])

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('token')
        await axios.put(`${API_BASE}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        navigate('/users')
    }

    return (
        <div>
            <div className="row spread">
                <h2>Edit user</h2>
                <Link className="btn-link" to="/users">
                    ← Back to list
                </Link>
            </div>

            {error && <p className="error">{error}</p>}
            {!user && !error ? (
                <p className="muted">Loading...</p>
            ) : user ? (
                <UserForm initial={user} isEdit onSubmit={handleSubmit} />
            ) : null}
        </div>
    )
}

export default UserEditPage
