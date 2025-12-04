'use client'
import s from './Header.module.scss'
import Image from 'next/image'
import {Mail, MapPin, Phone} from "lucide-react";
import {useEffect, useState} from "react";


export const Header = ()=>{
  const [iconsSize, setIconsSize] = useState(18);

  useEffect(() => {
    setIconsSize(window.innerWidth > 1024 ? 18 : 16)
  }, []);

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
            <div className={s['links']}>
              <a href={"tel:+78127080108"}><Phone size={iconsSize}/> +7 (812) 708-01-08</a>
              <a href={'mailto:bts-sbp@mail.ru'}><Mail size={iconsSize}/> bts-sbp@mail.ru</a>
              <a target={'_blank'} href={'https://yandex.ru/maps/-/CLQuFK05'} className={'mr-8'}><MapPin
                  size={iconsSize}/> Санкт-Петербург, &nbsp;ул. Коммуны, &nbsp;д. 61А</a>
            </div>
          </div>
        </div>
        <div className={`${s['main']} ${s['mobile']}`}>
            <div className={s['logo-container']}>
              <a href="/">
                <Image className={s['logo']} src={'/logo.svg'} width={32} height={32} alt='Балтех-Сервис'/>
                <Image className={s['logo-text']} style={{marginTop: '4px'}} src={'/logo-text.svg'}
                       alt={'Балтех-Сервис'}
                       height={28} width={220}/>
              </a>
            </div>
          <div className={s['search-container']}>
            <input className={s['search']} type="text" placeholder={'Поиск по товарам'}/>
            <button>Найти</button>
          </div>
        </div>
        <div className={`${s['main']}`}>
          <div className={s['logo-container']}>
            <a href="/">
              <Image className={s['logo']} src={'/logo.svg'} width={32} height={32} alt='Балтех-Сервис'/>
              <Image className={s['logo-text']} style={{marginTop: '4px'}} src={'/logo-text.svg'} alt={'Балтех-Сервис'}
                     height={28} width={220}/>
            </a>
            <a href={'/catalog'} className={s['catalog-btn']}>
              <button>Каталог</button>
            </a>
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