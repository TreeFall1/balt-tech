import "./globals.scss";
import {Header} from "@/app/components/Header/Header";
import {Montserrat} from "next/font/google";
import Footer from "@/app/components/Footer/Footer";
import {MobileMenu} from "@/app/components/MobileMenu/MobileMenu";


const montserrat  = Montserrat({
  subsets: ['cyrillic', 'latin']
})

export const metadata = {
  title: "Балтех-Сервис",
  description: "Pipes",
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
