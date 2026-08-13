'use client'

import { useEffect, useState } from 'react'
import { createUser, deleteUser, demoteUser, getUsers, promoteUser, updateUser } from '@/lib/api/users'
import { clearStoredSession, getStoredToken, getStoredUser } from '@/lib/session'
import { Role, User } from '@/types/user'
import LoginForm from '@/components/LoginForm'

const emptyFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: 'user' as Role,
}

const Home = () => {
  // set up component state
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState(emptyFormData)

  // Restore session on mount
  useEffect(() => {
    setToken(getStoredToken())
    setCurrentUser(getStoredUser())
  }, [])

  // Load users once authenticated
  useEffect(() => {
    if (!token) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    getUsers(token)
      .then((fetchedUsers) => {
        if (!cancelled) setUsers(fetchedUsers)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load users')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  if (!token) {
    return (
      <LoginForm
        onLogin={(user) => {
          setCurrentUser(user)
          setToken(getStoredToken())
        }}
      />
    )
  }

  const handleLogout = () => {
    clearStoredSession()
    setToken(null)
    setCurrentUser(null)
    setUsers([])
  }

  // helpers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const newUser = await createUser(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber || undefined,
        },
        token
      )
      setUsers([...users, newUser])
      setFormData(emptyFormData)
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phoneNumber: user.phoneNumber ?? '',
      role: user.role,
    })
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setError(null)
    try {
      let updated = await updateUser(
        editingUser.id,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
        },
        token
      )

      if (formData.role !== editingUser.role) {
        updated =
          formData.role === 'admin'
            ? await promoteUser(editingUser.id, token)
            : await demoteUser(editingUser.id, token)
      }

      setUsers(users.map((user) => (user.id === updated.id ? updated : user)))
      setEditingUser(null)
      setFormData(emptyFormData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    setError(null)
    try {
      await deleteUser(id, token)
      setUsers(users.filter((user) => user.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  // return JSX
  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>User Manager</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {currentUser && <span>{currentUser.email}</span>}
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add New User
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '2rem', background: '#f8fafc' }}>
            <h2 style={{ marginTop: 0 }}>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label" htmlFor="add-firstName">First Name</label>
                <input
                  id="add-firstName"
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="add-lastName">Last Name</label>
                <input
                  id="add-lastName"
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="add-email">Email</label>
                <input
                  id="add-email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="add-password">Password</label>
                <input
                  id="add-password"
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="add-phoneNumber">Phone Number</label>
                <input
                  id="add-phoneNumber"
                  type="text"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Add User</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData(emptyFormData)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <div className="card" style={{ marginBottom: '2rem', background: '#f8fafc' }}>
            <h2 style={{ marginTop: 0 }}>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-firstName">First Name</label>
                <input
                  id="edit-firstName"
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-lastName">Last Name</label>
                <input
                  id="edit-lastName"
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-phoneNumber">Phone Number</label>
                <input
                  id="edit-phoneNumber"
                  type="text"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Update User</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingUser(null)
                    setFormData(emptyFormData)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div>
          <h2>Users ({users.length})</h2>
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.createdAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
};

export default Home;

