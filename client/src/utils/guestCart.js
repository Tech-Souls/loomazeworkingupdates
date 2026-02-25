export const validateGuestCartItem = (item) => {
    const requiredFields = ['productID', 'title', 'price', 'quantity'];
    const missingFields = requiredFields.filter(field => !item[field]);

    if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }
// 
    // Validate price is a positive number
    if (typeof item.price !== 'number' || item.price <= 0) {
        console.error('Invalid price');
        return false;
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        console.error('Invalid quantity');
        return false;
    }

    // Validate stock
    if (typeof item.stock !== 'number' || item.stock < 0) {
        console.error('Invalid stock');
        return false;
    }

    return true;
};

export const addGuestCartItem = (item) => {
    // Validate the item first
    if (!validateGuestCartItem(item)) {
        console.warn('Invalid cart item, not adding to guest cart');
        return JSON.parse(localStorage.getItem("guest_cart")) || [];
    }

    const cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

    // Create unique identifier for the item (matching your schema structure)
    const itemId = `${item.productID}_${item.variantID || 'base'}`;

    // Check if item already exists - same logic as your user cart
    const existingIndex = cart.findIndex(c =>
        c.productID === item.productID &&
        c.variantID === item.variantID
    );

    if (existingIndex !== -1) {
        // Update quantity if exists (same as your user cart logic)
        cart[existingIndex].quantity += item.quantity;

        // Ensure quantity doesn't exceed stock
        if (cart[existingIndex].quantity > item.stock) {
            cart[existingIndex].quantity = item.stock;
        }
    } else {
        // Add new item with the exact same structure as your user cart schema
        const guestCartItem = {
            productID: item.productID,
            variantID: item.variantID,
            brandSlug: item.brandSlug,
            title: item.title,
            slug: item.slug,
            mainImageURL: item.mainImageURL,
            variantImageURL: item.variantImageURL,
            quantity: item.quantity,
            price: item.price,
            comparedPrice: item.comparedPrice || item.price, // Fallback to price if no comparedPrice
            stock: item.stock,
            selectedOptions: item.selectedOptions || []
        };
        cart.push(guestCartItem);
    }

    localStorage.setItem("guest_cart", JSON.stringify(cart));
    return cart;
};

export const getGuestCart = () => {
    return JSON.parse(localStorage.getItem("guest_cart")) || [];
};

export const clearGuestCart = () => {
    localStorage.removeItem("guest_cart");
    return [];
};

export const updateGuestCartItemQuantity = (itemId, quantity) => {
    const cart = getGuestCart();
    const index = cart.findIndex(item =>
        `${item.productID}_${item.variantID || 'base'}` === itemId
    );

    if (index !== -1) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.splice(index, 1);
        } else {
            // Update quantity
            cart[index].quantity = quantity;
        }

        localStorage.setItem("guest_cart", JSON.stringify(cart));
        return cart;
    }

    return cart;
};