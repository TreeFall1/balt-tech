"use client";
import {use, useEffect, useState} from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import {fetchProducts, getProductImages, supabaseStorage} from "@/app/utils/tools";

export default function ProductPage(props) {
  const {productId} = use(props.params);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImage, setCurrentImage] = useState('/image-loader.svg');
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState(null);
  const now = Date.now();


  const imageHandler = (e) => {
    const el = e.target;
    setCurrentImage(el.dataset.image);
  }


  useEffect(() => {
    const load = async () => {
      const product = await fetchProducts({id: productId});
      setDescription(product["product_params"].find(el=>(el.name === "Описание")));
      setProductData(product);
      setCurrentImage(product['main_image'] ? `${supabaseStorage}/products/${productId}/${product['main_image']}?v=${now}` : `${supabaseStorage}/products/${productId}/1.jpg?v=${now}`)
    }

    async function loadImages() {
      const result = await getProductImages(productId);
      setImages(result)
    }
    loadImages();
    load();
  }, []);


  return (
      <>
        {productData ? (
            <div className={styles.productPage}>
              <div className={styles.mainContent}>
                {/* Галерея */}
                <div className={styles.gallery}>
                  <div className={styles.mainImage}>
                    <Image
                        src={currentImage}
                        alt={productData?.title}
                        width={600}
                        height={600}
                        priority
                    />
                  </div>
                  <div className={styles.thumbs}>
                    {images.map((el, id) => {
                      return (
                          <Image key={el} onClick={imageHandler} data-image={`${el}?v=${now}`} src={`${el}?v=${now}`} alt={`thumb${id}`} width={160} height={160} />
                      )
                    })}
                  </div>
                </div>

                {/* Информация о товаре */}
                <div className={styles.info}>
                  <h1 className={styles.title}>
                    {productData?.title}
                  </h1>

                  <div className={styles.meta}>
                    <span className={styles.status}>В наличии</span>
                  </div>

                  <div className={styles.priceSection}>
                    <span className={styles.price}>{productData.price}</span>
                  </div>
                    <button className={styles.orderButton}>Заказать по телефону</button>
                  <div className={styles.specs}>
                    <h2>Характеристики</h2>
                    <table className={styles.specsTable}>
                      <tbody>
                      {productData["product_params"].map((el) => {
                        if(el.name !== "Описание"){
                          return (
                              <tr key={el.name}>
                                <td className={styles.specTitle}>{el.name}</td>
                                <td className={styles.specValue}>{el.value}</td>
                              </tr>
                          )
                        }
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Вкладки: Описание, Оплата */}
              <div className={styles.tabs}>
                <div className={styles.tabHeaders}>
                  <button
                      className={activeTab === "description" ? styles.active : ""}
                      onClick={() => setActiveTab("description")}
                  >
                    Описание
                  </button>
                  <button
                      className={activeTab === "payment" ? styles.active : ""}
                      onClick={() => setActiveTab("payment")}
                  >
                    Оплата
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTab === "description" && (
                      <div>
                        <h3>Описание</h3>
                        <p>
                          {description?.value ?? productData.title}
                        </p>
                      </div>
                  )}
                  {activeTab === "payment" && (
                      <div>
                        <h3>Оплата</h3>
                        <p>Принимаем к оплате:</p>
                        <div className="flex gap-8 mt-4">
                          <Image src={'/visa.svg'} alt={'visa'} width={100} height={100} />
                          <Image src={'/mastercard.svg'} alt={'mastercard'} width={80} height={80} />
                          <Image src={'/mir.svg'} alt={'mir'} width={100} height={100} />
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
        ) : (
            <main>
              <div className={styles['loader-container']}>
                <div className="loader"></div>
              </div>
            </main>
        )}
      </>
  );
}
