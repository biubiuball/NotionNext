const Card = ({ children, headerSlot, className }) => {
  return <div className={className}>
    <>{headerSlot}</>
    <section className="card shadow-md hover:shadow-md border-transparent rounded-xl lg:p-6 p-4 bg-transparent lg:duration-100">
        {children}
    </section>
  </div>
}
export default Card
