export const COMPANIES = [
  {
    id: 'c1',
    name: 'Aura Technology',
    niche: 'Electronics',
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=400',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600',
    bio: 'Elevating everyday technology to an art form. We build strictly for the future.',
    followers: '1.2M'
  },
  {
    id: 'c2',
    name: 'Maison',
    niche: 'Home Goods',
    logo: 'https://images.unsplash.com/photo-1542668595-fa93f9ef8cc0?auto=format&fit=crop&q=80&w=400',
    bannerImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1600',
    bio: 'Curated artisanal pieces to transform your living spaces into luxurious sanctuaries.',
    followers: '850K'
  },
  {
    id: 'c3',
    name: 'Vogue Essentials',
    niche: 'Apparel & Accessories',
    logo: 'https://images.unsplash.com/photo-1579493941743-f22b7c12b7fb?auto=format&fit=crop&q=80&w=400',
    bannerImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600',
    bio: 'Defining modern streetwear and classic wardrobe staples. Experience style unapologetically.',
    followers: '2.4M'
  }
];

const RAW_PRODUCTS = [
  {
    id: '1',
    name: 'Aero X1 Wireless Headphones',
    price: 299.99,
    salePrice: 199.99,
    saleEndsAt: Date.now() + 2 * 60 * 60 * 1000, // ~2 hours
    category: 'Electronics',
    companyId: 'c1',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
    description: 'Experience pure sound with the Aero X1. Featuring active noise cancellation and 40-hour battery life in a sleek, lightweight design.',
    featured: true
  },
  {
    id: '2',
    name: 'Minimalist Ceramic Vase',
    price: 45.00,
    salePrice: 29.99,
    saleEndsAt: Date.now() + 18 * 60 * 60 * 1000, // ~18 hours
    category: 'Home Goods',
    companyId: 'c2',
    image: 'https://images.unsplash.com/photo-1581783342308-f792db841f32?auto=format&fit=crop&q=80&w=800',
    description: 'Add a touch of modern elegance to any room with this handcrafted matte ceramic vase. Perfect for dried florals.',
    featured: false
  },
  {
    id: '3',
    name: 'Classic Urban Oxford Shirt',
    price: 89.50,
    category: 'Apparel',
    companyId: 'c3',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&q=80&w=800',
    description: 'A wardrobe staple. Tailored from premium organic cotton for breathability and all-day comfort.',
    featured: true
  },
  {
    id: '4',
    name: 'Lumiere Smart Watch Series 3',
    price: 499.00,
    salePrice: 349.00,
    saleEndsAt: Date.now() + 2 * 24 * 60 * 60 * 1000, // ~2 days
    category: 'Electronics',
    companyId: 'c1',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    description: 'Track your health and stay connected with the edge-to-edge display of the new Lumiere Smart Watch.',
    featured: true
  },
  {
    id: '5',
    name: 'Artisan Coffee Roaster Set',
    price: 150.00,
    category: 'Home Goods',
    companyId: 'c2',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    description: 'Bring the cafe experience home. Complete pour-over set with a precision gooseneck kettle and ceramic dripper.',
    featured: false
  },
  {
    id: '6',
    name: 'Essential Leather Tote',
    price: 210.00,
    salePrice: 159.00,
    saleEndsAt: Date.now() + 4 * 24 * 60 * 60 * 1000, // ~4 days
    category: 'Accessories',
    companyId: 'c3',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    description: 'Crafted from full-grain Italian leather, this spacious tote is designed to age beautifully and carry all your daily essentials.',
    featured: false
  },
  {
    id: '7',
    name: 'ErgoMesh Office Chair',
    price: 349.99,
    category: 'Home Goods',
    companyId: 'c2',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
    description: 'Support your back through long workdays with dynamic lumbar support and breathable mesh.',
    featured: false
  },
  {
    id: '8',
    name: 'Nomad Canvas Backpack',
    price: 120.00,
    salePrice: 89.99,
    saleEndsAt: Date.now() - 24 * 60 * 60 * 1000, // expired 1 day ago
    category: 'Accessories',
    companyId: 'c3',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    description: 'Rugged water-resistant canvas exterior with a padded laptop compartment. Built for the modern traveler.',
    featured: true
  }
];

export const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Accessories', 'Home Goods'];

const REVIEW_AUTHORS = [
  'Alex M.', 'Sophia R.', 'James K.', 'Emma L.', 'Noah B.',
  'Olivia S.', 'Liam T.', 'Ava D.', 'Ethan W.', 'Mia P.',
  'Lucas G.', 'Isabella F.', 'Mason H.', 'Charlotte N.', 'Logan C.'
];

const REVIEW_COMMENTS = [
  'Absolutely love this product! The quality is outstanding and it arrived faster than expected.',
  'Great value for the price. I have been using it daily and it holds up wonderfully.',
  'Exceeded my expectations. The design is sleek and the materials feel premium.',
  'Solid purchase. Fits perfectly and looks even better in person than in the photos.',
  'Really impressed with the attention to detail. Would definitely buy from this brand again.',
  'Good product overall but shipping took a bit longer than promised. Quality is nice though.',
  'Perfect gift idea. My partner loved it and the packaging was beautiful too.',
  'Decent quality but I expected a bit more for this price point. Still happy with it.',
  'This has become an everyday essential for me. Can not recommend it enough!',
  'The craftsmanship is superb. You can tell a lot of care went into making this.',
  'Comfortable and stylish. I have gotten so many compliments since I started using it.',
  'Works exactly as described. No complaints at all — five stars from me.',
  'Nice product, but the color was slightly different from the photo. Still looks great.',
  'Bought this as a replacement for my old one and it is a massive upgrade.',
  'High quality materials and the finish is flawless. Very satisfied with this purchase.'
];

const REVIEW_DATES = [
  '2026-04-12', '2026-03-28', '2026-03-15', '2026-02-19', '2026-02-04',
  '2026-01-22', '2025-12-30', '2025-12-08', '2025-11-14', '2025-10-29'
];

function generateReviews(productId) {
  const seed = Number(productId);
  const count = 3 + (seed % 4); // 3–6 reviews per product
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed * 7 + i * 3) % REVIEW_AUTHORS.length;
    const cIdx = (seed * 5 + i * 11) % REVIEW_COMMENTS.length;
    const dIdx = (seed + i * 2) % REVIEW_DATES.length;
    // Weighted toward higher ratings
    const ratingPool = [5, 5, 5, 4, 4, 4, 3, 3, 2, 1];
    const rating = ratingPool[(seed * 3 + i * 7) % ratingPool.length];
    reviews.push({
      id: `r${productId}-${i + 1}`,
      author: REVIEW_AUTHORS[idx],
      rating,
      comment: REVIEW_COMMENTS[cIdx],
      date: REVIEW_DATES[dIdx],
      verified: (seed + i) % 3 !== 0,
      helpful: ((seed * 11 + i * 17) % 30)
    });
  }
  return reviews;
}

function generateMedia(product) {
  const baseUrl = product.image.split('?')[0];
  const gallery = [
    product.image,
    `${baseUrl}?auto=format&fit=crop&q=80&w=800&sig=${product.id}01`,
    `${baseUrl}?auto=format&fit=crop&q=80&w=800&sig=${product.id}02`,
    `${baseUrl}?auto=format&fit=crop&q=80&w=800&sig=${product.id}03`
  ];
  const frames360 = Array.from({ length: 16 }, (_, i) =>
    `${baseUrl}?auto=format&fit=crop&q=80&w=800&sig=${product.id}f${String(i).padStart(2, '0')}`
  );
  return { gallery, frames360 };
}

export const MOCK_PRODUCTS = RAW_PRODUCTS.map(p => {
  const reviews = generateReviews(p.id);
  const avgRating = reviews.length > 0
    ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 0;
  return {
    ...p,
    images: [
      p.image,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    media: generateMedia(p),
    rating: avgRating,
    reviewsCount: reviews.length,
    reviews,
  };
});
