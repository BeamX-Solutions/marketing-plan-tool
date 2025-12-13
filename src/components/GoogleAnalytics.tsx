// src/components/GoogleAnalytics.tsx
'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-F9QMSMREGP';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Type declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (command: string, targetId: string | Date, config?: Record<string, any>) => void;
  }
}