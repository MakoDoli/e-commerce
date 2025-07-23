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

export const getCartProducts = async (req, res) => {};
export const removeAllFromCart = async (req, res) => {};
export const updateQuantity = async (req, res) => {};
