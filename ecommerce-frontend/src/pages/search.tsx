import { useState } from "react"
import ProductCard from "../components/product-card"

const Search = () => {

  const [search , setSearch] = useState("")
  const [sort , setSort] = useState("")
  const [maxPrice , setMaxPrice] = useState(100000)
  const [page , setPage] = useState(1)
  const [category , setCategory] = useState("")


  const addToCartHandler = ()=>{

  }

  return (
    <div className="prodct-search-page">
      <aside>
        <h2>
          Filters
        </h2>
      
      <div>
        <h4>
          sort
        </h4>
        <select value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="">None</option>
          <option value="asc">Price (Low To High)</option>
          <option value="dsc">Price( High To Low )</option>
        </select>
      </div>
      <div>
        <h4>
          Max Price : {maxPrice || ""}
        </h4>
        <input type="range" min={100} max={100000} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} name="" id="" />
      </div>
      <div>
        <h4>
          Category
        </h4>
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="asc">Sample 1 </option>
          <option value="dsc">Sample 2</option>
        </select>
      </div>

      
      </aside>
      <main>
        <h1>
          Products
        </h1>
        <input type="text" placeholder="Search By Name.." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <div className="search-product-list">
        <ProductCard productId={"632874"} photo={"https://m.media-amazon.com/images/I/41cgBFdKbfL._SY445_SX342_QL70_FMwebp_.jpg"} name={"laptop"} price={2000} stock={10} handler={addToCartHandler}/>
        </div>
        <article onClick={()=>setPage((prev)=>prev - 1)}><button>prev</button> 
        <span>{page} of {4}</span>
        <button>next</button>
        </article>

      </main>
    </div>
  )
}

export default Search