import React from 'react'

export default function ProfilePage({ authUser, onBack }) {
  if (!authUser) return null

  return (
    <div className="profile-page">
      <div className="section-heading">
        <h2>My Profile</h2>
        <button className="secondary-button" onClick={onBack}>Back</button>
      </div>

      <div className="detail-card">
        <h3>{authUser.name || authUser.email}</h3>
        <dl>
          <dt>Email</dt>
          <dd>{authUser.email}</dd>
          {authUser.username && (
            <>
              <dt>Username</dt>
              <dd>{authUser.username}</dd>
            </>
          )}
          {authUser.id && (
            <>
              <dt>User ID</dt>
              <dd>{authUser.id}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  )
}
