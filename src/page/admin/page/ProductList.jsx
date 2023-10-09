import React,{useState} from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import ProductData from "./ProductData";
const ProductList = () => {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
    }
  };

  return (
    <Layout>
      <div className="border-green">
        <div className="p-3 p-sm-4">
          <div className="row mb-3">
            <div className="col-lg-12 col-sm-12">
              <div className="d-flex align-content-center justify-content-between gap-3 flex-wrap">

          <div className="col-lg-4 col-sm-12">
          <input
                    type="text"
                    className="search-input search-input-width"
                    name="search"
                    placeholder="Search..."
                    onKeyUp={handleKeyUp}
                  />          </div>
                <Button
                  className="fees-btn d-flex align-items-center gap-2"
                  onClick={() => navigate("/admin/add-product")}>
                  <img src="../admin-img/add.svg" alt="Add" width="12px" />
                  Add
                </Button>
              </div>
            </div>
          </div>
          <ProductData  search={search}/>
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;
