const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body);

    // Safety check
    if (!price) {
      throw new Error("Missing price");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
            },
            unit_amount: price, // already in cents
          },
          quantity: 1,
        },
      ],

      // 🔥 THIS ENABLES SOLD SYSTEM RETURN
      success_url: "https://swordahl.quest/shop?success=true",
      cancel_url: "https://swordahl.quest/shop",

      // 📦 SHIPPING (you already wanted this)
      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      // 📱 optional but clean
      phone_number_collection: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (err) {
    console.error("Stripe error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
