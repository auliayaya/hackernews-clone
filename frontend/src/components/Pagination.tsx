
import React from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const CustomPagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="bg-gray-800 text-gray-200 px-4 py-1 rounded disabled:opacity-50"
      >
        More
      </button>
    </div>
  )
}
