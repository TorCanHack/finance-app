import icon_close from '../assets/images/icon-close-modal.svg'

const DeleteBudgetModal = ({onClose, onDelete, budgetCategory}) => {

    return (
        <section className="">
            <div>
                <h2>Delete "{budgetCategory}"</h2>
                <button>
                    <img src={icon_close} alt="icon close" onClick={onClose}/>
                </button>
            </div>
            <p className="text-red-600">Are you sure you want to delete this budget? This action cannot be reversed and all the data inside will be removed forever</p>
            
            <button className="text-red-600 cursor-pointer" onClick={onDelete}>Yes, Confirm Deletion</button>
            <button className="text-gray-900 cursor-pointer" onClick={onClose}>Cancel</button>
        </section>
    )
}

export default DeleteBudgetModal;