import { useParams } from "react-router-dom";

// this page have params
export function Category() {
  const { category } = useParams();
  return <div>Category</div>;
}

export default Category;
