const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    // 计算页码范围
    const startPage:number = Math.max(1, currentPage - 2); // 当前页前两页
    const endPage:number = Math.min(totalPages, currentPage + 2); // 当前页后两页
    let currentPageRange:number = endPage - startPage + 1; // 当前页范围是否小于等于5
    if (currentPageRange < 5) {
        currentPageRange = 5; // 如果小于5，则设置为5
    }
    const pageNumbers = Array.from(
        { length: currentPageRange },
        (_, index) => startPage + index
    );
    return (
        <div className="pagination">
            {/* Previous Button */}
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`pagination-button ${
                        currentPage === page ? "active" : ""
                    }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
