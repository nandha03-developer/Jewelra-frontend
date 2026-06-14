import { NextResponse } from 'next/server';

// Fetch live rates from the admin API
async function getLiveRates() {
  try {
    const response = await fetch('https://jewelra-admin.vercel.app/api/rates', {
      cache: 'no-store'
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Chat API: Error fetching live rates:', error);
  }
  return { gold: 6850, silver: 98.50 }; // Fallback
}

// Keyword-based chatbot logic with dynamic rates and links
const getBotReply = (message: string, rates: { gold: number; silver: number }): string => {
  const msg = message.toLowerCase();

  // 1. Gold Rate & Jewellery
  if (msg.includes('gold') || msg.includes('thangam')) {
    if (msg.includes('jewel') || msg.includes('collection') || msg.includes('list') || msg.includes('shop')) {
      return `Explore our exquisite Gold Jewellery collection here: /shop/gold \n\nToday's gold rate: ₹${rates.gold.toLocaleString()} per gram.`;
    }
    return `Today's live gold rate is ₹${rates.gold.toLocaleString()} per gram (22K). \n\nView our Gold Collection: /shop/gold`;
  }

  // 2. Silver Rate & Jewellery
  if (msg.includes('silver') || msg.includes('velli')) {
    if (msg.includes('jewel') || msg.includes('collection') || msg.includes('list') || msg.includes('shop')) {
      return `Take a look at our Silver Jewellery collection: /shop/silver \n\nCurrent silver rate: ₹${rates.silver.toLocaleString()} per gram.`;
    }
    return `Today's live silver rate is ₹${rates.silver.toLocaleString()} per gram. \n\nShop Silver Jewelry: /shop/silver`;
  }

  // 3. Diamond Jewellery
  if (msg.includes('diamond') || msg.includes('vairam')) {
    return "Our Diamond collections are crafted for brilliance and eternity. You can view them here: /shop/diamond";
  }

  // 4. Gold Schemes & Savings
  if (msg.includes('scheme') || msg.includes('save') || msg.includes('saving') || msg.includes('thittam')) {
    return "Start your gold savings journey with Jewelra! We have 11-month and 15-month gold saving schemes with zero making charges at maturity. Join today: /services/gold-scheme";
  }

  // 5. Old Gold Exchange
  if (msg.includes('old gold') || msg.includes('exchange gold') || msg.includes('pazhaya thangam')) {
    return "Yes! You can exchange your old gold for new designs. We offer competitive market value for your old gold with a transparent testing process. Visit our store for an appraisal.";
  }

  // 6. Categories for All
  if (msg.includes('men') || msg.includes('husband') || msg.includes('aangal')) {
    return "Explore our sophisticated Men's Collection: Rings, Chains, Kada & more: /shop/men";
  }
  if (msg.includes('kid') || msg.includes('baby') || msg.includes('child') || msg.includes('kuzhandhai')) {
    return "Check out our cute and safe jewellery for kids: /shop/kids";
  }
  if (msg.includes('gemstone') || msg.includes('stone') || msg.includes('ruby') || msg.includes('emerald') || msg.includes('navaratna')) {
    return "Discover the magic of gemstones and birthstones here: /shop/gemstone";
  }

  // 7. Jewellery Care & Maintenance
  if (msg.includes('care') || msg.includes('clean') || msg.includes('wash') || msg.includes('polish')) {
    return "To keep your jewellery shining: \n1. Keep it away from chemicals/perfumes. \n2. Clean with mild soapy water and a soft brush. \n3. Store in separate boxes to avoid scratches. \nWe offer free lifetime cleaning at our stores!";
  }

  // 8. Order Tracking
  if (msg.includes('track') || msg.includes('status') || msg.includes('where is my order') || msg.includes('order status')) {
    return "You can track your order status in real-time here: /services/track-order \n(Please have your Order ID ready)";
  }

  // 9. Gift Cards & Gifting
  if (msg.includes('gift') || msg.includes('present') || msg.includes('card') || msg.includes('anbu parisu')) {
    return "Not sure what to buy? Give them the gift of choice with a Jewelra Gift Card! Available from ₹1,000 upwards. View gifting ideas: /shop/gifting";
  }

  // 10. Specific Categories
  if (msg.includes('earring') || msg.includes('stud') || msg.includes('kammal')) {
    return "From daily wear studs to heavy wedding jhumkas, explore our earrings: /shop/earrings";
  }
  if (msg.includes('bangle') || msg.includes('bracelet') || msg.includes('valayal') || msg.includes('kaapu')) {
    return "Adorn your wrists with our beautiful bangles and bracelets: /shop/bangles";
  }
  if (msg.includes('necklace') || msg.includes('chain') || msg.includes('haram')) {
    return "Discover our stunning necklaces and chains for every occasion: /shop/necklaces";
  }
  if (msg.includes('ring') || msg.includes('motthiram')) {
    if (msg.includes('size') || msg.includes('alavu')) {
      return "To find your perfect ring size, use our size guide on product pages or visit our store for a free measurement.";
    }
    return "Find the perfect ring for engagement or daily wear: /shop/rings";
  }

  // 11. Wedding / Bridal
  if (msg.includes('wedding') || msg.includes('bridal') || msg.includes('marriage') || msg.includes('kalyanam')) {
    return "Congratulations! Our Bridal Collection is designed to make your big day special. View here: /shop/wedding";
  }

  // 12. Certification & Quality
  if (msg.includes('quality') || msg.includes('pure') || msg.includes('hallmark') || msg.includes('bis') || msg.includes('gia')) {
    return "At Jewelra, we prioritize purity. All our Gold is BIS Hallmarked (22K) and Diamonds are GIA/IGI certified. You can trust our 100% authenticity.";
  }

  // 13. Payment & EMI
  if (msg.includes('emi') || msg.includes('installment') || msg.includes('pay') || msg.includes('cod')) {
    return "We offer flexible payment options including Credit/Debit cards, Net Banking, and UPI. We also provide Easy EMI options on selected banks. Cash on Delivery (COD) is available for orders below ₹49,999.";
  }

  // 14. Customization
  if (msg.includes('custom') || msg.includes('make') || msg.includes('own') || msg.includes('order')) {
    return "Yes! We create custom jewellery based on your designs. Please contact our expertise team or visit our store to discuss your unique masterpiece.";
  }

  // 15. Store Location / Contact
  if (msg.includes('store') || msg.includes('location') || msg.includes('address') || msg.includes('place') || msg.includes('map')) {
    return "We have multiple stores across the city! You can find the nearest Jewelra branch here: /store-locator";
  }
  if (msg.includes('contact') || msg.includes('whatsapp') || msg.includes('call') || msg.includes('phone')) {
    return "We are here to help! \n📞 Call: +91 9894934429 \n🟢 WhatsApp: +91 9894934429 \n📧 Email: jewelra2026@gmail.com";
  }

  // Greetings
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('vanakkam') || msg.includes('hey')) {
    return "Vanakkam! Welcome to Jewelra Concierge. I can assist you with Gold rates, Jewellery collections, EMI options, Gold Savings schemes, and even Order tracking. How can I assist you today?";
  }

  // Fallback
  return "I'm sorry, I didn't quite catch that. You can ask about gold rates, savings schemes, order status, or find our stores!";
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Fetch Live Rates First
    const rates = await getLiveRates();

    // 2. Simulate a bit of delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // 3. Get Reply with Live Rates
    const reply = getBotReply(message, rates);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
