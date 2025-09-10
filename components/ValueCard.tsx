interface ValueCardProps {
  title: string
  description: string
  className?: string
}

export default function ValueCard({ title, description, className = '' }: ValueCardProps) {
  return (
    <div className={`bg-background rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 hover:border-primary/20 ${className}`}>
      <div className="text-center space-y-4">
        {/* Icon placeholder */}
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-foreground">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}