import { useState } from "react";
import ThemeDropDown from "../components/ThemeDropDown";
import icon_close from '../assets/images/icon-close-modal.svg'

const Budget = ({data}) => {

    const [budgets, setBudgets] = useState(data.budgets)
    const [showAddBudgets, setShowAddBudgets] = useState(false)
    const categories = [...new Set(data.transactions?.map(items => items.category))].sort()
    console.log(categories)

    const handleShowAddBudget = () => {
        setShowAddBudgets(!showAddBudgets)
    }

    return (
        <section className="flex flex-col items-center min-h-screen">
            <div className="flex flex-row justify-between  w-full">
                <h1>Budgets</h1>

                <button className="border border-gray-400 bg-gray-200 cursor-pointer" onClick={handleShowAddBudget}>Add New Budget</button>
            </div>

            <div className={`w-80 p-4 ${showAddBudgets ? "flex flex-col" : "hidden"}`}>
                <div className="flex flex-row items-center justify-between my-4">
                    <h2 className="text-xl font-bold">Add New Budget</h2>
                    <img src={icon_close} alt="icon close" onClick={handleShowAddBudget}/>
                </div>
                <p className="text-gray-500 text-sm">Choose a category to set a spending budget. These categories can help you monitor spending</p>

                <label className="flex flex-col">
                    <span>Budget Category</span>
                    <select className="border border-black w-full py-2 px-4 rounded-md">
                        {categories.map((category, index) => (
                            
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Maximum Spending</span>
                    <input type="text" placeholder="$  e.g. 2000" className="px-4"/>
                </label>

                <ThemeDropDown data={data}/>
                
            </div>
        </section>
    )

}

export default Budget;