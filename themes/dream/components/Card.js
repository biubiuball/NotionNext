const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
   <section className="card shadow-md hover:shadow-xl border border-white/10 rounded-xl lg:p-6 p-4 
                    bg-white/20 dark:bg-black/20 backdrop-filter backdrop-blur-sm 
                    hover:backdrop-blur-md backdrop-saturate-150 transition-all duration-300 
                    lg:duration-100">
        {children}
    </section>
  </div>
}
export default Card
