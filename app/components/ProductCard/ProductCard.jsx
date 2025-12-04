'use client'
import styles from './ProductCard.module.scss'
import Image from "next/image";
import {fetchProducts, supabaseStorage} from "@/app/utils/tools";
import {useEffect, useState} from "react";
import {SettingsModal} from "@/app/components/Modals/SettingsModal/SettingsModal";

export default function ProductCard(props) {
  const [mainImage, setMainImage] = useState(null);

  const tagList = {
    "hit": {class: "tagHit", text: "Хит"},
    "sale": {class: "tagSale", text: "Акция"},
    "new": {class: "tagNew", text: "Новинка"},
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const modalHandler = ()=>{
    if(isSettingsOpen){
      document.body.style.overflow = "visible";

    }
    setIsSettingsOpen(!isSettingsOpen);
  }

  const tag = tagList[props.tag];

  useEffect(() => {
    setMainImage(props["main_image"] ? `${props["main_image"]}?v=${now}` : `1.jpg?v=${now}`);
  }, []);

  const now = Date.now();

  return (
      <div className={`${styles.cardContainer} ${props.isMobile ? styles.mobile : ""}`}>
        {props.isAdmin && (
            <div className={styles.data} onClick={modalHandler} id={props.id}>
              <Image src={'/settings.svg'} alt={'Settings'} width={32} height={32}/>
            </div>
        )}
        <a href={`/products/${props.id}`}>
          <div className={styles.imageWrapper}>
            <Image
                src={mainImage ? `${supabaseStorage}/products/${props.id}/${mainImage}?v=${now}` : '/image-loader.svg'}
                  alt={props.title}
                  className={styles.image}
                  width={256}
                  height={256}
              />
              {tag && (
                  <span className={`${styles.tag} ${styles[tag.class]}`}>{tag.text}</span>
              )}
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{props.title}</h3>
              <p className={styles.price}>{props.price}</p>
              <div className={styles.params}>
                {Array.from(props["product_params"]).slice(0, 3).map((el, id) => {
                  if (el.name !== 'Описание') {
                    return (
                        <p key={id}><span>{el.name}:</span> {el.value}</p>
                    )
                  }
                })}
              </div>
            </div>
          </a>
        {isSettingsOpen && <SettingsModal productId={props.id} title={props.title} isOpen={isSettingsOpen} closeModal={modalHandler}/>}
      </div>
  );
}