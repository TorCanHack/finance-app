import { NavLink } from "react-router-dom";
import nav_overview from '../assets/images/icon-nav-overview.svg'
import nav_overview_active from '../assets/images/icon-nav-overview-active.svg'
import nav_transaction from '../assets/images/icon-nav-transactions.svg'
import nav_transaction_active from '../assets/images/icon-nav-transactions-active.svg'
import nav_budget from '../assets/images/icon-nav-budgets.svg'
import nav_pots from '../assets/images/icon-nav-pots.svg'
import nav_recurring from '../assets/images/icon-nav-recurring-bills.svg'
import logo_large from '../assets/images/logo-large.svg'


const Navigation = () => {
    return (
        <nav className="flex flex-row justify-between items-center pt-3 px-6 h-14 bg-gray-900 md:h-[74px] lg:w-[300px] lg:min-h-screen lg:h-[1069px]  lg:flex-col lg:rounded-r-xl ">
            <img 
                src={logo_large} 
                alt="logo" 
                className="hidden lg:flex lg:mt-7" 
            />

            <NavLink 
                to="/" 
                className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl": ""}
            >
                {({isActive}) => (
                    <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                        <img 
                        src={isActive ? nav_overview_active :nav_overview} 
                        alt="navigation to overview icon"
                        className="md:mb-2 lg:mr-4 lg:mb-0" 
                        />
                        {isActive && <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Overview</p>}
                    </div>
                
                )}
                
            </NavLink>

            <NavLink to="/transactions"  className={({ isActive }) => isActive? "flex flex-col justify-center items-center h-11 w-16 rounded-t-xl bg-[#F8F4F0] border-b-5 border-[#277C78] md:w-[104px] md:h-16  lg:w-[276px] lg:border-b-0 lg:border-l-5 lg:rounded-t-none lg:rounded-r-xl": ""}>
                {({isActive}) => (
                    <div className="md:flex md:flex-col md:items-center lg:flex-row  lg:w-full lg:pl-4">
                        <img 
                        src={isActive ? nav_transaction_active :nav_transaction} 
                        alt="navigation to overview icon"
                        className="md:mb-2 lg:mr-4 lg:mb-0" 
                        />
                        {isActive && <p className="hidden md:flex md:text-xs md:font-bold md:text-center lg:text-base ">Transactions</p>}
                    </div>
                
                )}
            </NavLink>

            <NavLink><img src={nav_budget} alt="navigation to budget icon" /></NavLink>
            <NavLink><img src={nav_pots} alt="navigation to pots icon" /></NavLink>
            <NavLink><img src={nav_recurring} alt="navigation to recurring bills icon" /></NavLink>
        </nav>
    )
}

export default Navigation;