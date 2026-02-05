'use client'
import Image from "next/image";
import styles from "./HomePage.module.scss";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import {Mail, Phone} from 'lucide-react';
import {fetchFavoriteProductIds, fetchProducts, submitOrderForm} from "@/app/utils/tools";
import {useEffect, useState} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Mousewheel, FreeMode} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';


export default function Home() {
  const [mockProducts, setMockProducts] = useState([]);
  const [cardWidth, setCardWidth] = useState(240)
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Получаем IDs избранных товаров
        const favoriteIds = await fetchFavoriteProductIds(); // [43, 64, 77, ...]

        if (!favoriteIds || !favoriteIds.length) {
          setMockProducts([]);
          setCardWidth(window.innerWidth > 860 ? 240 : 200);
          return;
        }

        // 2) Для каждого ID запрашиваем товар
        const productPromises = favoriteIds.map((id) =>
            fetchProducts({ id })
        );

        // Параллельно дожидаемся всех запросов
        const productsResults = await Promise.all(productPromises);

        // 3) Фильтруем null/ошибочные ответы и расплющиваем, если API может вернуть массив
        const products = productsResults
            .filter(Boolean); // оставляем только truthy (убираем null)

        setMockProducts(products);

        // 4) Ширина карточек
        setCardWidth(window.innerWidth > 860 ? 240 : 200);
      } catch (error) {
        console.error("Failed to load favorite products:", error);
      }
    };

    load();
  }, []);



  return (
      <>
        <section className={styles.companySection}>
          <div className={styles.blurFilter}>
            <div className={styles.companyContainer}>
              <div className={styles.logo}>
                <Image src={'logo.svg'} alt={'Logo'} width={80} height={80}/>
                <Image src={'logo-text-white.svg'} alt={'Logo'} width={512} height={80}/>
              </div>
              <div className={styles.companyText}>
                <h2>О компании</h2>
                <p>
                  Наша компания — это команда профессионалов, объединённых общими ценностями и стремлением к развитию. Мы предлагаем современные решения и качественные услуги, которые помогают нашим клиентам достигать поставленных целей. <br/>
                  Главные принципы нашей работы — надёжность, открытость и внимание к деталям. Мы ценим доверие наших партнёров и стремимся к долгосрочному сотрудничеству.
                </p>
                <a href={'/about'} className={styles.primaryButton}>Подробнее</a>
              </div>
            </div>
          </div>
        </section>
        <main className={styles.main}>
          <section className={styles.productsSection}>
            <div className={styles.container}>
              <h2>Новая продукция и акции</h2>
              <Swiper
                  spaceBetween={16}
                  slidesPerView="auto"
                  modules={[Scrollbar, FreeMode, Mousewheel]}
                  scrollbar={{ draggable: true }}
                  freeMode={true}
                  mousewheel={true}
                  style={{padding: "16px 0"}}
                  lazy={{
                    loadPrevNext: true,
                    loadPrevNextAmount: 9,
                  }}

              >
                {mockProducts !== [] ? mockProducts.map((el, id) => {
                  return (
                      <SwiperSlide style={{ width: cardWidth, maxHeight: "400px"}} key={id}>
                        <ProductCard {...el} img={el.img} />
                      </SwiperSlide>
                  )
                }) : (
                    <div className={'loader'}></div>
                )}
              </Swiper>
              <div className={styles.catalogButtonWrapper}>
                <a href={'/catalog'} className={styles.primaryButton}>Перейти в каталог</a>
              </div>
            </div>
          </section>
          <section className={styles.advantagesSection}>
            <h2>Наши преимущества</h2>
            <div className={styles.advantageBlock}>
              <Image src={'/warehouse.svg'} alt={'Собственный склад'} width={100} height={100}/>
              <div className="">
                <h3>Собственный склад</h3>
                <p>Благодаря собственным складским помещениям мы поддерживаем постоянное наличие популярных товаров и
                  обеспечиваем быстрые сроки отгрузки.</p>
              </div>
            </div>
            <div className={styles.advantageBlock}>
              <Image src={'/invoice-receipt.svg'} alt={'Собственный склад'} width={100} height={100}/>
              <div className="">
                <h3>Сертифицированная продукция</h3>
                <p>Вся продукция проходит проверку и имеет необходимые сертификаты, что подтверждает её качество и
                  соответствие стандартам.</p>
              </div>
            </div>
            <div className={styles.advantageBlock}>
              <Image src={'/insurance.svg'} alt={'Собственный склад'} width={100} height={100}/>
              <div className="">
                <h3>Гарантия</h3>
                <p>Мы уверены в надежности наших товаров и предоставляем гарантию, чтобы вы чувствовали себя защищённо
                  при покупке.</p>
              </div>
            </div>
            <div className={styles.advantageBlock}>
              <Image src={'/truck.svg'} alt={'Собственный склад'} width={100} height={100}/>
              <div className="">
                <h3>Доставка по всей России</h3>
                <p>Организуем удобную и оперативную доставку в любой регион страны, независимо от расстояния</p>
              </div>
            </div>
          </section>


          <section className={styles.brandsSection}>
            <div className={styles.container}>
              <h2>Наши партнёры</h2>
              <div className={styles.brandsGrid}>
                {["Brand A", "Brand B", "Brand C", "Brand D", "Brand E", "Brand F"].map((brand, idx) => (
                    <div key={idx} className={styles.brandCard}>
                      <Image src={`/sponsors/logo (${idx + 1}).png`} alt={'Спонсор'} width={512} height={512}/>
                    </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.containerGrid}>
              <h2>Есть вопросы? Оставьте заявку</h2>
              <div className=""></div>
              <form
                className={styles.form}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormLoading(true);
                  try {
                    const result = await submitOrderForm(e.target);
                    if (result.ok) {
                      alert("Заявка отправлена! Ожидайте звонка 📞");
                      e.target.reset();
                    } else {
                      alert(result.error || "Ошибка отправки 😢");
                    }
                  } finally {
                    setFormLoading(false);
                  }
                }}
              >
                <input name={'name'} type="text" placeholder="Ваше имя" required/>
                <input name={'email'} type="email" placeholder="Email"/>
                <input name={'phone'} type="tel" placeholder="Телефон" required/>
                <textarea name={'message'} placeholder="Сообщение"></textarea>
                <button className={styles.primaryButton} disabled={formLoading}>
                  {formLoading ? 'Отправка...' : 'Отправить'}
                </button>
              </form>

              <div style={{position: "relative", overflow: "hidden"}} className={styles.mapPlaceholder}>
                <iframe
                    src="https://yandex.ru/map-widget/v1/?from=mapframe&ll=30.487493%2C59.964209&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzQwOTQzNxJK0KDQvtGB0YHQuNGPLCDQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsywg0YPQu9C40YbQsCDQmtC-0LzQvNGD0L3RiywgNjEiCg2u5fNBFXzbb0I%2C&tab=inside&utm_source=share&z=18.59"
                    width="100%"
                    height="300"
                    frameBorder="0"
                    allowFullScreen
                    style={{position: "relative"}}
                />
              </div>
            </div>
            <div className={styles.contacts}>
              <a href={'tel:+78127080108'}><Phone color={'#e46221'}/> +7 (812) 708-01-08</a>
              <a href={'mailto:bts-sbp@mail.ru'}><Mail color={'#e46221'}/> bts-sbp@mail.ru</a>
            </div>
          </section>
        </main>
      </>

  );
}


