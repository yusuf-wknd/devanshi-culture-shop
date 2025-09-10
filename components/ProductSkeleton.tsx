interface ProductSkeletonProps {
  count?: number
  className?: string
}

export default function ProductSkeleton({ 
  count = 8, 
  className = '' 
}: ProductSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-background rounded-xl shadow-sm border border-border/50 overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-secondary/50"></div>
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Category */}
            <div className="h-3 bg-secondary/50 rounded w-1/3"></div>
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-secondary/50 rounded w-3/4"></div>
              <div className="h-5 bg-secondary/50 rounded w-1/2"></div>
            </div>
            
            {/* Description */}
            <div className="space-y-1">
              <div className="h-4 bg-secondary/50 rounded w-full"></div>
              <div className="h-4 bg-secondary/50 rounded w-2/3"></div>
            </div>
            
            {/* Price */}
            <div className="h-6 bg-secondary/50 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}