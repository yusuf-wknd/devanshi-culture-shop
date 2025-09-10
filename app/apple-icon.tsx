import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #4a2f1b 0%, #6b4423 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fffbf0',
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(74, 47, 27, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '15px',
            backgroundColor: 'rgba(255, 251, 240, 0.1)',
            border: '2px solid rgba(255, 251, 240, 0.2)',
          }}
        >
          D
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}