import { useState } from 'react'
import { API_ORIGIN } from '../config'

const emptyValues = { name: '', email: '', password: '', phone: '', address: '' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\d{10}$/

// Plain-JS validation - returns an { field: message } object (empty = valid).
function validate(values, { isEdit }) {
    const errors = {}

    const name = values.name.trim()
    if (!name) errors.name = 'Name is required'
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters'

    const email = values.email.trim()
    if (!email) errors.email = 'Email is required'
    else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address'

    // Create: password required. Edit: optional, but validated when typed.
    if (!isEdit && !values.password) {
        errors.password = 'Password is required'
    } else if (values.password && values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
    }

    const phone = values.phone.trim()
    if (phone && !PHONE_RE.test(phone)) {
        errors.phone = 'Phone must be exactly 10 digits'
    }

    return errors
}

// Reused by the create and edit pages.
// `initial`  - prefill values (edit mode)
// `isEdit`   - toggles "password optional" + button label
// `onSubmit` - receives a ready-to-send FormData (multipart, so the image rides along)
function UserForm({ initial, isEdit = false, onSubmit }) {
    const [values, setValues] = useState({ ...emptyValues, ...initial, password: '' })
    const [imageFile, setImageFile] = useState(null)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [saving, setSaving] = useState(false)

    const onField = (e) => {
        const { name, value } = e.target
        setValues((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        const found = validate(values, { isEdit })
        setErrors(found)
        if (Object.keys(found).some((k) => found[k])) return

        const body = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            const trimmed = typeof value === 'string' ? value.trim() : value
            if (trimmed !== '') body.append(key, trimmed)
        })
        if (imageFile) body.append('image', imageFile)

        setSaving(true)
        try {
            await onSubmit(body)
        } catch (err) {
            setFormError(err.response?.data?.message || err.message)
            setSaving(false)
        }
    }

    const currentImage = initial?.image ? `${API_ORIGIN}${initial.image}` : ''

    return (
        <form className="card" onSubmit={handleSubmit} noValidate>
            <label>
                Name
                <input name="name" value={values.name} onChange={onField} />
            </label>
            {errors.name && <p className="error">{errors.name}</p>}

            <label>
                Email
                <input name="email" type="text" value={values.email} onChange={onField} />
            </label>
            {errors.email && <p className="error">{errors.email}</p>}

            <label>
                Password {isEdit && <span className="muted">(leave blank to keep current)</span>}
                <input
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onField}
                />
            </label>
            {errors.password && <p className="error">{errors.password}</p>}

            <label>
                Phone
                <input name="phone" value={values.phone} onChange={onField} />
            </label>
            {errors.phone && <p className="error">{errors.phone}</p>}

            <label>
                Address
                <input name="address" value={values.address} onChange={onField} />
            </label>

            <label>
                Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
            </label>
            {currentImage && !imageFile && (
                <img className="thumb" src={currentImage} alt="current" />
            )}

            {formError && <p className="error">{formError}</p>}

            <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? 'Update user' : 'Create user'}
            </button>
        </form>
    )
}

export default UserForm
