// Homepage content, copied verbatim from https://www.kokosorganic.com.ph/home
// (scraped 2026-11-04). Typos in the source are kept on purpose until the
// client approves copy edits.

export type ProductCategory = "oils" | "food-drink" | "personal-care";

export type Product = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  category: ProductCategory;
  /** Light tint from the pack: card colour on hover (navy text stays AA+). */
  accent: string;
  /** Stronger pack colour: image panel on hover. */
  accentStrong: string;
};

export const productCategories: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "oils", label: "Oils" },
  { id: "food-drink", label: "Food & drink" },
  { id: "personal-care", label: "Personal care" },
];

export const products: Product[] = [
  {
    slug: "coco-collagen",
    name: "Coco Collagen",
    summary: "75g CoconutOil (MCT) Soap with Collagen and Niacinamide",
    image: "/images/products-cutout/coco-collagen.png",
    category: "personal-care",
    accent: "#A9DEE6",
    accentStrong: "#2A9DB0",
  },
  {
    slug: "skimmed-coconut-milk-beverage",
    name: "Skimmed Coconut Milk Beverage",
    summary:
      "Coconut skimmed milk is a major by-product of the virgin coconut oil using centrifuge method.",
    image: "/images/products-cutout/skimmed-coconut-milk-beverage.png",
    category: "food-drink",
    accent: "#CDE8B4",
    accentStrong: "#6DAE45",
  },
  {
    slug: "aqua-scent-vco-massage-oil-ginger-eucalyptus",
    name: "Aqua Scent VCO Massage Oil (Ginger Eucalyptus)",
    summary:
      "Virgin Coconut Oil with ginger extracted and Eucalyptus (Massage Oil) good as anti inflammatory, relieves: arthritis, muscle pain, abdominal pain, menstruation spasmodic, headaches.",
    image: "/images/products-cutout/massage-oil-ginger-eucalyptus.png",
    category: "personal-care",
    accent: "#F8CFA1",
    accentStrong: "#E38A33",
  },
  {
    slug: "aqua-scent-vco-massage-oil-lavender-scent",
    name: "Aqua Scent VCO Massage Oil (Lavender Scent)",
    summary:
      "Virgin Coconut Oil with Lavender Scent (Massage Oil) good for relaxation, reduces anxiety and emotional stress, improves sleep, restores skin complexion, high antioxidant, alleviates headaches and can be used as moisturizer.",
    image: "/images/products-cutout/massage-oil-lavender.png",
    category: "personal-care",
    accent: "#D9CBEE",
    accentStrong: "#8C6CC2",
  },
  {
    slug: "organic-virgin-coconut-oil",
    name: "Organic Virgin Coconut Oil",
    summary:
      "Oil obtained from the fresh, mature kernel of the coconut by mechanical or natural means, with or without the use of heat, without undergoing chemical refining, bleaching or deodorizing, and which does not lead to the alteration of the nature of the oil.",
    image: "/images/products-cutout/organic-virgin-coconut-oil.png",
    category: "oils",
    accent: "#C6E3BC",
    accentStrong: "#4A9447",
  },
  {
    slug: "mix-cream-skimmed-coconut-milk",
    name: "Mix & Cream Skimmed Coconut Milk",
    summary:
      "Coconut skimmed milk is a major by-product of the virgin coconut oil using centrifuge method.",
    image: "/images/products-cutout/mix-cream-skimmed-coconut-milk.png",
    category: "food-drink",
    accent: "#C5E0F5",
    accentStrong: "#6AA9DC",
  },
  {
    slug: "organic-coconut-cooking-oil-rbd",
    name: "Organic Coconut Cooking Oil (RBD)",
    summary:
      "Crude coconut oil extracted from the mature coconut meat (copra) that undergone extensive refining, bleaching and deodorizing, RBD Coconut oil used is mainly as cooking oil.",
    image: "/images/products-cutout/organic-coconut-cooking-oil-rbd.png",
    category: "oils",
    accent: "#E1EDAE",
    accentStrong: "#94BE45",
  },
  {
    slug: "organic-coconut-sugar",
    name: "Organic Coconut Sugar",
    summary:
      "Coconut Sugar is all purpose sweetener, Certified 100% organic has low Glycemic Index, Unrefined and Non-GMO.",
    image: "/images/products-cutout/organic-coconut-sugar.png",
    category: "food-drink",
    accent: "#E8CFAE",
    accentStrong: "#A2733F",
  },
];

export const productsIntro = [
  "We want to offer you various coconut products and we are not resting we continue to explore and develop new product line for you to enjoy and experience the Tree of Life – The Coconut Tree.",
  "At CocoPlus, our Sister’s goal is to make your family healthy while enjoying the Nature’s Gift. This is what we call life’s sample pleasures.",
];

export const hero = {
  eyebrow: "EST. 2005",
  title: "Our Virgin Coconut Oil",
  body: "We’ve always believed that serving the best tasting Virgin Coconut Oil is possible. We want our VCO to really taste good to encourage family members to drink it. That is why our company chose the FRESH WET Centrifuge method, considered as the premium process in making virgin coconut oil. In this process you get very light coconut flavor, mild and smooth in taste.",
};

export const company = {
  title: "CocoPlus Aquarian Development Corporation",
  body: "Manufactures organic Virgin Coconut Oil, Known to be the healthiest dietary oil on earth. The company is capable of producing at least and average of 5,000 to 8,000 liters per month using fresh wet centrifuge method. This type of method produces the best quality virgin coconut oil.",
};

export const process = {
  eyebrow: "Process",
  title: "Fresh Wet Centrifuge method",
  body: [
    "Virgin Coconut Oil is recovered from coconut milk, the milky fluid obtained when freshly comminuted coconut kernel is pressed by mechanical means.",
    "Centrifuge extracted VCO is very smooth and light in taste, a true delicacy and is easily adborbed by the skin. This method gives a higher lauric acid than any other coconut oil. Centrifuged VCO is the premium oil!",
  ],
  // Homepage process scroll (2026-11-05). Step copy is rewritten from the
  // body above; step 03's density explanation is general centrifuge physics.
  // Needs client review before launch. Images are AI-generated illustrations
  // (Higgsfield), not photos of the Cocoplus facility.
  steps: [
    {
      id: "kernel",
      title: "Fresh kernel",
      body: "It starts with the white kernel of fresh, mature coconuts, comminuted (finely grated) while it is still fresh and wet.",
      specs: [
        ["Input", "Fresh coconut kernel"],
        ["Action", "Comminuted, finely grated"],
      ],
      image: "/images/process/step1.jpg",
      alt: "Freshly grated white coconut kernel on a stainless steel tray beside a split coconut",
    },
    {
      id: "press",
      title: "Mechanical press",
      body: "The grated kernel is pressed by mechanical means. What flows out is coconut milk, the milky fluid the oil is recovered from.",
      specs: [
        ["Input", "Grated kernel"],
        ["Action", "Mechanical pressing"],
        ["Output", "Coconut milk"],
      ],
      image: "/images/process/step2.jpg",
      alt: "Coconut milk streaming from a stainless steel press into a glass beaker",
    },
    {
      id: "centrifuge",
      title: "Centrifuge",
      body: "The coconut milk is spun at high speed. Oil, water and solids have different densities, so they separate into layers and the lighter oil is drawn off.",
      specs: [
        ["Principle", "Separation by density"],
        ["Output", "Virgin coconut oil layer"],
      ],
      image: "/images/process/step3.jpg",
      alt: "Glass centrifuge tubes showing an oil layer separated above cream and water",
    },
    {
      id: "vco",
      title: "Virgin coconut oil",
      body: "Centrifuge extracted VCO is very smooth and light in taste, a true delicacy, and easily absorbed by the skin. This method gives a higher lauric acid than any other coconut oil.",
      specs: [
        ["Taste", "Light, mild and smooth"],
        ["Method", "Fresh wet centrifuge"],
      ],
      quote: "Centrifuged VCO is the premium oil!",
      image: "/images/process/step4.jpg",
      alt: "Clear virgin coconut oil in a laboratory flask and vial beside a coconut half",
    },
  ],
};

export const certifications = {
  title: "Certifications",
  note: "Certified Organic By Control Union",
  cuNumber: "CU No.: 843226",
  logos: [
    { name: "Halal", src: "/images/certs/halal.jpg" },
    { name: "FDA", src: "/images/certs/fda.png" },
    { name: "GMP", src: "/images/certs/gmp.png" },
  ],
};

export const affiliations = [
  { name: "VCOP", src: "/images/affiliations/vcop.png" },
  { name: "Philippine International Trading Corporation", src: "/images/affiliations/pitc.png" },
  { name: "ALAFOP Federation of the Philippines", src: "/images/affiliations/alafop.jpg" },
  { name: "PHILFOODEX", src: "/images/affiliations/philfoodex.png" },
  { name: "PHILEXPORT", src: "/images/affiliations/philexport.gif" },
];

// The six most recent of the 23 posts on the live homepage.
export const news = [
  { slug: "biofach-china-2026", date: "15 May", title: "BIOFACH CHINA 2026", excerpt: "DATE : 2026.5.18-20 · VENUE: Shanghai New International Expo Center (SNIEC) Hall E6", image: "/images/news/biofach-china-2026.jpg" },
  { slug: "biofach-japan-2024", date: "27 May", title: "BIOFACH JAPAN 2024", excerpt: "25 - 27 October 2024 at the Tokyo Big Sight, Tokyo Japan", image: "/images/news/biofach-japan-2024.jpg" },
  { slug: "mafbex-2024", date: "27 May", title: "MAFBEX 2024", excerpt: "June 12 to 26, 2024 at the World Trade Center Metro Manila!", image: "/images/news/mafbex-2024.jpg" },
  { slug: "ifex-2024", date: "08 May", title: "IFEX 2024", excerpt: "10-12 May 2024 · World Trade Center Metro Manila, Pasay City, Philippines", image: "/images/news/ifex-2024.png" },
  { slug: "fabej-japan-2024", date: "02 Mar", title: "FABEJ JAPAN 2024", excerpt: "Fabex is one of the largest trade fairs in Japan covering the entire range of commercial foods and food products, equipment and materials, and containers and packaging.", image: "/images/news/fabej-japan-2024.jpg" },
  { slug: "malaysia-international-halal-showcase-2023", date: "09 Aug", title: "Malaysia International Halal Showcase 2023", excerpt: "12 to 15 September 2023 · MITEC Malaysia International Trade and Exhibition Centre Kuala Lumpur, Malaysia", image: "/images/news/mihas-2023.png" },
];

export const contact = {
  address: ["Barangay San Bartolome", "San Pablo City, Laguna 4000", "Philippines"],
  mobile: "+6317 837 8537",
  phone: "+632 8633 3890",
  fax: "+632 524 4548",
  email: "cocoplus2005@gmail.com",
  copyright: "© Copyright 2018 CocoPlus. All Rights Reserved.",
};

export const nav = {
  products: products.map((p) => ({ name: p.name, href: `/products/${p.slug}` })),
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Certification", href: "/certification" },
    { name: "Affiliations", href: "/affiliations" },
    { name: "Process", href: "/process" },
  ],
  links: [
    { name: "News & Events", href: "/news-events" },
    { name: "Contact Us", href: "/contact-us" },
  ],
};
