import React, { useState } from 'react'
import BiSearch from './SearchIcon';
import styles from '@/styles/Navbar.module.css'

const Navbar = ({setLocation, setTempType, tempType}: any) => {
    const [input, setInput] = useState("");
    
    const tempButtonToggle = () => {
      if (tempType === "c") {
        localStorage.setItem("tempType", "f");
        setTempType("f");
      } else {
        localStorage.setItem("tempType", "c");
        setTempType("c");
      }
    };
  
  return (
    <div className={styles.navbar}>
        <h2>Forcast</h2>
        <div className={styles.searchDiv}>
          <input
            placeholder="Search city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLocation(input);
                setInput("");
              }
            }}
          />
          <BiSearch
            className={styles.searchIcon}
            onClick={() => {
              setLocation(input);
              setInput("");
            }}
          />
        </div>
        <button onClick={() => tempButtonToggle()}>{tempType} °</button>
      </div>
  )
}

export default Navbar