import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Components/Product";
import Message from "../Components/message";
import Loader from "../Components/loader";
import Paginate from "../Components/Paginate";
import Meta from "../Components/Meta";
import AlertMessage from "../Components/AlertMessage";
import { listProducts } from "../actions/productActions";
import { useParams } from "react-router-dom";
import ProductCarousel from "../Components/ProductCarousel";

const HomeScreen = () => {
  const [alert, setAlert] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const brand = searchParams.get("brand");

  const showAlert = (message, type) => {
    setAlert({
      message,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const { keyword } = useParams();

  const pageNumber = useParams().pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const handleSelectchange = (e) => {
    setSearchParams({
      brand: e.target.value,
    });
  };

  const clearFilterHandler = () => {
    setSearchParams();
  }

  return (
    <>
      <Meta />
      <AlertMessage alert={alert} />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go back
        </Link>
      )}
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div>
            <Row>
              <Col>
                Brand:
                <select onChange={handleSelectchange}>
                  <option value={""}>Select</option>
                  <option value={"Apple"}>Apple</option>
                  <option value={"Oneplus"}>Oneplus</option>
                  <option value={"Oppo"}>Oppo</option>
                  <option value={"Realme"}>Realme</option>
                  <option value={"Samsung"}>Samsung</option>
                  <option value={"VIVO"}>VIVO</option>
                  <option value={"Xiaomi"}>Xiaomi</option>
                </select>
                <span
                  style={{cursor:"pointer"}}
                  onClick={clearFilterHandler}
                  className="mx-2"
                >
                  Clear
                </span>
              </Col>
            </Row>
          </div>
          <Row>
            {products
              .filter((product) => {
                if (!brand) {
                  return true;
                }
                return brand === product.brand;
              })
              .map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product showAlert={showAlert} product={product} />
                </Col>
              ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
