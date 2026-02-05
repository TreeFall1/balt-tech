import styles from './contacts.module.scss'
import {Mail, Phone} from "lucide-react";

export const metadata = {
  title: "Контакты",
  description:
    "Контакты компании Балтех-Сервис: адрес офиса в Санкт-Петербурге, режим работы, телефоны и e-mail. Как добраться и карта на Яндекс.Картах.",
  alternates: { canonical: "/contacts" },
};


export default function ContactsPage(){
  return(
      <main className={styles['main']}>
        <h1>Контакты</h1>
        <h2>Наш офис располагается по адресу:</h2>
        <p>г. Санкт-Петербург, Коммуны 61А, помещение 7Н, ком. 4</p>
        <h2>Режим работы:</h2>
        <p>пн. - пт. c 8.00 до 17.30</p>
        <h2>Контакты:</h2>
        <a href={'tel:+78127080108'}><Phone/> +7 (812) 708-01-08</a>
        <a href={'mailto:bts-sbp@mail.ru'}><Mail/> bts-sbp@mail.ru</a>
        <a href={'mailto:bts-sbp@mail.ru'}><Mail/> bts-sbpik@mail.ru</a>
        <h2>Мы на картах:</h2>
        <div style={{position: "relative", overflow: "hidden"}} className={styles.mapPlaceholder}>
          <iframe
              src="https://yandex.ru/map-widget/v1/?from=mapframe&ll=30.487493%2C59.964209&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzQwOTQzNxJK0KDQvtGB0YHQuNGPLCDQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsywg0YPQu9C40YbQsCDQmtC-0LzQvNGD0L3RiywgNjEiCg2u5fNBFXzbb0I%2C&tab=inside&utm_source=share&z=18.59"
              width="80%"
              height="400"
              frameBorder="0"
              allowFullScreen
              style={{position: "relative"}}
          />
        </div>
      </main>
  )
}

