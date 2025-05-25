const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {

    // Generate page numbers with ellipsis logic
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        pages.push(1);

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 2; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            const halfVisible = Math.floor((maxVisiblePages - 2) / 2);
            let start = Math.max(2, currentPage - halfVisible);
            let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

            if (currentPage <= halfVisible + 2) {
                end = maxVisiblePages;
            } else if (currentPage >= totalPages - halfVisible - 1) {
                start = totalPages - maxVisiblePages + 1;
            }

            if (start > 2) {
                pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }

            if (end < totalPages - 1) {
                pages.push('...');
            }
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex justify-center">
            <nav className="flex items-center space-x-1">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-3 py-1 rounded-lg border transition-all ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                >
                    &laquo; <span className="hidden lg:inline-block">Prev</span>
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={index} className="px-2 sm:px-3 py-1 text-gray-500">...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 sm:px-3 py-1 rounded-lg border transition-all ${currentPage === page ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-3 py-1 rounded-lg border transition-all ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                >
                    <span className="hidden lg:inline-block">Next</span> &raquo;
                </button>
            </nav>
        </div>
    )
}

export default Pagination