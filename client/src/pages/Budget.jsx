import { useEffect, useState } from "react";
import ThemeDropDown from "../components/ThemeDropDown";
import icon_close from '../assets/images/icon-close-modal.svg'
import DonutChart from "../components/DonutChart";
import { addNewRecords } from "../api/Api";

const Budget = ({data}) => {

    const transactions = data.transactions || []
    const [budgets, setBudgets] = useState([])

    useEffect(() => {
        if (data.budgets){
            setBudgets([...data.budgets])
        }
    }, [data])
    const [showAddBudgets, setShowAddBudgets] = useState(false)
    const [showTheme, setShowTheme] = useState(false)
    const categories = [...new Set(data.transactions?.map(items => items.category))].sort()
    const budgetCategories = budgets.map(tx => tx.category)
    const [maximumSpending, setMaximumSpending] = useState("")
    const [budgetCategory, setBudgetCategory] = useState("")
    const [budgetTheme, setBudgetTheme] = useState("")
    const [error, setError]  = useState("")

    

    console.log(budgetCategories)

    const handleShowAddBudget = () => {
        setShowAddBudgets(!showAddBudgets)
    }

    const totalbudgetSpend = transactions.filter(tx => budgets.some(budget => budget.category === tx.category)).reduce((sum, tx) => sum + tx.amount, 0)
    
    const budgetLimit = budgets.reduce((sum, budget) => sum + budget.maximum, 0)
    console.log("sum of ",budgetLimit)

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

        return {
            category, totalSpent
        }

        
    }

    //example usage
    const displayLatestMonthSpending = (transactions, categories) => {

        //if no specific category is provided, get all the unique categories from the data
        if (!categories || categories.length === 0){
            categories = [...new Set(transactions.map(t => t.category))];
        } 

        //calculate spending for each category
        const results = categories.map(category => 
            calculateLatestMonthCategorySpending(transactions, category)
        );

        //display the results
        results.forEach(result => {
            console.log(`${result.category}: $${result.totalSpent.toFixed(2)}`)
        })

        return results
    }

    const budgetsSpending = displayLatestMonthSpending(transactions, budgetCategories); 

    const addBudget = async (newBudget) => {

        try {
            const response = await addNewRecords({
                type: 'Budget',
                category: newBudget.category,
                maximum: newBudget.maximum,
                theme: newBudget.theme

            })

            setBudgets( prev => [...prev, response])
            setCategory('');
            setMaximumSpending('$');
            setTheme('');
            setShowAddBudgets(false);

        } catch (error) {
            console.error('Failed to catch error', error)
        }

    }

    const handleSubmit = () => {

        const maximum = parseFloat(maximumSpending.replace("$", ""));

        if (!budgetCategory || !maximum || !budgetTheme){
            setError("Please fill all fields")
            return
        }
        const newBudget = {

            budgetCategory,
            maximum,
            budgetTheme

        }

        addBudget(newBudget);
    }

    return (
        <section className=" min-h-screen p-4 bg-[#F8f4f0] overflow-hidden">
            <div className={`${showAddBudgets ? "bg-black absolute top-0 right-[0.5px] z-20 w-full h-[900px] opacity-70" : ""}`}></div>
            <div className="flex flex-row justify-between  w-full">
                <h1 className="font-bold text-[32px]">Budgets</h1>

                <button 
                    className=" text-sm text-white border border-gray-400 bg-gray-900 cursor-pointer rounded-xl py-2 px-4 mb-6" 
                    onClick={handleShowAddBudget}
                > 
                    + Add New Budget
                </button>
            </div>

            <article className="flex flex-col items-center w-full bg-white py-4 mb-8 rounded-2xl px-2">
                <DonutChart data={data}/>
                <div className="flex flex-col items-center  relative bottom-44">
                    <p className="text-[32px] font-bold">${Math.abs(totalbudgetSpend).toFixed(0)}</p>
                    <p className="text-xs">of ${budgetLimit} limit</p>
                    
                </div>
                <div className="flex flex-col   w-full -mt-16">
                    <h2 className="text-xl font-bold mb-4 px-2">Spending summary</h2>
                    {budgets.map( budget => {
                        //find matching spending data
                        const spending = budgetsSpending.find(result => result.category === budget.category);
                        return {
                            ...budget,
                            totalSpent: spending? spending.totalSpent : 0
                        };
                    })
                    .sort((a,b) => b.totalSpent - a.totalSpent) //sort by total spent decending
                    .map((budget, index) => (
                        <div key={index} className="flex flex-row items-center w-full p-3 border-b border-gray-300">
                            <div style={{ backgroundColor: budget.theme}} className="h-5 rounded-full w-1 mr-3"></div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <p className="w-36 ">{budget.category}</p>
                                <div className="flex flex-row items-center text-right">
                                    <p className="font-bold">${budget.totalSpent}</p>
                                    <p className="text-xs ml-2">of ${budget.maximum.toLocaleString(undefined, {
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2
                                    })}</p>
                                </div>
                            </div>
                        </div>

                    ))}
                   
                </div>
            </article>

            <article className="bg-white p-4">
                {transactions.map(tx => {
                    const matchingBudget = budgets.find(budget => budget.category === tx.category)
                    return {
                        ...tx,
                        budgetcategory: matchingBudget? matchingBudget.category: null,
                        maximum: matchingBudget ? matchingBudget.maximum : null,
                        theme: matchingBudget ? matchingBudget.theme : null
                    }
                })
                .filter((tx, index, self) => 
                    tx.budgetcategory &&
                    index === self.findIndex(t => t.budgetcategory === tx.budgetcategory)
                )
                .map(tx => {
                    const totalSpent = transactions
                        .filter( t => t.category === tx.budgetcategory)
                        .reduce((sum, t) => sum + t.amount, 0)

                    const spendingPercentage = tx.maximum ? Math.min((Math.abs(totalSpent)/tx.maximum) * 100, 100) : 0;
                    const freeCash = tx.maximum - Math.abs(totalSpent) 
                    const freeAmount = freeCash > 0 ? freeCash : 0
                    

                    return {
                        ...tx,
                        totalSpent: totalSpent ? totalSpent : null,
                        spendingPercentage: spendingPercentage ? spendingPercentage : null,
                        freeAmount: freeAmount
                    }

                })
                .map((tx, index) => (

                    
                    <div key={index} className="mb-4">
                        <div className="flex flex-row">
                            <div style={{backgroundColor: tx.theme}} className="w-4 h-4 rounded-full mr-4"></div>
                            <h2 className="text-xl font-bold">{tx.budgetcategory}</h2>
                        </div>
                        <p>Maximum of ${tx.maximum} </p>
                        <div className="my-4 bg-[#F8f4f0] p-1.5 rounded-md">
                            <div style={{ backgroundColor: tx.theme, width: `${tx.spendingPercentage}%`}} className="h-4">
                                
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row" >

                                <div className="border-l-4  w-36 rounded-xs px-4" style={{borderColor: tx.theme}}>
                                    <h3>Spent</h3>
                                    <p>${Math.abs(tx.totalSpent).toFixed(0)}</p>
                                </div>

                            
                                <div className="border-l-4 w-36 rounded-xs border-[#F8f4f0] px-2">
                                    <h3>Free</h3>
                                    <p>${tx.freeAmount.toFixed(0)}</p>
                                </div>
                            </div>
                            
                        </div>

                        <div className="bg-[#F8f4f0]">
                            <div className="flex flex-row justify-between">
                                <h3>Latest Spending</h3>

                                <button>See all</button>
                            </div>
                            <div className="space-y-3">
                                {transactions
                                .filter(t => t.category === tx.budgetcategory)
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0, 3) // Get the 3 most recent transactions for this category
                                .map((transaction, idx) => (
                                    <div key={idx} className="flex justify-between border-b pb-2">
                                        <p className="font-medium">{transaction.name}</p>
                                        <div className="text-right">
                                            <p className="font-medium">${Math.abs(transaction.amount).toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                            })}</p> 
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                    
                ))}
            </article>

            <div className={`w-80 p-4 ${showAddBudgets ? " absolute bottom-56 xs:bottom-68 xs:right-7 right-5 flex flex-col rounded-2xl bg-white w-1/2 h-[470px] z-20 border border-black" : "hidden"}`}>
                <div className="flex flex-row items-center justify-between my-4">
                    <h2 className="text-xl font-bold">Add New Budget</h2>
                    <img src={icon_close} alt="icon close" onClick={handleShowAddBudget}/>
                </div>
                <p className="text-gray-500 text-sm mb-4">Choose a category to set a spending budget. These categories can help you monitor spending</p>

                <label className="flex flex-col mb-4">
                    <span>Budget Category</span>
                    <select className="border border-black w-full py-2 px-4 rounded-md bg-white" onChange={(e) => setBudgetCategory(e.target.value)} value={budgetCategory}>
                        {categories.map((category, index) => (
                            
                            <option 
                                key={index} 
                                value={category}
                                
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Maximum Spending</span>
                    <input 
                        type="text" 
                        placeholder="$  e.g. 2000" 
                        className="px-4 border border-black w-full py-2 rounded-md mb-4" 
                        value={maximumSpending} 
                        onChange={(e) =>  {
                        const rawtext = e.target.value.replace(/[^\d.]/g, "")
                        setMaximumSpending("$" + rawtext)}}
                        
                    />
                </label>

                <ThemeDropDown 
                    data={data} showTheme={showTheme} setShowTheme={setShowTheme} setBudgetTheme={setBudgetTheme}/>
                {!showTheme && <button className="bg-gray-900 text-white w-full mt-4 p-3 rounded-xl">Add Budget</button>}
                
            </div>
        </section>
    )

}

export default Budget;