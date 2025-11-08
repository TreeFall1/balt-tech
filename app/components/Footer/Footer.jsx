import React from "react";
import { Telescope, Send, PlaySquare } from "lucide-react";
import styles from "./Footer.module.scss";
import Image from "next/image";

export default function Footer() {
  return (
      <footer className={styles.footer}>
        <div className={styles.container}>

          <div className={styles.logo}>
            <Image src={'/logo.svg'} alt={'Балтех'} width={32} height={32} />
            <Image src={'/logo-text-white.svg'} alt={'Балтех'} width={200} height={200} />
          </div>
          <nav className={styles.nav}>
            <a href="/" className={styles.link}>Главная</a>
            <a href="/catalog" className={styles.link}>Каталог</a>
            <a href="/contacts" className={styles.link}>Контакты</a>
            <a href="/about" className={styles.link}>О нас</a>
          </nav>

          <div className={styles.socials}>
            <a href="https://vk.com" target="_blank" rel="noreferrer" className={styles.icon}>
              <Image src={'/vk.svg'} alt={'vk'} width={32} height={32} />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className={styles.icon}>
              <Send size={22} />
            </a>
            <a href="https://rutube.ru" target="_blank" rel="noreferrer" className={styles.icon}>
              <PlaySquare size={22} />
            </a>
          </div>
        </div>
        <div className={styles.copy}>
          © {new Date().getFullYear()} Балтех-Сервис. Все права защищены.
        </div>
      </footer>
  );
}
