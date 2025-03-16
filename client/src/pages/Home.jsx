import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend} from "recharts"
import potIcon from '../assets/images/icon-pot.svg'

const Home = ({data}) => {

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(!data);
    }, [data]);


    const pieData = data.budgets? data.budgets.map(budget => ({
        name: budget.category,
        value: budget.maximum
    })) : [];

    const pieColors = data.budgets? data.budgets.map(color => color.theme) : [];

    const totalSaved = data.pots? data.pots.reduce((sum, pot) => sum + pot.total, 0) : 0;
    

    return (
        <section className="bg-[#F8f4f0]">
            {isLoading? 
            <div>
                    <p>Loading...</p>
            </div> 
            
            :
            
            <div className="p-4 ">
                    <h1 className="text-3xl font-bold leading-8 mb-6">Overview</h1>

                    <div className="h-28 bg-black text-white rounded-2xl p-4 px-6 mb-3 ">
                        <h2 className="text-sm mb-4">Current Balance</h2>
                        <p className="text-3xl font-bold leading-8 ">${data.balance?.current.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                    </div>

                    <div className="bg-white h-28 rounded-2xl p-4 px-6 mb-3">
                        <h2 className="text-sm mb-4">Income </h2>
                        <p className="text-3xl font-bold leading-8 ">${data.balance?.income.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                    </div>

                    <div className="bg-white h-28 rounded-2xl p-4 px-6 mb-3">
                        <h2 className="text-sm mb-4">Expenses</h2>
                        <p className="text-3xl font-bold leading-8 ">${data.balance?.expenses.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>

                    </div>

                    <article className="bg-white p-4 px-6">
                        <div className="flex flex-row justify-between w-full">
                            <h2 className="text-xl font-bold">Pots</h2>
                            <button className="text-sm text-gray-500">See Details</button>

                        </div>

                        <div className="flex flex-row items-center bg-[#F8f4f0] p-5 rounded-2xl my-4">
                            <img 
                                src={potIcon} 
                                alt="potIcon"
                                className="mr-4"
                            />
                            <div >
                                <h3 className="text-sm text-gray-500 mb-3">Total Saved</h3>
                                <p className="text-3xl font-bold leading-8">${totalSaved.toLocaleString()}</p>

                            </div>

                        </div>

                       
                        
                        <div className="grid grid-cols-2 gap-3">
                           
                            {data.pots?.map((potItem, index) => (
                                <div key={index} className="flex flex-row">
                                    <div style={{ backgroundColor: potItem.theme}} className="h-11 w-1 mr-3"></div>
                                    <div>
                                        <p className="text-xs">{potItem.name}</p>
                                        <p className="text-sm font-bold">${potItem.total}</p>
                                    </div>
                                
                                </div>

                            ))}
                        
                        
                        </div>
                    </article>

                    <article className="bg-white p-4 px-6">
                        <div className="flex flex-row justify-between w-full">
                            <h2 className="text-xl font-bold">Transactions </h2>
                            <button className="text-sm text-gray-500">See Details</button>

                        </div>
                        
                                {data.transactions?.slice(0, 5).map((transactionsItem, index) => (
                                        <div key={index}>
                                            <img src={transactionsItem.avatar} alt="avatar"/>
                                            <p>{transactionsItem.name}</p>
                                            <div>
                                                <p>{transactionsItem.amount.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                                                <p>{new Date(transactionsItem.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                ))}
                                

                    </article>

                    <article className="bg-white">
                        <h2>Budgets </h2>
                        <div className="flex flex-col items-center justify-center border border-black">
                            <PieChart width={400} height={400}>
                                <Pie 
                                    data={pieData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    fill="blue"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={pieColors[index % pieColors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </div>

                        <div>
                            {data.budgets?.map((budget, index) => (
                                <div key={index}>
                                    <div>
                                        
                                    </div>
                                    <div>
                                        <p>{budget.category}</p>
                                        <p>${budget.maximum.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </article>

                    <article>
                    <h2>Recurring Bills</h2>
                    {data.transactions?.filter(tx => tx.recurring).map((tx, index) => (
                        <div key={index}>
                            <div>
                                <p>{tx.category}</p>
                                <p>{tx.amount.toLocaleString(undefined, ({minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                            </div>
                        </div>
                    ))}
                    </article>



            </div>
            }
            
            
               
        </section>
    )
}

export default Home;