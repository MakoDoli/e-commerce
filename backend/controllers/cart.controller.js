export const addToCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({
      message: "Product couldn't be added to cart",
      error: error.message,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id; // assuming this is how the user id is obtained from the request
    const cartProducts = await Cart.find({ user: userId }).populate("product");
    res.status(200).json(cartProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;

    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity Controller", error);
    res.status(500).json("server error");
  }
};
