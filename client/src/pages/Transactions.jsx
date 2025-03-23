import icon_search from '../assets/images/icon-search.svg'
import icon_filter from '../assets/images/icon-filter-mobile.svg'
import icon_sort from '../assets/images/icon-sort-mobile.svg'
import { useEffect, useState } from 'react'

const Transactions = ({data}) => {

    const [transactions, setTransactions] = useState(data.transactions);
    const [filteredTransaction, setFiliteredTransaction] = useState(data.transactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    //pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedtransaction, setPaginatedTransaction] = useState([])

    // get unique categories from the transaction data

    const categories = [ ...new Set(transactions.map(t => t.category))].sort();

    //format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-Us', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleCategoryFilter = (category) => {
        setActiveCategory(category === activeCategory ? "" : category)
        setShowFilterMenu(false)
        setCurrentPage(1);
    }

    const handleSort = (option) => {
        setSortOption(option)
        setShowSortMenu(false);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    //apply sortng and filtering when ever the states change
    useEffect(() => {
        let result = [...data.transactions]

        //apply search filter
        if(searchTerm) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                t.categories.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
            )
        }

        if (activeCategory) {
            result = result.filter(t => t.category === activeCategory);
        }

        switch(sortOption){
            case 'Latest':
                result.sort((a,b) => new Date(b.date) - new Date(a.date));
                break;
            case 'Oldest':
                result.sort((a,b) => new Date(a.date) - new Date(b.date));
                break;
            case 'A to Z' :
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Z to A':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break
            case 'Highest':
                result.sort((a, b) => b.amount - a.amount);
                break;
            case 'Lowest':
                result.sort((a, b) => a.amount - b.amount);
                break;
            default:
                break
        }

        setFiliteredTransaction(result)

    }, [searchTerm, activeCategory, sortOption])

    useEffect(() => {
        const indexOfLastTransaction = currentPage * 10;
        const indexOfFirstTransaction = indexOfLastTransaction - 10;
        const currentTransactions = filteredTransaction.slice(indexOfFirstTransaction, indexOfLastTransaction)
        setPaginatedTransaction(currentTransactions)
    }, [filteredTransaction, currentPage,])

    const totalPages = Math.ceil(filteredTransaction.length/10)

    //generate page number array for pagination
    const pageNumbers = []
    for (let i = 0; i <= totalPages.length; i++){
        pageNumbers.push(i)
    }

    //creates a smart pagination range
    const getPaginationRange = () => {
        const range = [];
        const maxPagesToShow = 4;

        if (totalPages <= maxPagesToShow) {
            //if total pages is less tham max to show, just return all pages
            for (let i = 0; i <= totalPages; i++) {
                range.push(i)
            }
        } else {
            range.push(1)

            //calculate the start and end of range
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages-1, currentPage + 1)

            //adjust if at the edges
            if (currentPage <= 2) {
                end = Math.min(4, totalPages - 1);
            } else if (currentPage >= totalPages - 1){
                start = Math.max(2, totalPages - 3)
            }

            //add ellipsis if needed
            if (start > 2) {
                range.push('...')
            }

            //add middle range
            for (let i = start; i <= end; i++) {
                range.push(i)
            }

            //add ellipsis if needed
            if (end < totalPages -1) {
                range.push('...')
            }

            //always add last page
            range.push(totalPages)
        }

        return range;

    }

    const paginationRange = getPaginationRange()


    return (
        <section className="bg-[#F8f4f0] min-h-screen p-5">
            <h1 className="font-bold  text-[32px]">Transactions</h1>
            <article className='bg-white p-4'>
                <div className='flex flex-row items-center justify-between'>
                    <div>
                        <input className='border border-gray-600 rounded-md h-11' value={searchTerm} onChange={handleSearchInput}/>
                        <img src={icon_search} alt="search icon" />

                    </div>

                  

                    <div>
                        <button>
                            <img src={icon_sort} alt="sort icon" />
                        </button>
                        <ul>
                            {['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'].map(option => (
                                <li key={option}>
                                    <button onClick={() => handleSort(option)}>{option}</button>
                                </li>
                                
                            ))}
                        </ul>

                    </div>

                    <div>
                        <button>
                            <img src={icon_filter} alt="filter icon" />

                        </button>
                        <ul>
                            {categories.map(category => (
                                <li key={category}>
                                    <button onClick={() => handleCategoryFilter(category)}>
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    
                    
                </div>

                <div>
                    {paginatedtransaction.length > 0 && paginatedtransaction.map((transaction, index) => (
                        <div key={index}>
                            <img src={transaction.avatar} alt={transaction.name} />
                            <div>
                                <p>{transaction.name}</p>
                                <p>{transaction.category}</p>
                            </div>

                            <div>
                                <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{transaction.amount > 0 ? "+" : ""}{transaction.amount.toFixed(2)}</p>
                                <p >{formatDate(transaction.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    )
}

export default Transactions;