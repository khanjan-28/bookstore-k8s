function Categories(){

const categories = [

"Programming",
"DevOps",
"Cloud",
"Database",
"Networking",
"AI"

];


return (

<section className="categories">

<h2>
Browse Categories 📂
</h2>


<div className="category-grid">


{
categories.map((category,index)=>(

<div
className="category-card"
key={index}
>

<h3>
📚 {category}
</h3>

</div>

))

}


</div>


</section>

);


}

export default Categories;
