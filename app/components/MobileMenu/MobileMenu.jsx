import s from './MobileMenu.module.scss'
import {Headset, House, Logs} from "lucide-react";


export const MobileMenu = ()=>{
  return (
      <nav className={s.menu}>
        <a href={'/'}>
          <House size={20} color={"var(--orange)"}/> Главная
        </a>
        <a href={'/catalog'}>
          <Logs size={20} color={"var(--orange)"} /> Каталог
        </a>
        <a href={'/about'}>
          <Headset size={20} color={"var(--orange)"}/> Заявка
        </a>
      </nav>
  )
}