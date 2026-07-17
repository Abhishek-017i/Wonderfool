import { useState } from 'react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import Toast from './Toast'

interface SettingsTabProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function SettingsTab({ isDark, setIsDark }: SettingsTabProps) {
  const [email, setEmail] = useState('alex.rivera@example.com')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleSaveSettings = () => {
    showToast('Settings saved successfully')
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters')
      return
    }
    showToast('Password changed successfully')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Account Info */}
      <div style={{ backgroundColor: '#E8E0D0', borderRadius: '8px', padding: '20px', border: '1px solid #D4CCC0' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Account Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', backgroundColor: '#F5F1E8', color: '#1A1A1A', border: '1px solid #D4CCC0', borderRadius: '6px', fontSize: '14px' }}
            />
            <p style={{ fontSize: '12px', color: '#5A5A5A', marginTop: '4px' }}>We&apos;ll only use this for account recovery</p>
          </div>
          <button
            onClick={handleSaveSettings}
            style={{
              padding: '10px 16px',
              backgroundColor: '#C4A76D',
              color: '#1A1A1A',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 200ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Password */}
      <div style={{ backgroundColor: '#E8E0D0', borderRadius: '8px', padding: '20px', border: '1px solid #D4CCC0' }}>
        <button
          onClick={() => setPasswordOpen(!passwordOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'opacity 200ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A' }}>Change Password</h3>
          <ChevronDown
            size={20}
            color="#1A1A1A"
            style={{ transition: 'transform 200ms', transform: passwordOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {passwordOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #D4CCC0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', backgroundColor: '#F5F1E8', color: '#1A1A1A', border: '1px solid #D4CCC0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', backgroundColor: '#F5F1E8', color: '#1A1A1A', border: '1px solid #D4CCC0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ borderRadius: '4px', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>Show password</span>
            </label>
            <button
              onClick={handleChangePassword}
              style={{
                padding: '10px 16px',
                backgroundColor: '#C4A76D',
                color: '#1A1A1A',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'opacity 200ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ backgroundColor: '#E8E0D0', borderRadius: '8px', padding: '20px', border: '1px solid #D4CCC0' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Notifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
            />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', margin: 0 }}>Email Notifications</p>
              <p style={{ fontSize: '12px', color: '#5A5A5A', margin: '2px 0 0 0' }}>Receive updates about your account activity</p>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
            />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', margin: 0 }}>Push Notifications</p>
              <p style={{ fontSize: '12px', color: '#5A5A5A', margin: '2px 0 0 0' }}>Get notified on your device</p>
            </div>
          </label>
        </div>
      </div>

      {/* Theme */}
      <div style={{ backgroundColor: '#E8E0D0', borderRadius: '8px', padding: '20px', border: '1px solid #D4CCC0' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Theme Preference</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsDark(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms',
              backgroundColor: !isDark ? '#C4A76D' : '#F5F1E8',
              color: !isDark ? '#1A1A1A' : '#1A1A1A'
            }}
          >
            <Sun size={18} color="#1A1A1A" />
            Light
          </button>
          <button
            onClick={() => setIsDark(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms',
              backgroundColor: isDark ? '#C4A76D' : '#F5F1E8',
              color: isDark ? '#1A1A1A' : '#1A1A1A'
            }}
          >
            <Moon size={18} color="#1A1A1A" />
            Dark
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div style={{ backgroundColor: '#E8E0D0', borderRadius: '8px', padding: '20px', border: '1px solid #D4CCC0' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Privacy</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={privateProfile}
            onChange={() => setPrivateProfile(!privateProfile)}
            style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', margin: 0 }}>Private Profile</p>
            <p style={{ fontSize: '12px', color: '#5A5A5A', margin: '2px 0 0 0' }}>Only followers can see your reviews and articles</p>
          </div>
        </label>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}
