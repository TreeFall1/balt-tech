'use client'
import s from './SettingsModal.module.scss'
import ModalTemplate from "@/app/components/Modals/ModalTemplate/ModalTemplate";
import {useState} from "react";
import AddProductForm from "@/app/components/AddProcuct/AddProduct";


export const SettingsModal = (props)=>{

  return(
      <ModalTemplate
          isOpen={props.isOpen}
          onClose={props.closeModal}
          title={props.title}
      >
        <AddProductForm productId={props.productId} isEdit={true} />

      </ModalTemplate>
  )
}