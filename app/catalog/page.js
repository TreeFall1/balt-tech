import styles from './Catalog.module.scss'
import React from "react";
import Image from "next/image";
import {catalogData} from "@/app/catalog/data";

export const metadata = {
  title: "Каталог продукции",
  description:
    "Каталог продукции Балтех-Сервис: трубопроводная арматура, фитинги, хомуты, рукава и комплектующие. Сертифицированные товары с быстрой поставкой.",
  alternates: { canonical: "/catalog" },
};


export default function CatalogPage() {
  return (
      <div className={styles["catalog-page"]}>
        <h1>Каталог продукции</h1>
        <div className={styles["catalog-grid"]}>
          {catalogData.map((category, index) => (
              <a href={`/catalog/${index+1}`} key={index} className={styles["catalog-card"]}>
                <div className={styles['img-container']}>
                  <Image src={`/catalog/new/catalog-category-${index + 1}.webp`} alt={category.title} width={512} height={512} />
                </div>
                <div className={styles['data-container']}>
                  <h2>{category.title}</h2>
                  {category.items.length > 0 && (
                      <ul>
                        {category.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                      </ul>
                  )}
                </div>
              </a>
          ))}
        </div>
      </div>
  );
}
