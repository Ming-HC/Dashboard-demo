import * as React from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import styles from './Navigation.module.css';

function Navigation() {
  return (
    <div className={styles.navbar}>
      {/* <a href="https://github.com/Ming-HC/Side_Project_Demo" className={styles.logo}>LOGO</a> */}
      <span className={styles.logo}>LOGO</span>
      <div className={styles.setting}>
        <AiOutlineSetting />
      </div>
    </div>
  );
}

export default Navigation;
