from django.core.management.base import BaseCommand
from products.models import Product

SAMPLE_PRODUCTS = [
    # Bags (8 items)
    {
        "name": "Urban Commuter Roll-Top Backpack",
        "category": "Bags",
        "price": 110.00,
        "stock": 22,
        "description": "Weather-resistant recycled Cordura rolltop backpack with padded 16-inch laptop compartment, ergonomic shoulder straps, and hidden passport pocket.",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Heritage Canvas Weekend Duffel",
        "category": "Bags",
        "price": 145.00,
        "stock": 15,
        "description": "Heavy-duty 18oz water-repellent canvas travel duffel featuring bridle leather handles, solid brass hardware, and a removable shoulder strap.",
        "image": "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Minimalist Crossbody Parcel Pouch",
        "category": "Bags",
        "price": 45.00,
        "stock": 38,
        "description": "Compact hands-free sling bag made from durable nylon with quick-release magnetic buckle and dual zip organization pockets.",
        "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Artisan Leather Tote Bag",
        "category": "Bags",
        "price": 128.00,
        "stock": 19,
        "description": "Handcrafted full-grain oiled leather tote with reinforced base, interior laptop sleeve, and botanical brass rivets.",
        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Everyday Canvas Messenger Bag",
        "category": "Bags",
        "price": 85.00,
        "stock": 26,
        "description": "Structured washed canvas courier messenger with storm flap closure, padded tablet sleeve, and magnetic quick-access front pockets.",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Summit Technical Daypack 24L",
        "category": "Bags",
        "price": 130.00,
        "stock": 17,
        "description": "Ultra-lightweight ripstop daypack with ventilated air-mesh back panel, hydration bladder reservoir, and integrated rain cover.",
        "image": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Terra Botanical Belt Bag",
        "category": "Bags",
        "price": 38.00,
        "stock": 40,
        "description": "Versatile waist or crossbody hip pack in forest green with waterproof zippers and dual exterior key clips.",
        "image": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Modular Modular Tech Briefcase",
        "category": "Bags",
        "price": 160.00,
        "stock": 11,
        "description": "Sleek professional briefcase with 3-way carry modes (backpack, shoulder, briefcase) crafted from ballistic nylon.",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },

    # Electronics (7 items)
    {
        "name": "Transt Horizon Wireless ANC Headphones",
        "category": "Electronics",
        "price": 149.99,
        "stock": 35,
        "description": "Premium active noise cancelling over-ear headphones with 40-hour battery life, plush memory foam earcups, and custom-tuned botanical acoustic drivers.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Pulse Pro Smart Fitness Tracker",
        "category": "Electronics",
        "price": 79.50,
        "stock": 42,
        "description": "Sleek biometric activity band with continuous heart rate monitoring, sleep staging analytics, 50m water resistance, and crisp AMOLED touch display.",
        "image": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Acoustic Mini Portable Speaker",
        "category": "Electronics",
        "price": 59.00,
        "stock": 28,
        "description": "Compact 360-degree wireless speaker housed in textured woven fabric with deep bass resonance and 16 hours of playback per charge.",
        "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Studio Mechanical Wireless Keyboard",
        "category": "Electronics",
        "price": 119.00,
        "stock": 20,
        "description": "Low-profile mechanical tactile keyboard with custom lubricated switches, RGB backlighting, and Bluetooth 5.2 multi-device pairing.",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Precision Ergonomic Optical Mouse",
        "category": "Electronics",
        "price": 49.00,
        "stock": 33,
        "description": "Ergonomic 57-degree vertical wireless mouse designed to reduce wrist strain, with hyper-fast scroll wheel and USB-C recharging.",
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Transt True-Wireless Earbuds Pro",
        "category": "Electronics",
        "price": 89.00,
        "stock": 25,
        "description": "In-ear spatial audio earbuds with transparency mode, IPX7 sweat resistance, and wireless Qi charging case.",
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Desk Dual Wireless Charging Pad",
        "category": "Electronics",
        "price": 42.00,
        "stock": 30,
        "description": "Hand-stitched Italian leather and weighted aluminum dual 15W fast charging mat for phones and accessories.",
        "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    },

    # Fashion (6 items)
    {
        "name": "Botanical Washed Linen Overshirt",
        "category": "Fashion",
        "price": 68.00,
        "stock": 25,
        "description": "Breathable 100% French flax linen shirt in earthy sage tone. Features natural horn buttons, relaxed tailoring, and dual chest parcel pockets.",
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Merino Wool Knit Crewneck",
        "category": "Fashion",
        "price": 95.00,
        "stock": 18,
        "description": "Ultra-soft ethically sourced extrafine merino wool sweater in a warm oatmeal heather knit with ribbed cuffs and hem.",
        "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Everyday Organic Cotton Utility Jacket",
        "category": "Fashion",
        "price": 120.00,
        "stock": 14,
        "description": "Heavyweight organic cotton twill chore coat with reinforced stitching, deep utility pockets, and a timeless boxy silhouette.",
        "image": "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Heavyweight Essential Heavy Tee",
        "category": "Fashion",
        "price": 34.00,
        "stock": 48,
        "description": "240gsm combed heavyweight organic cotton t-shirt with classic crew neck and pre-shrunk botanical wash.",
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Relaxed Tapered Selvedge Chinos",
        "category": "Fashion",
        "price": 88.00,
        "stock": 22,
        "description": "Custom-woven Japanese twill cotton trousers with relaxed thigh and gentle taper, finished with corozo button fly.",
        "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Thermal Waffle Knit Henley",
        "category": "Fashion",
        "price": 54.00,
        "stock": 31,
        "description": "Warm textured waffle-stitch long sleeve henley with 3-button placket and reinforced flatlock seams.",
        "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    },

    # Shoes (6 items)
    {
        "name": "Velocity All-Terrain Trail Runners",
        "category": "Shoes",
        "price": 135.00,
        "stock": 20,
        "description": "Lightweight trail running sneakers engineered with responsive EVA cushioning, breathable ripstop mesh, and multidirectional rubber traction outsoles.",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Terra Handcrafted Leather Loafers",
        "category": "Shoes",
        "price": 165.00,
        "stock": 12,
        "description": "Full-grain vegetable-tanned leather slip-ons with cushioned leather footbed and durable stacked leather sole with rubber heel cap.",
        "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Minimalist Canvas Low-Top Sneakers",
        "category": "Shoes",
        "price": 64.00,
        "stock": 30,
        "description": "Classic unbleached natural canvas sneakers with vulcanized rubber soles and supportive orthotic insoles for daily urban transit.",
        "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Suede Chelsea Urban Boots",
        "category": "Shoes",
        "price": 175.00,
        "stock": 16,
        "description": "Water-resistant oiled suede Chelsea boots with elastic side gussets, pull tabs, and shock-absorbing crepe rubber outsoles.",
        "image": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Retro Court Heritage Sneaker",
        "category": "Shoes",
        "price": 98.00,
        "stock": 24,
        "description": "Nappa leather court sneakers with perforated toe box, gum rubber sole, and contrast forest heel tab.",
        "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Cushioned Trekking Sandal",
        "category": "Shoes",
        "price": 55.00,
        "stock": 28,
        "description": "Adjustable triple-strap adventure sandal with anatomical arch support and quick-drying hydrophobic webbing.",
        "image": "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=800&q=80"
    },

    # Watches (6 items)
    {
        "name": "Chrono Field Watch Sand Edition",
        "category": "Watches",
        "price": 185.00,
        "stock": 16,
        "description": "Tactical field watch with sand-colored dial, sapphire crystal glass, Japanese quartz chronograph movement, and olive canvas strap.",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Minimalist Bauhaus Olive Watch",
        "category": "Watches",
        "price": 155.00,
        "stock": 19,
        "description": "Clean dial with minimalist indices, matte stainless steel case, and quick-release supple Italian leather strap in botanical green.",
        "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Solar Meridian Automatic Watch",
        "category": "Watches",
        "price": 220.00,
        "stock": 10,
        "description": "Self-winding mechanical automatic timepiece with 42-hour power reserve, exhibition caseback, and 100m water resistance.",
        "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Aero Diver 200M Steel Watch",
        "category": "Watches",
        "price": 245.00,
        "stock": 14,
        "description": "Professional 200m diver watch featuring unidirectional ceramic bezel, luminous Super-LumiNova markers, and solid link bracelet.",
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Classic Rose Gold Dress Watch",
        "category": "Watches",
        "price": 140.00,
        "stock": 21,
        "description": "Ultra-slim 38mm dress watch with sunray champagne dial, domed mineral crystal, and embossed alligator-grain leather band.",
        "image": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Tactical Matte Black Stealth Watch",
        "category": "Watches",
        "price": 170.00,
        "stock": 18,
        "description": "Monochrome PVD matte black coated case with high-contrast numerals, date aperture, and durable silicone sport strap.",
        "image": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
    },

    # Home & Lifestyle (6 items)
    {
        "name": "Botanical Ceramic Stoneware Vessel",
        "category": "Home & Lifestyle",
        "price": 54.00,
        "stock": 24,
        "description": "Wheel-thrown artisanal ceramic vase with textured matte cream glaze, ideal for fresh seasonal foliage or dried florals.",
        "image": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Pure Cedarwood & Amber Soy Candle",
        "category": "Home & Lifestyle",
        "price": 28.00,
        "stock": 50,
        "description": "Hand-poured 100% natural soy wax candle infused with essential oils of Virginian cedarwood, smoky amber, and crisp bergamot.",
        "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Solid Walnut Desk Valet Organizer",
        "category": "Home & Lifestyle",
        "price": 48.00,
        "stock": 20,
        "description": "Hand-finished solid American walnut organizer tray with precision carve-outs for keys, phone, writing instruments, and daily accessories.",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "French Press Matte Coffee Maker",
        "category": "Home & Lifestyle",
        "price": 45.00,
        "stock": 35,
        "description": "Double-walled vacuum insulated stainless steel coffee press that keeps brews piping hot for hours without bitterness.",
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Hand-Woven Organic Cotton Throw",
        "category": "Home & Lifestyle",
        "price": 65.00,
        "stock": 19,
        "description": "Soft jacquard patterned throw blanket with tasseled fringe in neutral sand and deep botanical forest accents.",
        "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Minimalist Matte Plant Stand",
        "category": "Home & Lifestyle",
        "price": 36.00,
        "stock": 27,
        "description": "Powder-coated steel architectural plant stand elevating indoor botanicals with subtle modern elegance.",
        "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"
    },

    # Beauty (6 items)
    {
        "name": "Botanical Hydrating Facial Mist",
        "category": "Beauty",
        "price": 32.00,
        "stock": 45,
        "description": "Revitalizing face mist formulated with organic rosewater, green tea extract, and hyaluronic acid to lock in dewy hydration.",
        "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Restorative Herbal Botanical Facial Serum",
        "category": "Beauty",
        "price": 58.00,
        "stock": 32,
        "description": "Cold-pressed nutrient-dense facial oil blend with rosehip seed, jojoba, and vitamin E to nourish and protect skin barrier.",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Nourishing Avocado & Clay Face Mask",
        "category": "Beauty",
        "price": 26.00,
        "stock": 38,
        "description": "Detoxifying French green clay mask enriched with raw avocado butter and spirulina to unclog pores and soften skin.",
        "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Organic Rosemary Scalp & Hair Oil",
        "category": "Beauty",
        "price": 29.00,
        "stock": 40,
        "description": "Stimulating rosemary, peppermint, and castor oil infusion designed to strengthen follicles and add vibrant shine.",
        "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Botanical Citrus & Bergamot Body Wash",
        "category": "Beauty",
        "price": 22.00,
        "stock": 52,
        "description": "Sulfate-free gentle foaming gel cleanser infused with wild bergamot, grapefruit peel, and soothing aloe vera.",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Ultra-Rich Botanical Hand Balm",
        "category": "Beauty",
        "price": 18.00,
        "stock": 60,
        "description": "Fast-absorbing restorative hand cream with shea butter, squalane, and calming cedarwood herbal notes.",
        "image": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    }
]

class Command(BaseCommand):
    help = 'Seeds the database with 20 realistic sample products for the Transt catalog'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting Transt products seeding...'))

        created_count = 0
        updated_count = 0

        for item in SAMPLE_PRODUCTS:
            product, created = Product.objects.update_or_create(
                name=item['name'],
                defaults={
                    'category': item['category'],
                    'price': item['price'],
                    'stock': item['stock'],
                    'description': item['description'],
                    'image': item['image'],
                }
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        total_count = Product.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded products! (Created: {created_count}, Updated: {updated_count}, Total in Catalog: {total_count})'
            )
        )
