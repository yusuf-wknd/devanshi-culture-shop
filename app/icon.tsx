import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#4a2f1b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fffbf0',
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: '50%',
        }}
      >
        D
      </div>
    ),
    {
      ...size,
    }
  )
}