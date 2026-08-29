import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export function SEO({ title, description, path = '' }: SEOProps) {
  const { language } = useLanguage();
  const siteName = language === 'en' ? 'Emad Alhalaqi' : 'عماد الحلقي';
  const defaultTitle = `${siteName} - Software Engineer | مطور برمجيات`;
  const defaultDescription = language === 'en' 
    ? 'Emad Alhalaqi - Software Engineer, Odoo Developer, Python Developer, and ERP Specialist.'
    : 'عماد الحلقي - مهندس برمجيات، مطور أودو، مطور بايثون، وأخصائي تخطيط موارد المؤسسات.';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  
  // Dummy URL, can use actual APP_URL from env if needed
  const url = `https://emadalhalaqi.com${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Emad Alhalaqi",
          "alternateName": "عماد الحلقي",
          "jobTitle": "Software Engineer",
          "url": "https://emadalhalaqi.com",
          "sameAs": [
            "https://github.com/",
            "https://linkedin.com/"
          ]
        })}
      </script>
    </Helmet>
  );
}
