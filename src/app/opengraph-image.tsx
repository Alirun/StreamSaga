import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

// Image metadata - standard OG size
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';
export const alt = `${siteConfig.name} - ${siteConfig.tagline}`;

// OpenGraph image generation
export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Decorative gradient orb */}
                <div
                    style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                        top: '-100px',
                        right: '-100px',
                    }}
                />

                {/* Logo container */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '32px',
                    }}
                >
                    {/* Icon background */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '120px',
                            height: '120px',
                            borderRadius: '24px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '2px solid rgba(168, 85, 247, 0.3)',
                        }}
                    >
                        {/* Zap icon SVG */}
                        <svg
                            width="72"
                            height="72"
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
                </div>

                {/* Site name */}
                <h1
                    style={{
                        fontSize: '72px',
                        fontWeight: 700,
                        color: '#fafafa',
                        margin: '0 0 16px 0',
                        letterSpacing: '-2px',
                    }}
                >
                    {siteConfig.name}
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: '28px',
                        color: 'rgba(250, 250, 250, 0.7)',
                        margin: 0,
                        maxWidth: '800px',
                        textAlign: 'center',
                    }}
                >
                    {siteConfig.tagline}
                </p>
            </div>
        ),
        {
            ...size,
        }
    );
}
