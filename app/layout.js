import "./globals.scss";
import {Header} from "@/app/components/Header/Header";
import {Montserrat} from "next/font/google";
import Footer from "@/app/components/Footer/Footer";
import {MobileMenu} from "@/app/components/MobileMenu/MobileMenu";


const montserrat  = Montserrat({
  subsets: ['cyrillic', 'latin']
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balttech-service.ru";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Балтех-Сервис",
  title: {
    default: "Балтех-Сервис — промышленная трубопроводная арматура и комплектующие",
    template: "%s — Балтех-Сервис",
  },
  description:
    "Поставки промышленной трубопроводной арматуры, фитингов, хомутов, рукавов и комплектующих. Быстрая доставка по всей России. Сертифицированная продукция.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Балтех-Сервис",
    siteName: "Балтех-Сервис",
    description:
      "Промышленная трубопроводная арматура и комплектующие с быстрой поставкой по России.",
    locale: "ru_RU",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Балтех-Сервис",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Балтех-Сервис",
    description:
      "Промышленная трубопроводная арматура и комплектующие с быстрой поставкой по России.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  themeColor: "#0d0f14",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body className={`antialiased`}>
      <Header />
        {children}
      <MobileMenu />
      <Footer />
      </body>
    </html>
  );
}
