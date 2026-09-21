import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../config'

// /users
function UsersListPage() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setError('')
        setLoading(true)
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get(API_BASE, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(response.data.data)
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
                return
            }
            setError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return
        const token = localStorage.getItem('token')
        try {
            await axios.delete(`${API_BASE}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            await load()
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        }
    }

    return (
        <div className="card">
            <div className="row spread">
                <h2>Users ({users.length})</h2>
                <Link className="btn-link" to="/users/new">
                    + Add user
                </Link>
            </div>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p className="muted">Loading...</p>
            ) : users.length === 0 ? (
                <p className="muted">No users yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {user.image ? (
                                        <img className="thumb" src={user.image} alt={user.name} />
                                    ) : (
                                        <span className="muted">—</span>
                                    )}
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '—'}</td>
                                <td>{user.address || '—'}</td>
                                <td className="actions">
                                    <Link className="ghost btn-link" to={`/users/${user._id}/edit`}>
                                        Edit
                                    </Link>
                                    <button className="danger" onClick={() => handleDelete(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default UsersListPage
