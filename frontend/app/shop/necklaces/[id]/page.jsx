import IndividualProductPage from "../../../../components/shop/IndividualProductPage";

async function fetchProduct(id) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await fetchProduct(resolvedParams.id);
  if (!data) {
    return {
      title: 'Product - Pnoh',
      description: 'Handmade jewelry product',
    };
  }

  return {
    title: data.name,
    description: data.description || 'Handmade jewelry',
    openGraph: {
      title: data.name,
      description: data.description,
      images: data.image_url && data.image_url.length ? [data.image_url[0]] : undefined,
    },
    alternates: {
      canonical: `/shop/necklaces/${data.id}`,
      languages: {
        en: `/en/shop/necklaces/${data.id}`,
        el: `/shop/necklaces/${data.id}`,
      },
    },
  };
}

export default async function NecklacePage({ params }) {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);
  return <IndividualProductPage params={resolvedParams} category="necklaces" initialProduct={product} />;
}
