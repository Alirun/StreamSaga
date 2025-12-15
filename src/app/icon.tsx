import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Icon generation based on logo component (Zap icon with primary styling)
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    background: 'rgba(168, 85, 247, 0.1)', // primary/10
                }}
            >
                {/* Zap icon SVG path from Lucide */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="rgba(168, 85, 247, 0.2)"
                    stroke="rgb(168, 85, 247)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
