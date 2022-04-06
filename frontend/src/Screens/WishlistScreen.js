import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../Components/message";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../actions/wishlistActions";

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1)

  const wishlist = useSelector((state) => state.wishlist);
  const { wishlistItems } = wishlist;

  const removeFromWishlistHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(removeFromWishlist(id))
    }
  };

  const addToCartHandler = (id) => {
    navigate(`/cart/${id}?qty=${qty}`);
  }

  return (
    <Row>
      <Col md={9}>
        <h1>Wishlist</h1>
        {wishlistItems && wishlistItems.length === 0 ? (
          <Message>
            Your wishlist is empty <Link to="/">Go back</Link>{" "}
          </Message>
        ) : (
          <ListGroup variant="flush">
            {wishlistItems &&
              wishlistItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>₹{item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(item.countInStock).keys()].map(
                          (x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Col>
                    <Col md={3}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => addToCartHandler(item.product)}
                    >
                      <i className="fa fa-shopping-cart"></i> <span style={{fontSize:'11px'}}>Add to cart</span>
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromWishlistHandler(item.product)}
                    >
                      <i className="fa fa-trash"></i> <span style={{fontSize:'11px'}}>Remove item</span>
                    </Button>
                  </Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Col>
      <Col md={3}>
      <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>
                Subtotal (
                {wishlistItems && wishlistItems.reduce((acc, item) => acc + Number(qty), 0)})
                items
              </h4>
              ₹
              {wishlistItems && wishlistItems
                .reduce((acc, item) => acc + Number(qty) * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default WishlistScreen;
