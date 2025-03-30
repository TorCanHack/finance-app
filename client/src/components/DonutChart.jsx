import { PieChart, Pie, Cell, Tooltip, Legend} from "recharts"

const DonutChart  = ({data}) => {

    const pieData = data.budgets? data.budgets.map(budget => ({
        name: budget.category,
        value: budget.maximum
    })) : [];

    const pieColors = data.budgets? data.budgets.map(color => color.theme) : [];

    return (
        <section className="flex flex-col items-center justify-center lg:w-60 ">
            
            <PieChart width={400} height={300}>
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
            
        </section>
    )

}

export default DonutChart;