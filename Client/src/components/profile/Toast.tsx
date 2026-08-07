interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      backgroundColor: '#C4A76D',
      color: '#1A1A1A',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'fadeIn 300ms ease-out',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 9999
    }}>
      {message}
    </div>
  )
}
