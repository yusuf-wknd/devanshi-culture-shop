interface ImpactStatisticProps {
  statistic: string
  label: string
  className?: string
}

export default function ImpactStatistic({ statistic, label, className = '' }: ImpactStatisticProps) {
  return (
    <div className={`text-center group ${className}`}>
      <div className="bg-background rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 hover:border-primary/20">
        {/* Large statistic */}
        <div className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 sm:mb-4">
          {statistic}
        </div>
        
        {/* Label */}
        <p className="font-sans text-base sm:text-lg font-medium text-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}