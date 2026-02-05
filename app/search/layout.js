export const metadata = {
  title: "Поиск по товарам",
  description: "Поиск по каталогу товаров Балтех-Сервис.",
  alternates: { canonical: "/search" },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }) {
  return children;
}
