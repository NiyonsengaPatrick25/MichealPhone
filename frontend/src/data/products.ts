import type { Product, Category } from "../types";

const IMG = {
  p1: "/images/phone-1.jpg",
  p2: "/images/phone-2.jpg",
  p3: "/images/phone-3.jpg",
  l1: "/images/laptop-1.jpg",
  l2: "/images/laptop-2.jpg",
  a1: "/images/accessory-1.jpg",
  a2: "/images/accessory-2.jpg",
};

type Raw = [
  name: string,
  brand: string,
  image: string,
  oldPrice: number,
  newPrice: number,
  rating: number,
  stock: number,
  featured: boolean,
  trending: boolean,
  description: string
];

function make(category: Category, prefix: string, raws: Raw[]): Product[] {
  return raws.map((r, i) => ({
    id: `${prefix}-${i + 1}`,
    name: r[0],
    brand: r[1],
    category,
    image: r[2],
    oldPrice: r[3],
    newPrice: r[4],
    rating: r[5],
    stock: r[6],
    featured: r[7],
    trending: r[8],
    description: r[9],
    createdAt: new Date(2025, 11 - (i % 11), 28 - i).toISOString(),
  }));
}

const phones = make("Smartphones", "ph", [
  ["iPhone 16 Pro Max 256GB", "Apple", IMG.p1, 2100000, 1950000, 4.9, 12, true, true, "Apple's flagship with A18 Pro chip, titanium frame, 6.9-inch Super Retina XDR display and pro-grade triple camera system."],
  ["iPhone 16 128GB", "Apple", IMG.p2, 1450000, 1350000, 4.8, 18, true, false, "The new iPhone 16 with A18 chip, Camera Control button and all-day battery life."],
  ["iPhone 15 Pro 128GB", "Apple", IMG.p3, 1600000, 1420000, 4.8, 9, false, true, "iPhone 15 Pro with titanium design, A17 Pro chip and 48MP main camera."],
  ["iPhone 15 128GB", "Apple", IMG.p1, 1250000, 1150000, 4.7, 20, false, false, "iPhone 15 with Dynamic Island, 48MP camera and USB-C."],
  ["iPhone 14 128GB", "Apple", IMG.p2, 980000, 880000, 4.6, 25, false, false, "Reliable iPhone 14 with A15 Bionic, great cameras and crash detection."],
  ["iPhone 13 128GB", "Apple", IMG.p3, 780000, 690000, 4.6, 30, false, true, "iPhone 13 — the best-value iPhone with excellent battery and dual cameras."],
  ["Galaxy S25 Ultra 256GB", "Samsung", IMG.p1, 1850000, 1700000, 4.9, 10, true, true, "Samsung's ultimate flagship with 200MP camera, S Pen and Galaxy AI."],
  ["Galaxy S25 128GB", "Samsung", IMG.p2, 1250000, 1150000, 4.7, 16, true, false, "Compact flagship power with Snapdragon 8 Elite and Galaxy AI features."],
  ["Galaxy S24 FE 128GB", "Samsung", IMG.p3, 850000, 760000, 4.5, 22, false, false, "Fan Edition flagship experience at a smarter price."],
  ["Galaxy Z Flip6", "Samsung", IMG.p1, 1450000, 1290000, 4.6, 8, true, true, "Pocketable foldable with FlexCam and a stunning cover screen."],
  ["Galaxy A55 5G 128GB", "Samsung", IMG.p2, 520000, 460000, 4.4, 35, false, true, "Mid-range hero with Super AMOLED display and 50MP OIS camera."],
  ["Galaxy A35 5G 128GB", "Samsung", IMG.p3, 380000, 340000, 4.3, 40, false, false, "Stylish 5G phone with great battery and a smooth 120Hz screen."],
  ["Galaxy A15 128GB", "Samsung", IMG.p1, 200000, 175000, 4.2, 50, false, false, "Affordable everyday phone with big AMOLED display."],
  ["Pixel 9 Pro 256GB", "Google", IMG.p2, 1500000, 1380000, 4.8, 11, true, true, "Google's smartest phone with Gemini AI and the best Android camera."],
  ["Pixel 9 128GB", "Google", IMG.p3, 1100000, 990000, 4.7, 14, false, false, "Pixel 9 with Tensor G4, gorgeous design and 7 years of updates."],
  ["Pixel 8a 128GB", "Google", IMG.p1, 650000, 580000, 4.5, 19, false, true, "Best-value Pixel with flagship camera smarts."],
  ["Xiaomi 14T Pro 512GB", "Xiaomi", IMG.p2, 950000, 850000, 4.6, 15, true, false, "Leica optics, Dimensity 9300+ and 120W HyperCharge."],
  ["Xiaomi Redmi Note 14 Pro", "Xiaomi", IMG.p3, 420000, 370000, 4.4, 38, false, true, "200MP camera, AMOLED 120Hz display, incredible value."],
  ["Xiaomi Redmi Note 14", "Xiaomi", IMG.p1, 300000, 265000, 4.3, 45, false, false, "Dependable performer with big battery and clean design."],
  ["Xiaomi Redmi 14C", "Xiaomi", IMG.p2, 140000, 120000, 4.1, 60, false, false, "Entry-level champion with large display and 5160mAh battery."],
  ["Poco X7 Pro 256GB", "Xiaomi", IMG.p3, 450000, 395000, 4.5, 24, false, true, "Flagship-killer performance for gamers on a budget."],
  ["Tecno Phantom V2 Fold", "Tecno", IMG.p1, 1300000, 1150000, 4.4, 6, true, false, "Affordable foldable with stunning LTPO AMOLED displays."],
  ["Tecno Camon 30 Premier", "Tecno", IMG.p2, 520000, 455000, 4.3, 26, false, true, "PolarAce imaging system with Sony LYT-701 sensor."],
  ["Tecno Spark 30 Pro", "Tecno", IMG.p3, 220000, 190000, 4.2, 48, false, false, "Slim design, 108MP camera and 120Hz AMOLED."],
  ["Infinix Note 40 Pro", "Infinix", IMG.p1, 320000, 280000, 4.3, 33, false, true, "All-round active display, 108MP OIS camera and MagCharge."],
  ["Infinix Hot 50 Pro", "Infinix", IMG.p2, 180000, 155000, 4.1, 55, false, false, "Slimmest in class with stereo speakers and big battery."],
  ["OnePlus 13 256GB", "OnePlus", IMG.p3, 1350000, 1240000, 4.8, 9, true, true, "Snapdragon 8 Elite, Hasselblad cameras and 100W charging."],
  ["OnePlus Nord 4 256GB", "OnePlus", IMG.p1, 620000, 550000, 4.5, 21, false, false, "Metal unibody design with flagship-grade performance."],
  ["Huawei Pura 70 Pro", "Huawei", IMG.p2, 1200000, 1080000, 4.5, 7, false, false, "Ultra Lighting camera with stunning XMAGE photography."],
  ["Nokia G42 5G", "Nokia", IMG.p3, 190000, 165000, 4.0, 42, false, false, "Repairable 5G phone with 3-day battery life."],
]);

const laptops = make("Laptops", "lp", [
  ["MacBook Pro 14 M4 512GB", "Apple", IMG.l1, 3200000, 2950000, 4.9, 8, true, true, "M4 power with Liquid Retina XDR display — the ultimate pro laptop."],
  ["MacBook Air 13 M3 256GB", "Apple", IMG.l1, 2100000, 1890000, 4.8, 14, true, true, "Impossibly thin, silent and fast with all-day battery."],
  ["Dell XPS 13 Plus", "Dell", IMG.l2, 2300000, 2050000, 4.6, 10, true, false, "Futuristic design, InfinityEdge OLED display and Intel Core Ultra."],
  ["Dell Inspiron 15 3530", "Dell", IMG.l1, 950000, 850000, 4.3, 22, false, false, "Reliable everyday laptop for work and study."],
  ["HP Spectre x360 14", "HP", IMG.l2, 2400000, 2150000, 4.7, 7, true, false, "Convertible luxury with OLED touch display and stylus support."],
  ["HP Pavilion 15", "HP", IMG.l1, 1100000, 980000, 4.4, 19, false, true, "Balanced performance with sleek design for everyday productivity."],
  ["Lenovo ThinkPad X1 Carbon G12", "Lenovo", IMG.l2, 2600000, 2350000, 4.8, 6, false, true, "Legendary business durability, feather-light carbon build."],
  ["Lenovo IdeaPad Slim 5", "Lenovo", IMG.l1, 850000, 760000, 4.4, 25, false, false, "Slim aluminum body, Ryzen power, superb value."],
  ["ASUS ROG Zephyrus G14", "ASUS", IMG.l2, 2800000, 2520000, 4.7, 5, true, true, "Compact gaming beast with RTX graphics and Nebula display."],
  ["Acer Aspire 5 15", "Acer", IMG.l1, 780000, 690000, 4.2, 28, false, false, "Affordable workhorse with crisp Full HD display."],
]);

const accessories = make("Accessories", "ac", [
  ["AirPods Pro 2 (USB-C)", "Apple", IMG.a1, 320000, 285000, 4.8, 30, true, true, "Industry-leading noise cancellation with Adaptive Audio."],
  ["Galaxy Buds3 Pro", "Samsung", IMG.a1, 250000, 220000, 4.6, 26, false, true, "Hi-Fi sound, ANC and Galaxy AI translation."],
  ["Apple Watch Series 10", "Apple", IMG.a2, 550000, 495000, 4.8, 15, true, true, "Thinner, faster, brighter — the ultimate health companion."],
  ["Galaxy Watch7 44mm", "Samsung", IMG.a2, 380000, 335000, 4.5, 18, false, false, "Advanced sleep coaching and energy score on Wear OS."],
  ["Anker 65W GaN Charger", "Anker", IMG.a1, 55000, 45000, 4.7, 60, false, true, "Charge laptop and phone together with one compact brick."],
  ["Anker PowerCore 20K mAh", "Anker", IMG.a1, 75000, 62000, 4.6, 55, false, false, "Massive 20,000mAh power bank with fast USB-C PD."],
  ["JBL Tune 770NC Headphones", "JBL", IMG.a1, 145000, 125000, 4.5, 32, false, false, "Wireless over-ear ANC with 70 hours battery life."],
  ["Xiaomi Smart Band 9", "Xiaomi", IMG.a2, 65000, 55000, 4.4, 70, false, true, "Bright AMOLED, 21-day battery, 150+ sport modes."],
  ["Spigen Tough Armor Case", "Spigen", IMG.a1, 35000, 28000, 4.6, 90, false, false, "Military-grade drop protection with kickstand."],
  ["SanDisk Extreme 1TB SSD", "SanDisk", IMG.a1, 180000, 155000, 4.7, 25, true, false, "Pocket-size rugged SSD with 1050MB/s speeds."],
]);

export const products: Product[] = [...phones, ...laptops, ...accessories];

export const allBrands: string[] = [...new Set(products.map((p) => p.brand))].sort();

export const categories: { name: Category; image: string; count: number; tagline: string }[] = [
  { name: "Smartphones", image: IMG.p1, count: phones.length, tagline: "Flagships & budget heroes" },
  { name: "Laptops", image: IMG.l1, count: laptops.length, tagline: "Power for work & play" },
  { name: "Accessories", image: IMG.a1, count: accessories.length, tagline: "Complete your setup" },
];
