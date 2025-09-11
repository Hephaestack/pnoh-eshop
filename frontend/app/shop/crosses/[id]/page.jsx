import IndividualProductPage from "../../../../components/shop/IndividualProductPage";

async function fetchProduct(id) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  if (!data) return { title: 'Product - Pnoh' };
  return {
    title: data.name,
    description: data.description,
    openGraph: { title: data.name, description: data.description, images: data.image_url?.length ? [data.image_url[0]] : undefined },
    alternates: { canonical: `/shop/crosses/${data.id}`, languages: { en: `/en/shop/crosses/${data.id}`, el: `/shop/crosses/${data.id}` } },
  };
}

export default async function CrossPage({ params }) {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);
  return <IndividualProductPage params={resolvedParams} category="crosses" initialProduct={product} />;
}
