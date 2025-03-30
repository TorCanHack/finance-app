import { useState } from "react";
import ThemeDropDown from "../components/ThemeDropDown";
import icon_close from '../assets/images/icon-close-modal.svg'
import DonutChart from "../components/DonutChart";

const Budget = ({data}) => {

    const [budgets, setBudgets] = useState(data.budgets)
    const [showAddBudgets, setShowAddBudgets] = useState(false)
    const categories = [...new Set(data.transactions?.map(items => items.category))].sort()
    console.log(categories)

    const handleShowAddBudget = () => {
        setShowAddBudgets(!showAddBudgets)
    }

    const calculateLatestMonthCategorySpending = (transactions, category) => {

        //find the most recent dates in the transactions
        const dates = transactions.map(transaction => new Date(transaction.date))
        const latestDate = new Date(Math.max(...dates));

        //extract year and month from the latest date
        const latestYear = latestDate.getFullYear();
        const latestmonth = latestDate.getMonth();

        //filter transaction by category and latest month/year
        const filteredLatestTransaction = transactions.filter( transaction => {
            const transactionDate = new Date(transaction.date);
            return transaction.category === category && 
                transactionDate.getFullYear() === latestYear &&
                transactionDate.getMonth() === latestmonth &&
                transaction.amount < 0;

        })

        //sum the amounts (converting to positive values for spending)
        const totalSpent = filteredLatestTransaction.reduce((sum, transaction) => 
            sum + Math.abs(transaction.amount), 0)

        return [
            category, totalSpent
        ]

        
    }

    return (
        <section className="flex flex-col items-center min-h-screen p-4 bg-[#F8f4f0]">
            <div className="flex flex-row justify-between  w-full">
                <h1 className="font-bold text-[32px]">Budgets</h1>

                <button 
                    className=" text-sm text-white border border-gray-400 bg-gray-900 cursor-pointer rounded-xl py-2 px-4" 
                    onClick={handleShowAddBudget}
                > 
                    + Add New Budget
                </button>
            </div>

            <article className="flex flex-col items-center w-full bg-white py-4">
                <DonutChart data={data}/>
                <div className="flex flex-col   w-full ">
                    <h2 className="text-xl font-bold">Spending summary</h2>
                    {data.budgets?.map((budget, index) => (
                        <div key={index} className="flex flex-row items-center  border  w-full">
                            <div style={{ backgroundColor: budget.theme}} className="h-11 w-1 mr-3"></div>
                                <div className="flex flex-row">
                                    <p>{budget.category}</p>
                                    <p>${budget.maximum.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                                </div>

                            </div>
                    ))}
                </div>
            </article>

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