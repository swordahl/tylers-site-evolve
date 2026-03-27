const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body);

    // safety check
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

      // 🔥 FIXED URLS (THIS WAS BREAKING EVERYTHING)
      success_url: "https://swordahl.quest/shop",
      cancel_url: "https://swordahl.quest/shop",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (err) {
    console.error("Stripe error:", err); // 🔥 helps debugging

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
