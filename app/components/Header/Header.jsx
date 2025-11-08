import s from './Header.module.scss'
import Image from 'next/image'
import {Mail, MapPin, Phone} from "lucide-react";


export const Header = ()=>{
  return(
      <header className={s['header']}>
        <div className={s['info']}>
          <div className={s['container']}>
            <div className={'flex items-center'}>
              <nav className={'flex gap-4'}>
                <a href={'/'}>Главная</a>
                <a href={'/about'}>О нас</a>
                <a href={'/contacts'}>Контакты</a>
              </nav>
            </div>
            <div className={'flex gap-4 text-[14px]'}>
              <a href={"tel:+78127080108"}><Phone size={18}/> +7 (812) 708-01-08</a>
              <a href={'mailto:bts-sbp@mail.ru'}><Mail size={18}/> bts-sbp@mail.ru</a>
              <a target={'_blank'} href={'https://yandex.ru/maps/-/CLQuFK05'} className={'mr-8'}><MapPin size={18} /> Санкт-Петербург, &nbsp;ул. Коммуны, &nbsp;д. 61А</a>
            </div>
          </div>
        </div>
        <div className={s['main']}>
          <div className={s['logo-container']}>
            <a href="/">
              <Image src={'/logo.svg'} width={32} height={32} alt='Балтех-Сервис'/>
              <Image style={{marginTop: '4px'}} src={'/logo-text.svg'} alt={'Балтех-Сервис'} height={28} width={220} />
            </a>
            <a href={'/catalog'} className={s['catalog-btn']}><button>Каталог</button></a>
          </div>
          <div className={s['search-container']}>
            <input className={s['search']} type="text" placeholder={'Поиск по товарам'}/>
            <button>Найти</button>
          </div>
          <button className={`border ${s['application-btn']}`}>Заказать звонок</button>
        </div>
      </header>
  )
}