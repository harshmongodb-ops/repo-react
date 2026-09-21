import { useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { API_BASE } from '../config'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Plain-JS validation - returns an { field: message } object (empty = valid).
function validate({ email, password }) {
    const errors = {}
    if (!email.trim()) errors.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    return errors
}

// /login
function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/users'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        const found = validate({ email, password })
        setErrors(found)
        if (Object.keys(found).length > 0) return

        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE}/login`, {
                email: email.trim(),
                password
            })

            // The controller returns 200 even on bad credentials, with an `error` field.
            if (response.data.error) {
                setFormError(response.data.error)
                return
            }

            localStorage.setItem('token', response.data.token)
            navigate(from, { replace: true })
        } catch (err) {
            setFormError(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="App">
            <div className="card auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <label>
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setErrors((p) => ({ ...p, email: undefined }))
                            }}
                        />
                    </label>
                    {errors.email && <p className="error">{errors.email}</p>}

                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors((p) => ({ ...p, password: undefined }))
                            }}
                        />
                    </label>
                    {errors.password && <p className="error">{errors.password}</p>}

                    {formError && <p className="error">{formError}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className="hint">
                    No account yet? <Link to="/signup">Sign up</Link>.
                </p>
            </div>
        </div>
    )
}

export default LoginPage
