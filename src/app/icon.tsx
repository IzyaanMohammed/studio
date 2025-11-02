import { ImageResponse } from 'next/og';
import { Favicon } from '@/components/logo';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Favicon />
      </div>
    ),
    {
      ...size,
    }
  );
}
