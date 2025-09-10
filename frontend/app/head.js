export default function Head() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  return (
    <>
      <link rel="canonical" href={`${base}/`} />
      <link rel="alternate" href={`${base}/`} hrefLang="el" />
      <link rel="alternate" href={`${base}/en`} hrefLang="en" />
      <meta name="theme-color" content="#18181b" />
      <meta name="author" content="Pnoh" />
    </>
  );
}
