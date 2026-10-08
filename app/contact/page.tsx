import ContactExperience from "./ContactExperience";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product } = await searchParams;
  const productName = Array.isArray(product) ? product[0] : product;
  return <ContactExperience productName={productName?.trim() || undefined} />;
}
