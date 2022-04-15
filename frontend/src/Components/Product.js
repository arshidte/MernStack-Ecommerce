import React from "react";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../actions/wishlistActions";

const Product = ({ product, showAlert }) => {
  const dispatch = useDispatch();

  const addToWishlistHandler = () => {
    dispatch(addToWishlist(product._id));
    showAlert("Product added to wishlist", "success")
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add to wishlist
    </Tooltip>
  );

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Text
        style={{
          display: "flex",
          justifyContent: "space-between",
          textDecoration: "none",
          margin: "5px",
        }}
      >
        {product.discountPrice>1 && <img src="https://icon2.cleanpng.com/20171221/wyq/special-offer-png-5a3c34127f68d4.8340031815138949305219.jpg" style={{width:"50px"}}></img>}
        <OverlayTrigger
          placement="left"
          delay={{ show: 10, hide: 400 }}
          overlay={renderTooltip}
        >
          <i onClick={() => addToWishlistHandler()} className="fas fa-heart" />
        </OverlayTrigger>
      </Card.Text>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>
        <span>{product.discountPrice>0 && <s>₹{product.price}</s>} </span>
        <span style={{fontSize:"1.3rem"}}>{product.discountPrice>0 && <span>₹{product.discountPrice}</span>}</span>
        <p style={{fontSize:"1.3rem"}}>{product.discountPrice<=0 && <span>₹{product.price}</span>}</p>
      </Card.Body>
    </Card>
  );
};

export default Product;
