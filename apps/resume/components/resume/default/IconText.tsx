import React from 'react'
import styles from './IconText.module.css'

type Props = {
    icon: React.ComponentType,
    text: string,
}

function IconText({icon : Icon, text}: Props) {
  return (
    <div className = {styles.wrapper}>
        <Icon />
        <span>{text}</span>
    </div>
  )
}

export default IconText