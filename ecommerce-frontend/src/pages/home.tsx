import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"

const Home = () => {

  const addToCartHandler=()=>{

  };

 

  return (
    <div className='home'>
      
      <section>

      </section>


      
    
      
      <h1>
      Latest products
        <Link to={"/search"} className="findmore">
        More</Link>
      </h1>
      <main>
    </main>
    <ProductCard productId={"632874"} photo={"https://m.media-amazon.com/images/I/41cgBFdKbfL._SY445_SX342_QL70_FMwebp_.jpg"} name={"Apple Macbook Pro"} price={82000} stock={10} handler={addToCartHandler}/>


    </div>
  )
}

export default Home