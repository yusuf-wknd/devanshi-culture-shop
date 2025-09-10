'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import type { Product } from '@/sanity/lib/queries'

interface ProductGridProps {
  products: Product[]
  currentLang: string
  showCategory?: boolean
  className?: string
}

export default function ProductGrid({
  products,
  currentLang,
  showCategory = true,
  className = ''
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            currentLang={currentLang}
            onQuickView={handleQuickView}
            showCategory={showCategory}
            enableQuickView={true}
          />
        ))}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentLang={currentLang}
      />
    </>
  )
}