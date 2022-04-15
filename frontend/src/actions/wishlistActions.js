import axios from "axios";
import { WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM } from "../constants/wishlistConstants";

export const addToWishlist = (id) => async (dispatch, getState) => {

  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: WISHLIST_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      discountPrice: data.discountPrice,
      countInStock: data.countInStock,
    },
  })

  localStorage.setItem('wishlistItems',JSON.stringify(getState().wishlist.wishlistItems))
};

export const removeFromWishlist = (id) => async (dispatch,getState) => {

  dispatch({
    type: WISHLIST_REMOVE_ITEM,
    payload: id
  })

  localStorage.setItem('wishlistItems',JSON.stringify(getState().wishlist.wishlistItems))

}