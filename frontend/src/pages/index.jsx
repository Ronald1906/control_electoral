import React from 'react'
import styles from '@/styles/Home.module.css'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'

const Index = () => {
  return (
    <div className={styles.loginpage}>
      <form className={styles.frmlogin} >
        <h1>Control Electoral</h1>
        <InputText placeholder='Usuario' type='text' className={styles.inputText} />
        <InputText placeholder='Contraseña' type='password' className={styles.inputPass} />
        <Button label='Iniciar Sesión' className={styles.buttonlog} />
      </form>
    </div>
  )
}

export default Index
