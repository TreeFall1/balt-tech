import { catalogData } from "@/app/catalog/data";

export function generateMetadata({ params }) {
  const categoryId = Number(params?.categoryId);
  const category = catalogData[categoryId - 1];
  const title = category?.title ? `${category.title}` : `Категория #${categoryId}`;
  const description = category?.title
    ? `Купить ${category.title.toLowerCase()} с быстрой доставкой по всей России. Сертифицированная продукция Балтех-Сервис.`
    : "Категория каталога продукции Балтех-Сервис.";

  return {
    title,
    description,
    alternates: { canonical: `/catalog/${categoryId}` },
    openGraph: {
      type: "website",
      title,
      description,
    },
  };
}

export default function CategoryLayout({ children }) {
  return children;
}
