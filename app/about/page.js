import styles from "./AboutPage.module.scss";
import Image from "next/image";

export const metadata = {
  title: "О компании",
  description:
    "Информация о компании Балтех-Сервис: история, склад, сертификаты и партнёры. Надёжный поставщик промышленной арматуры и комплектующих.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>О компании</h1>
          <p>
            Мы более 10 лет на рынке поставок сертифицированной продукции. Наш склад и команда
            специалистов обеспечивают быструю доставку по всей России. Мы сотрудничаем только
            с проверенными партнёрами и гарантируем качество товаров.
          </p>
        </section>

        <section className={styles.section}>
          <h2>История компании</h2>
          <p>
            Наша компания начала свою деятельность в 2010 году. За это время мы выросли из
            небольшого офиса до крупного поставщика с собственным складом, современным оборудованием
            и отлаженной системой логистики.
          </p>
        </section>

        <section className={`${styles.section} ${styles.alt}`}>
          <h2>Наш склад</h2>
          <p>
            Мы располагаем современным складом площадью более 5000 м². Все товары находятся в наличии,
            что позволяет нам обеспечивать быстрые отгрузки и надёжную поставку по всей России.
          </p>
          <div className={styles.imagePlaceholder}>
            <Image src={'/warehouse.jpg'} alt={'Наш склад'} width={2048} height={2048} />
            <Image src={'/warehouse2.webp'} alt={'Наш склад'} width={2048} height={2048} />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Сертификаты и партнёры</h2>
          <p>
            Вся продукция сертифицирована в соответствии с российскими стандартами. Мы сотрудничаем
            с ведущими мировыми и отечественными брендами, что подтверждает наш статус надёжного
            поставщика.
          </p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <Image src={'/certificate1.webp'} alt={'Сертификат качества продукции'} width={512} height={512}/>
            </div>
            <div className={styles.card}>
              <Image src={'/certificate2.webp'} alt={'Сертификат качества продукции'} width={512} height={512}/>
            </div>
            <div className={styles.card}>
              <Image src={'/certificate1.webp'} alt={'Сертификат качества продукции'} width={512} height={512}/>
            </div>
            <div className={styles.card}>
              <Image src={'/certificate2.webp'} alt={'Сертификат качества продукции'} width={512} height={512}/>
            </div>
          </div>
        </section>

        <section className={`${styles.section}`}>
          <h2>Фото</h2>
          <div className={styles.gallery}>
            <div className={styles.galleryItem}>
              <Image src={'/photo1.jpg'} alt={'Фото 1'} width={512} height={512}/>
            </div>
            <div className={styles.galleryItem}>
              <Image src={'/photo2.jpg'} alt={'Фото 1'} width={512} height={512}/>
            </div>
            <div className={styles.galleryItem}>
              <Image src={'/photo3.webp'} alt={'Фото 1'} width={512} height={512}/>
            </div>
            <div className={styles.galleryItem}>
              <Image src={'/photo4.jpg'} alt={'Фото 1'} width={512} height={512}/>
            </div>
          </div>
        </section>
      </main>
  );
}
