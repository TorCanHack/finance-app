import { useState } from 'react'
import icon_down from '../assets/images/icon-caret-down.svg'

const ThemeDropDown = ({data}) => {

    const [showTheme, setShowTheme] = useState(false)

    const theme = {
        Green: '#277C78',
        Cyan: '#82C9D7',
        Peach: '#F2CDAC',
        Purple: '#626070',
        Voilet: '#826CB0',
        Orange: '#FFA500',
        Blue: '#0000FF',
        Pink: '#FFC0CB',
        Indigo: '#4B0082'
    }

    const [currentTheme, setCurrentTheme] = useState({name: "Green", hex: "#277C78"})

    const handleShowTheme = () => {
        setShowTheme(!showTheme)
    }

   

    return (
        <section>
            <div>
               <div className='flex flex-col'>
                    <label>Color tag</label>
                    <button onClick={handleShowTheme} className='cursor-pointer flex flex-row justify-between items-center py-2 px-4 rounded-lg border border-black'>
                        <div className='flex flex-row items-center'>
                            <div style={{ backgroundColor: currentTheme.hex}} className='h-4 w-4 rounded-full mr-3'></div>
                            <span>{currentTheme.name}</span>
                        </div>
                        <img src={icon_down} alt="" />

                    </button>
               </div>
                <ul className={` ${showTheme ? "flex  flex-col px-4" : "hidden"}`} >
                    {Object.entries(theme).map(([colorName, hexCode]) => (
                        <li key={colorName} className='flex flex-row items-center border-b border-gray-300 py-2 text-sm' onClick={() => {
                            setCurrentTheme({name: colorName, hex: hexCode});
                            setShowTheme(false)
                            }}
                        >
                           
                            <div style={{ backgroundColor: hexCode}} className='h-4 w-4 rounded-full mr-4' ></div>
                            <span>{colorName}</span>
                        
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default ThemeDropDown;