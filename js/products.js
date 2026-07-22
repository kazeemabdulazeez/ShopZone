
// JavaScript code for products.js
// This file contains the product data for the ShopZone website.
    /*==================================================
                SHOPZONE PRODUCTS
==================================================*/

const products = [

    /*=========================================
                SMARTPHONES
    =========================================*/

    {
        id: 1,
        name: "iPhone 16 Pro",
        category: "smartphones",
        brand: "Apple",
        price: 999,
        oldPrice: 1099,
        rating: 4.9,
        reviews: 248,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: false,
        image: "images/products/iphone16pro.png"
    },

    {
        id: 2,
        name: "iPhone 17 Pro Max",
        category: "smartphones",
        brand: "Apple",
        price: 1299,
        oldPrice: 1399,
        rating: 5.0,
        reviews: 135,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/iphone17promax.png"
    },

    {
        id: 3,
        name: "Samsung Galaxy S25 Ultra",
        category: "smartphones",
        brand: "Samsung",
        price: 1199,
        oldPrice: 1299,
        rating: 4.9,
        reviews: 190,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/s25ultra.png"
    },

    {
        id: 4,
        name: "Samsung Galaxy Z Fold7",
        category: "smartphones",
        brand: "Samsung",
        price: 1899,
        oldPrice: 1999,
        rating: 4.8,
        reviews: 86,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: false,
        image: "images/products/zfold7.png"
    },

    {
        id: 5,
        name: "Google Pixel 9 Pro",
        category: "smartphones",
        brand: "Google",
        price: 999,
        oldPrice: 1099,
        rating: 4.8,
        reviews: 176,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/pixel9pro.png"
    },

    {
        id: 6,
        name: "OnePlus 13",
        category: "smartphones",
        brand: "OnePlus",
        price: 899,
        oldPrice: 999,
        rating: 4.8,
        reviews: 154,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/oneplus13.png"
    },

    {
        id: 7,
        name: "Xiaomi 15 Ultra",
        category: "smartphones",
        brand: "Xiaomi",
        price: 1099,
        oldPrice: 1199,
        rating: 4.9,
        reviews: 143,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/xiaomi15ultra.png"
    },

    {
        id: 8,
        name: "TECNO Camon 40 Premier",
        category: "smartphones",
        brand: "TECNO",
        price: 599,
        oldPrice: 649,
        rating: 4.6,
        reviews: 98,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/camon40premier.png"
    },


    /*=========================================
                    LAPTOPS
    =========================================*/

    {
        id: 9,
        name: "MacBook Air M4",
        category: "laptops",
        brand: "Apple",
        price: 1199,
        oldPrice: 1299,
        rating: 4.9,
        reviews: 265,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/macbookairm4.png"
    },

    {
        id: 10,
        name: "MacBook Pro M4",
        category: "laptops",
        brand: "Apple",
        price: 1999,
        oldPrice: 2199,
        rating: 5.0,
        reviews: 189,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/macbookprom4.png"
    },

    {
        id: 11,
        name: "Dell XPS 13",
        category: "laptops",
        brand: "Dell",
        price: 1499,
        oldPrice: 1599,
        rating: 4.8,
        reviews: 144,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/dellxps13.png"
    },

    {
        id: 12,
        name: "HP Spectre x360",
        category: "laptops",
        brand: "HP",
        price: 1599,
        oldPrice: 1699,
        rating: 4.8,
        reviews: 132,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/hpspectrex360.png"
    },

        {
        id: 13,
        name: "Lenovo ThinkPad X1 Carbon Gen 13",
        category: "laptops",
        brand: "Lenovo",
        price: 1849,
        oldPrice: 1949,
        rating: 4.9,
        reviews: 118,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/thinkpadx1carbon.png"
    },

    {
        id: 14,
        name: "ASUS ROG Zephyrus G16",
        category: "laptops",
        brand: "ASUS",
        price: 2099,
        oldPrice: 2249,
        rating: 4.9,
        reviews: 167,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: true,
        image: "images/products/rogg16.png"
    },

    {
        id: 15,
        name: "Acer Predator Helios Neo 16",
        category: "laptops",
        brand: "Acer",
        price: 1699,
        oldPrice: 1799,
        rating: 4.8,
        reviews: 101,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/predatorneo16.png"
    },

    {
        id: 16,
        name: "Microsoft Surface Laptop 7",
        category: "laptops",
        brand: "Microsoft",
        price: 1399,
        oldPrice: 1499,
        rating: 4.7,
        reviews: 94,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/surfacelaptop7.png"
    },

    /*=========================================
                    GAMING
    =========================================*/

    {
        id: 17,
        name: "PlayStation 5 Slim",
        category: "gaming",
        brand: "Sony",
        price: 499,
        oldPrice: 549,
        rating: 4.9,
        reviews: 356,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: false,
        image: "images/products/ps5slim.png"
    },

    {
        id: 18,
        name: "Xbox Series X",
        category: "gaming",
        brand: "Microsoft",
        price: 499,
        oldPrice: 549,
        rating: 4.9,
        reviews: 298,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: false,
        image: "images/products/xboxseriesx.png"
    },

    {
        id: 19,
        name: "Nintendo Switch OLED",
        category: "gaming",
        brand: "Nintendo",
        price: 349,
        oldPrice: 399,
        rating: 4.8,
        reviews: 421,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/switcholed.png"
    },

    {
        id: 20,
        name: "Logitech G Pro X Superlight 2",
        category: "gaming",
        brand: "Logitech",
        price: 159,
        oldPrice: 179,
        rating: 4.9,
        reviews: 182,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/gproxsuperlight2.png"
    },

        {
        id: 21,
        name: "Logitech G915 X Keyboard",
        category: "gaming",
        brand: "Logitech",
        price: 249,
        oldPrice: 279,
        rating: 4.8,
        reviews: 147,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/logitechg915x.png"
    },

    {
        id: 22,
        name: "Razer BlackShark V2 Pro",
        category: "gaming",
        brand: "Razer",
        price: 199,
        oldPrice: 229,
        rating: 4.8,
        reviews: 126,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/blacksharkv2pro.png"
    },

    {
        id: 23,
        name: "SteelSeries Arctis Nova 7",
        category: "gaming",
        brand: "SteelSeries",
        price: 179,
        oldPrice: 199,
        rating: 4.7,
        reviews: 118,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/arctisnova7.png"
    },

    {
        id: 24,
        name: "ASUS ROG Ally X",
        category: "gaming",
        brand: "ASUS",
        price: 799,
        oldPrice: 849,
        rating: 4.9,
        reviews: 156,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: true,
        image: "images/products/rogallyx.png"
    },

    /*=========================================
                    AUDIO
    =========================================*/

    {
        id: 25,
        name: "AirPods Pro (2nd generation)",
        category: "audio",
        brand: "Apple",
        price: 249,
        oldPrice: 279,
        rating: 4.9,
        reviews: 412,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: false,
        image: "images/products/airpodspro2.png"
    },

    {
        id: 26,
        name: "Sony WH-1000XM5",
        category: "audio",
        brand: "Sony",
        price: 399,
        oldPrice: 449,
        rating: 4.9,
        reviews: 284,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: false,
        image: "images/products/sonywh1000xm5.png"
    },

    {
        id: 27,
        name: "Samsung Galaxy Buds3 Pro",
        category: "audio",
        brand: "Samsung",
        price: 249,
        oldPrice: 279,
        rating: 4.8,
        reviews: 175,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/galaxybuds3pro.png"
    },

    {
        id: 28,
        name: "JBL Charge 5",
        category: "audio",
        brand: "JBL",
        price: 179,
        oldPrice: 199,
        rating: 4.8,
        reviews: 221,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/jblcharge5.png"
    },

        {
        id: 29,
        name: "Beats Studio Pro",
        category: "audio",
        brand: "Beats",
        price: 349,
        oldPrice: 399,
        rating: 4.8,
        reviews: 168,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/beatsstudiopro.png"
    },

    {
        id: 30,
        name: "Bose QuietComfort Ultra",
        category: "audio",
        brand: "Bose",
        price: 429,
        oldPrice: 479,
        rating: 4.9,
        reviews: 236,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/boseqcultra.png"
    },

    {
        id: 31,
        name: "Sony WF-1000XM5",
        category: "audio",
        brand: "Sony",
        price: 299,
        oldPrice: 329,
        rating: 4.9,
        reviews: 214,
        stock: true,
        featured: true,
        flashSale: true,
        newArrival: false,
        image: "images/products/sonywf1000xm5.png"
    },

    {
        id: 32,
        name: "JBL Flip 7",
        category: "audio",
        brand: "JBL",
        price: 149,
        oldPrice: 169,
        rating: 4.7,
        reviews: 152,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/jblflip7.png"
    },

    /*=========================================
                    ACCESSORIES
    =========================================*/

    {
        id: 33,
        name: "Apple Watch Ultra 2",
        category: "accessories",
        brand: "Apple",
        price: 799,
        oldPrice: 849,
        rating: 4.9,
        reviews: 197,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: false,
        image: "images/products/applewatchultra2.png"
    },

    {
        id: 34,
        name: "Samsung Galaxy Watch Ultra",
        category: "accessories",
        brand: "Samsung",
        price: 649,
        oldPrice: 699,
        rating: 4.8,
        reviews: 143,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/galaxywatchultra.png"
    },

    {
        id: 35,
        name: "Logitech MX Master 3S",
        category: "accessories",
        brand: "Logitech",
        price: 99,
        oldPrice: 119,
        rating: 4.9,
        reviews: 318,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: false,
        image: "images/products/mxmaster3s.png"
    },

    {
        id: 36,
        name: "Logitech MX Keys S",
        category: "accessories",
        brand: "Logitech",
        price: 119,
        oldPrice: 139,
        rating: 4.8,
        reviews: 205,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/mxkeyss.png"
    },

        {
        id: 37,
        name: "Anker Prime Power Bank 27650mAh",
        category: "accessories",
        brand: "Anker",
        price: 179,
        oldPrice: 199,
        rating: 4.9,
        reviews: 174,
        stock: true,
        featured: true,
        flashSale: false,
        newArrival: true,
        image: "images/products/ankerprime27650.png"
    },

    {
        id: 38,
        name: "Samsung T9 Portable SSD 2TB",
        category: "accessories",
        brand: "Samsung",
        price: 249,
        oldPrice: 279,
        rating: 4.9,
        reviews: 162,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: true,
        image: "images/products/samsungt9ssd.png"
    },

    {
        id: 39,
        name: "SanDisk Extreme Pro SD Card 256GB",
        category: "accessories",
        brand: "SanDisk",
        price: 89,
        oldPrice: 99,
        rating: 4.8,
        reviews: 287,
        stock: true,
        featured: false,
        flashSale: true,
        newArrival: false,
        image: "images/products/sandisk256gb.png"
    },

    {
        id: 40,
        name: "Belkin 3-in-1 MagSafe Charger",
        category: "accessories",
        brand: "Belkin",
        price: 149,
        oldPrice: 169,
        rating: 4.8,
        reviews: 141,
        stock: true,
        featured: false,
        flashSale: false,
        newArrival: true,
        image: "images/products/belkin3in1.png"
    }

];


/*==================================================
                HELPER FUNCTIONS
==================================================*/

function getProductById(id) {

    return products.find(product => product.id === Number(id));

}

function getProductsByCategory(category) {

    return products.filter(product => product.category === category);

}

function getFeaturedProducts() {

    return products.filter(product => product.featured);

}

function getFlashSaleProducts() {

    return products.filter(product => product.flashSale);

}

function getNewArrivalProducts() {

    return products.filter(product => product.newArrival);

}

function getInStockProducts() {

    return products.filter(product => product.stock);

}

function searchProducts(keyword) {

    const search = keyword.toLowerCase();

    return products.filter(product =>

        product.name.toLowerCase().includes(search) ||

        product.brand.toLowerCase().includes(search) ||

        product.category.toLowerCase().includes(search)

    );

}

function sortProductsByPriceLowHigh() {

    return [...products].sort((a, b) => a.price - b.price);

}

function sortProductsByPriceHighLow() {

    return [...products].sort((a, b) => b.price - a.price);

}

function sortProductsByName() {

    return [...products].sort((a, b) =>

        a.name.localeCompare(b.name)

    );

}