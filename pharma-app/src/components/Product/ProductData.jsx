const products = [
  // Analgesic Category
  {
    id: 1,
    name: "Paracetamol",
    price: 50,
    description: "Used to treat fever and mild pain.",
    category: "Analgesic",
    image: "/src/assets/logo.jpeg",
    stock: 100
  },
  {
    id: 2,
    name: "Ibuprofen",
    price: 60,
    description: "Reduces pain, inflammation, and fever.",
    category: "Analgesic",
    image: "/src/assets/logo.jpeg",
    stock: 80
  },
  {
    id: 3,
    name: "Aspirin",
    price: 40,
    description: "Relieves pain and reduces inflammation.",
    category: "Analgesic",
    image: "/src/assets/logo.jpeg",
    stock: 50
  },
  {
    id: 4,
    name: "Naproxen",
    price: 70,
    description: "Used for arthritis and pain relief.",
    category: "Analgesic",
    image: "/src/assets/logo.jpeg",
    stock: 60
  },
  {
    id: 5,
    name: "Diclofenac",
    price: 55,
    description: "Reduces pain, swelling, and joint stiffness.",
    category: "Analgesic",
    image: "/src/assets/logo.jpeg",
    stock: 40
  },

  // Antibiotic Category
  {
    id: 16,
    name: "Amoxicillin",
    price: 120,
    description: "Effective against bacterial infections.",
    category: "Antibiotic",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 17,
    name: "Azithromycin",
    price: 200,
    description: "Treats respiratory and skin infections.",
    category: "Antibiotic",
    image: "/src/assets/logo.jpeg",
    stock: 20
  },
  {
    id: 18,
    name: "Ciprofloxacin",
    price: 150,
    description: "Broad-spectrum antibiotic.",
    category: "Antibiotic",
    image: "/src/assets/logo.jpeg",
    stock: 25
  },
  {
    id: 19,
    name: "Doxycycline",
    price: 180,
    description: "Used for acne and bacterial infections.",
    category: "Antibiotic",
    image: "/src/assets/logo.jpeg",
    stock: 15
  },
  {
    id: 20,
    name: "Cephalexin",
    price: 160,
    description: "Treats a variety of bacterial infections.",
    category: "Antibiotic",
    image: "/src/assets/logo.jpeg",
    stock: 10
  },

  // Antihistamine Category
  {
    id: 31,
    name: "Cetirizine",
    price: 30,
    description: "Relieves allergy symptoms.",
    category: "Antihistamine",
    image: "/src/assets/logo.jpeg",
    stock: 50
  },
  {
    id: 32,
    name: "Loratadine",
    price: 35,
    description: "Effective for hay fever and allergies.",
    category: "Antihistamine",
    image: "/src/assets/logo.jpeg",
    stock: 60
  },
  {
    id: 33,
    name: "Fexofenadine",
    price: 40,
    description: "Used for allergic rhinitis and urticaria.",
    category: "Antihistamine",
    image: "/src/assets/logo.jpeg",
    stock: 70
  },
  {
    id: 34,
    name: "Diphenhydramine",
    price: 25,
    description: "Reduces allergy symptoms and itching.",
    category: "Antihistamine",
    image: "/src/assets/logo.jpeg",
    stock: 80
  },
  {
    id: 35,
    name: "Chlorpheniramine",
    price: 28,
    description: "Treats cold and allergy symptoms.",
    category: "Antihistamine",
    image: "/src/assets/logo.jpeg",
    stock: 90
  },

  // Antidiabetic Category
  {
    id: 46,
    name: "Metformin",
    price: 80,
    description: "Controls blood sugar levels in diabetes.",
    category: "Antidiabetic",
    image: "/src/assets/logo.jpeg",
    stock: 40
  },
  {
    id: 47,
    name: "Glipizide",
    price: 100,
    description: "Stimulates insulin secretion in type 2 diabetes.",
    category: "Antidiabetic",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 48,
    name: "Glyburide",
    price: 110,
    description: "Lowers blood glucose levels.",
    category: "Antidiabetic",
    image: "/src/assets/logo.jpeg",
    stock: 20
  },
  {
    id: 49,
    name: "Pioglitazone",
    price: 150,
    description: "Improves insulin sensitivity.",
    category: "Antidiabetic",
    image: "/src/assets/logo.jpeg",
    stock: 10
  },
  {
    id: 50,
    name: "Sitagliptin",
    price: 250,
    description: "Increases insulin release post-meal.",
    category: "Antidiabetic",
    image: "/src/assets/logo.jpeg",
    stock: 5
  },

  // Cardiovascular Category
  {
    id: 61,
    name: "Atorvastatin",
    price: 150,
    description: "Reduces cholesterol levels.",
    category: "Cardiovascular",
    image: "/src/assets/logo.jpeg",
    stock: 25
  },
  {
    id: 62,
    name: "Losartan",
    price: 90,
    description: "Treats high blood pressure.",
    category: "Cardiovascular",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 63,
    name: "Amlodipine",
    price: 85,
    description: "Used for hypertension and angina.",
    category: "Cardiovascular",
    image: "/src/assets/logo.jpeg",
    stock: 20
  },
  {
    id: 64,
    name: "Propranolol",
    price: 120,
    description: "Treats hypertension and anxiety.",
    category: "Cardiovascular",
    image: "/src/assets/logo.jpeg",
    stock: 15
  },
  {
    id: 65,
    name: "Ramipril",
    price: 140,
    description: "Used for heart failure and hypertension.",
    category: "Cardiovascular",
    image: "/src/assets/logo.jpeg",
    stock: 10
  },

  // Personal Care Category
  {
    id: 66,
    name: "Moisturizing Lotion",
    price: 200,
    description: "Hydrates and nourishes the skin.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 50
  },
  {
    id: 67,
    name: "Sunscreen SPF 50",
    price: 300,
    description: "Protects skin from harmful UV rays.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 40
  },
  {
    id: 68,
    name: "Lip Balm",
    price: 50,
    description: "Moisturizes and protects lips.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 60
  },
  {
    id: 69,
    name: "Hand Sanitizer",
    price: 100,
    description: "Kills 99.9% of germs.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 70
  },
  {
    id: 70,
    name: "Shampoo",
    price: 150,
    description: "Cleans and nourishes hair.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 80
  },

  // Health Supplements Category
  {
    id: 71,
    name: "Omega-3 Fish Oil",
    price: 400,
    description: "Supports heart and brain health.",
    category: "Health Supplements",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 72,
    name: "Multivitamins",
    price: 250,
    description: "Provides essential vitamins and minerals.",
    category: "Health Supplements",
    image: "/src/assets/logo.jpeg",
    stock: 25
  },
  {
    id: 73,
    name: "Probiotics",
    price: 300,
    description: "Supports digestive health.",
    category: "Health Supplements",
    image: "/src/assets/logo.jpeg",
    stock: 20
  },
  {
    id: 74,
    name: "Calcium Tablets",
    price: 150,
    description: "Supports bone health.",
    category: "Health Supplements",
    image: "/src/assets/logo.jpeg",
    stock: 15
  },
  {
    id: 75,
    name: "Vitamin D3",
    price: 200,
    description: "Supports immune function and bone health.",
    category: "Health Supplements",
    image: "/src/assets/logo.jpeg",
    stock: 10
  },

  // First Aid Supplies Category
  {
    id: 76,
    name: "Adhesive Bandages",
    price: 50,
    description: "Protects minor cuts and scrapes.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 100
  },
  {
    id: 77,
    name: "Antiseptic Cream",
    price: 100,
    description: "Prevents infection in minor cuts.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 80
  },
  {
    id: 78,
    name: "Gauze Pads",
    price: 80,
    description: "Used for dressing wounds.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 60
  },
  {
    id: 79,
    name: "Medical Tape",
    price: 30,
    description: "Secures dressings in place.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 90
  },
  {
    id: 80,
    name: "Thermometer",
    price: 200,
    description: "Measures body temperature.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 50
  },

  // Baby Care Products Category
  {
    id: 81,
    name: "Baby Diapers",
    price: 500,
    description: "Soft and absorbent diapers for babies.",
    category: "Baby Care Products",
    image: "/src/assets/logo.jpeg",
    stock: 200
  },
  {
    id: 82,
    name: "Baby Lotion",
    price: 250,
    description: "Gentle lotion for baby's skin.",
    category: "Baby Care Products",
    image: "/src/assets/logo.jpeg",
    stock: 150
  },
  {
    id: 83,
    name: "Baby Shampoo",
    price: 200,
    description: "Mild shampoo for babies.",
    category: "Baby Care Products",
    image: "/src/assets/logo.jpeg",
    stock: 100
  },
  {
    id: 84,
    name: "Baby Wipes",
    price: 150,
    description: "Soft wipes for cleaning babies.",
    category: "Baby Care Products",
    image: "/src/assets/logo.jpeg",
    stock: 250
  },
  {
    id: 85,
    name: "Pacifier",
    price: 100,
    description: "Soothes and calms babies.",
    category: "Baby Care Products",
    image: "/src/assets/logo.jpeg",
    stock: 300
  },

  // Home Health Care Items Category
  {
    id: 86,
    name: "Blood Pressure Monitor",
    price: 1500,
    description: "Monitors blood pressure at home.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 20
  },
  {
    id: 87,
    name: "Glucose Meter",
    price: 1200,
    description: "Measures blood sugar levels.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 15
  },
  {
    id: 88,
    name: "Therapeutic Heating Pad",
    price: 800,
    description: "Provides heat therapy for pain relief.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 10
  },
  {
    id: 89,
    name: "Nebulizer",
    price: 3000,
    description: "Used for asthma and respiratory issues.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 5
  },
  {
    id: 90,
    name: "First Aid Kit",
    price: 1000,
    description: "Comprehensive first aid supplies.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 25
  },

  // Additional products to reach 100 records
  {
    id: 91,
    name: "Cold Pack",
    price: 200,
    description: "Used for reducing swelling and pain.",
    category: "Home Health Care Items",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 92,
    name: "Elastic Bandage",
    price: 150,
    description: "Provides support and compression.",
    category: "First Aid Supplies",
    image: "/src/assets/logo.jpeg",
    stock: 40
  },
  {
    id: 93,
    name: "Surgical Mask",
    price: 50,
    description: "Protects against dust and germs.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 100
  },
  {
    id: 94,
    name: "Hand Cream",
    price: 100,
    description: "Moisturizes and protects hands.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 80
  },
  {
    id: 95,
    name: "Foot Cream",
    price: 120,
    description: "Relieves dry and cracked feet.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 60
  },
  {
    id: 96,
    name: "Hair Conditioner",
    price: 150,
    description: "Nourishes and detangles hair.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 70
  },
  {
    id: 97,
    name: "Body Wash",
    price: 200,
    description: "Cleans and refreshes skin.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 50
  },
  {
    id: 98,
    name: "Facial Cleanser",
    price: 250,
    description: "Gently cleanses the face.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 40
  },
  {
    id: 99,
    name: "Deodorant",
    price: 150,
    description: "Keeps you fresh all day.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 30
  },
  {
    id: 100,
    name: "Toothpaste",
    price: 80,
    description: "Cleans and protects teeth.",
    category: "Personal Care",
    image: "/src/assets/logo.jpeg",
    stock: 100
  }
];

export default products;
