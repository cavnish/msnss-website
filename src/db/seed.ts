import "dotenv/config";
import { db } from "./index";
import {
  adminUsers,
  heroSlides,
  products,
  projects,
  clients,
  services,
} from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding MSNSS database...");

  // Clear existing
  await db.delete(heroSlides);
  await db.delete(products);
  await db.delete(projects);
  await db.delete(clients);
  await db.delete(services);
  await db.delete(adminUsers);

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    email: "admin@msnss.com",
    passwordHash,
    name: "MSNSS Admin",
  });

  // Hero slides
  await db.insert(heroSlides).values([
    {
      title: "Precision Ducting. Reliable Execution.",
      subtitle:
        "MS & SS HVAC ducting made, fabricated and fitted for commercial, industrial and infrastructure projects.",
      supportingLine:
        "Engineered for quality. Manufactured for performance. Delivered for your project.",
      imageUrl: "/images/hero-1.jpg",
      primaryCtaLabel: "Get a Quote",
      primaryCtaLink: "/contact",
      secondaryCtaLabel: "View Our Products",
      secondaryCtaLink: "/products",
      sortOrder: 1,
    },
    {
      title: "Manufacturer. Fabricator. Installer.",
      subtitle:
        "One team for your full ducting need — from drawing to dispatch to site installation.",
      supportingLine: "2,000 SQM monthly production capacity at our Vasai plant.",
      imageUrl: "/images/hero-2.jpg",
      primaryCtaLabel: "Explore Services",
      primaryCtaLink: "/solutions",
      secondaryCtaLabel: "Our Projects",
      secondaryCtaLink: "/projects",
      sortOrder: 2,
    },
    {
      title: "Built on 25+ Years of Experience.",
      subtitle:
        "Quality MS and SS ducting made to SMACNA, DW 144 and IS 655 standards.",
      supportingLine: "Trusted on projects. Built for long-term partnerships.",
      imageUrl: "/images/hero-3.jpg",
      primaryCtaLabel: "About MSNSS",
      primaryCtaLink: "/about",
      secondaryCtaLabel: "Contact Us",
      secondaryCtaLink: "/contact",
      sortOrder: 3,
    },
  ]);

  // Products across all categories
  await db.insert(products).values([
    {
      slug: "ms-rectangular-duct",
      name: "MS Rectangular Duct",
      category: "Product",
      shortDescription:
        "Strong mild steel rectangular ducts for main HVAC air lines.",
      fullDescription:
        "Our MS rectangular ducts are made from quality mild steel sheets. They carry large volumes of air across buildings and factories. Each duct is cut, formed and joined to match your approved drawings. We make them to SMACNA and DW 144 standards for a good fit and long life.",
      imageUrl: "/images/products/ms-rectangular.jpg",
      applications: ["Commercial buildings", "Industrial plants", "Malls & offices", "Warehouses"],
      specifications: ["Gauge: 18G to 24G", "Standard: SMACNA / DW 144", "Joint: TDF / Cleat / Flange", "Custom sizes on order"],
      features: ["High strength", "Air-tight joints", "Made to drawing", "Long-lasting"],
      sortOrder: 1,
    },
    {
      slug: "ss-rectangular-duct",
      name: "SS Rectangular Duct",
      category: "Product",
      shortDescription:
        "Stainless steel rectangular ducts for clean and hygienic air flow.",
      fullDescription:
        "SS rectangular ducts are best where hygiene and rust protection matter. They are used in kitchens, hospitals and food plants. The smooth stainless steel surface is easy to clean and does not corrode. We fabricate them exactly to your project needs.",
      imageUrl: "/images/products/ss-rectangular.jpg",
      applications: ["Hospitals", "Commercial kitchens", "Food processing", "Pharma plants"],
      specifications: ["Grade: SS 304 / SS 316", "Finish: 2B / Matt", "Standard: SMACNA / IS 655", "Custom sizes on order"],
      features: ["Rust-free", "Hygienic finish", "Easy to clean", "Durable"],
      sortOrder: 2,
    },
    {
      slug: "ms-round-duct",
      name: "MS Round Duct",
      category: "Product",
      shortDescription: "Round mild steel ducts for even air spread.",
      fullDescription:
        "MS round ducts move air smoothly with less pressure loss. They suit exhaust and supply lines in factories and large halls. We make them in spiral or seam form based on the site need.",
      imageUrl: "/images/products/round-duct.jpg",
      applications: ["Factory exhaust", "Ventilation", "Large halls", "Industrial supply"],
      specifications: ["Diameter: 100mm to 1500mm", "Type: Spiral / Seam", "Standard: SMACNA", "Custom lengths"],
      features: ["Smooth air flow", "Low leakage", "Strong build", "Fast to install"],
      sortOrder: 3,
    },
    {
      slug: "ss-round-duct",
      name: "SS Round Duct",
      category: "Product",
      shortDescription: "Stainless steel round ducts for clean spaces.",
      fullDescription:
        "SS round ducts give clean, rust-free air flow. They are a top choice for kitchens, labs and hygienic areas. The round shape gives balanced air movement and a neat look.",
      imageUrl: "/images/products/round-duct.jpg",
      applications: ["Kitchen exhaust", "Labs", "Clean rooms", "Hospitals"],
      specifications: ["Grade: SS 304 / SS 316", "Diameter: 100mm to 1200mm", "Type: Spiral / Seam", "Custom sizes"],
      features: ["Corrosion-free", "Hygienic", "Neat finish", "Long life"],
      sortOrder: 4,
    },
    {
      slug: "angle-frame-duct",
      name: "Angle Frame Duct",
      category: "Product",
      shortDescription: "Ducts with angle frames for extra strength.",
      fullDescription:
        "Angle frame ducts use steel angles at the joints. This gives them extra strength for large sizes and high pressure. They are ideal for heavy-duty industrial HVAC lines.",
      imageUrl: "/images/products/ms-rectangular.jpg",
      applications: ["Large HVAC lines", "High pressure systems", "Industrial plants", "Infrastructure"],
      specifications: ["Angle: 25x25 to 50x50", "Gauge: 16G to 22G", "Standard: SMACNA", "Bolted joints"],
      features: ["Very strong", "High pressure ready", "Rigid frame", "Reliable"],
      sortOrder: 5,
    },
    {
      slug: "flanged-duct",
      name: "Flanged Duct",
      category: "Product",
      shortDescription: "Ducts with flange joints for easy fit.",
      fullDescription:
        "Flanged ducts join together with bolted flanges. This makes fitting and future service simple. They give a strong, air-tight connection for medium and large systems.",
      imageUrl: "/images/products/ss-rectangular.jpg",
      applications: ["Commercial HVAC", "Industrial ducting", "Service-friendly systems"],
      specifications: ["Flange: 20mm / 30mm / 40mm", "Standard: DW 144", "Gasket sealed", "Custom sizes"],
      features: ["Easy to fit", "Air-tight", "Service friendly", "Strong joints"],
      sortOrder: 6,
    },
    {
      slug: "kitchen-exhaust-duct",
      name: "Kitchen Exhaust Duct",
      category: "Product",
      shortDescription: "Grease-safe ducts for commercial kitchens.",
      fullDescription:
        "Kitchen exhaust ducts remove smoke, heat and grease from busy kitchens. We build them from MS or SS with tight joints to stop leaks. They keep kitchens safe and clean.",
      imageUrl: "/images/products/round-duct.jpg",
      applications: ["Restaurants", "Hotels", "Food courts", "Cloud kitchens"],
      specifications: ["Material: MS / SS", "Welded seams", "Grease-tight", "Custom shapes"],
      features: ["Grease-safe", "Heat resistant", "Leak-proof", "Easy clean"],
      sortOrder: 7,
    },
    {
      slug: "fire-rated-duct",
      name: "Fire Rated Duct",
      category: "Product",
      shortDescription: "Ducts with fire protection for safety zones.",
      fullDescription:
        "Fire rated ducts carry smoke and hot air safely during a fire. We apply suitable fire coating systems to protect the ductwork. They are used in smoke exhaust and pressurization systems.",
      imageUrl: "/images/fire-rated.jpg",
      applications: ["Smoke exhaust", "Car park ventilation", "Pressurization", "Fire ventilation"],
      specifications: ["Coating: Fire-retardant", "Base: MS / SS", "Rated system", "Custom sizes"],
      features: ["Fire protection", "Heat resistant", "Safety rated", "Reliable"],
      sortOrder: 8,
    },
    // Accessories Part
    {
      slug: "volume-control-damper",
      name: "Volume Control Damper",
      category: "Accessories Part",
      shortDescription: "Controls the amount of air in each duct line.",
      fullDescription:
        "Volume control dampers let you set how much air flows through a duct. They help balance the HVAC system room by room. We make them in MS or SS to suit your ducts.",
      imageUrl: "/images/products/accessories.jpg",
      applications: ["Air balancing", "Zone control", "HVAC systems"],
      specifications: ["Type: Opposed / Parallel blade", "Material: MS / SS", "Manual / Motorized", "Custom sizes"],
      features: ["Precise control", "Smooth blades", "Durable", "Easy setup"],
      sortOrder: 9,
    },
    {
      slug: "duct-flange",
      name: "Duct Flange & Fittings",
      category: "Accessories Part",
      shortDescription: "Flanges, cleats and fittings for duct joints.",
      fullDescription:
        "We supply a full range of duct flanges, corner pieces, cleats and connectors. These parts make strong, air-tight joints between duct sections. All parts match SMACNA and DW 144 sizes.",
      imageUrl: "/images/products/accessories.jpg",
      applications: ["Duct jointing", "Field assembly", "Repairs & service"],
      specifications: ["TDF / Cleat / Angle", "Material: GI / MS / SS", "Standard sizes", "Custom on order"],
      features: ["Perfect fit", "Air-tight", "Strong", "Ready stock"],
      sortOrder: 10,
    },
    {
      slug: "access-door",
      name: "Duct Access Door",
      category: "Accessories Part",
      shortDescription: "Inspection and cleaning doors for ducts.",
      fullDescription:
        "Access doors let you open the duct to inspect or clean it. They seal tightly when closed and are easy to open when needed. Ideal for kitchen and exhaust lines.",
      imageUrl: "/images/products/accessories.jpg",
      applications: ["Inspection", "Cleaning access", "Maintenance"],
      specifications: ["Material: MS / SS", "Sealed gasket", "Hinged / Screw type", "Custom sizes"],
      features: ["Air-tight seal", "Easy access", "Sturdy", "Long life"],
      sortOrder: 11,
    },
    // Fire Rated Coating
    {
      slug: "cisbond-fr-802-coating",
      name: "CISBOND-FR 802 Fire Coating",
      category: "Fire Rated Coating",
      shortDescription: "Water-based fire-retardant coating for ductwork.",
      fullDescription:
        "CISBOND-FR 802 is a water-based fire-retardant coating for ventilation and smoke exhaust ducts. It helps ductwork resist fire and heat in critical areas. We apply it in our facility with the right procedure and thickness.",
      imageUrl: "/images/fire-rated.jpg",
      applications: ["Smoke exhaust", "Kitchen exhaust", "Car-park ventilation", "Pressurization ducts"],
      specifications: ["Type: Water-based", "Fire-retardant", "Applied by spray", "Controlled thickness"],
      features: ["Fire protection", "Low smoke", "Even coat", "Site or factory applied"],
      sortOrder: 12,
    },
    // Plant and Machinery
    {
      slug: "plasma-cutting-machine",
      name: "Plasma Cutting Machine",
      category: "Plant and Machinery",
      shortDescription: "Fast, clean cutting of duct sheets.",
      fullDescription:
        "Our plasma cutting machine cuts sheet metal fast and clean. This gives accurate blanks for every duct. Better cutting means better fit and less waste.",
      imageUrl: "/images/factory.jpg",
      applications: ["Sheet cutting", "Duct blanks", "Precision work"],
      specifications: ["CNC guided", "Clean cut edge", "High speed", "Low waste"],
      features: ["Accurate", "Fast", "Clean edges", "Reliable"],
      sortOrder: 13,
    },
    {
      slug: "bending-punching-machine",
      name: "Bending & Punching Machine",
      category: "Plant and Machinery",
      shortDescription: "Forms and shapes duct sheets to size.",
      fullDescription:
        "This machine bends and punches sheet metal into the right duct shape. It gives sharp, even folds and clean holes for flanges. Consistent forming means every duct fits the same.",
      imageUrl: "/images/factory.jpg",
      applications: ["Duct forming", "Flange holes", "Shaping"],
      specifications: ["Heavy duty", "Even folds", "Precise punching", "High output"],
      features: ["Consistent", "Strong", "Precise", "Fast"],
      sortOrder: 14,
    },
  ]);

  // Projects
  await db.insert(projects).values([
    {
      slug: "idfc-bank",
      name: "IDFC Bank",
      location: "Mumbai, Maharashtra",
      category: "Commercial",
      status: "completed",
      scopeOfWork: "MS ducting manufacturing, fabrication and site installation.",
      description:
        "Complete HVAC ducting supply and installation for the corporate banking office, delivered on time to project standards.",
      imageUrl: "/images/hero-3.jpg",
      sortOrder: 1,
    },
    {
      slug: "oberoi-sky-city",
      name: "Oberoi Sky City",
      location: "Mumbai, Maharashtra",
      category: "Commercial",
      status: "completed",
      scopeOfWork: "MS & SS rectangular ducting with flange joints.",
      description:
        "Large-scale ducting works for a premium residential and commercial development.",
      imageUrl: "/images/hero-1.jpg",
      sortOrder: 2,
    },
    {
      slug: "bikanervala-restaurant",
      name: "Bikanervala Restaurant",
      location: "Mumbai, Maharashtra",
      category: "Hospitality",
      status: "completed",
      scopeOfWork: "SS kitchen exhaust ducting and installation.",
      description:
        "Grease-safe kitchen exhaust ducting for a busy commercial restaurant kitchen.",
      imageUrl: "/images/products/round-duct.jpg",
      sortOrder: 3,
    },
    {
      slug: "four-seasons-hotel",
      name: "Four Seasons Hotel",
      location: "Mumbai, Maharashtra",
      category: "Hospitality",
      status: "ongoing",
      scopeOfWork: "MS & SS ducting with fire-rated coating.",
      description:
        "Ongoing supply of ducting and fire-rated coated ductwork for a luxury hotel project.",
      imageUrl: "/images/hero-2.jpg",
      sortOrder: 4,
    },
    {
      slug: "jupiter-hospital",
      name: "Jupiter Hospital",
      location: "Thane, Maharashtra",
      category: "Healthcare",
      status: "ongoing",
      scopeOfWork: "SS hygienic ducting and installation.",
      description:
        "Hygienic stainless steel ducting for critical healthcare zones, currently in progress.",
      imageUrl: "/images/products/ss-rectangular.jpg",
      sortOrder: 5,
    },
    {
      slug: "general-aviation-terminal",
      name: "General Aviation Terminal",
      location: "Mumbai, Maharashtra",
      category: "Infrastructure",
      status: "ongoing",
      scopeOfWork: "Large-scale MS ducting and site execution.",
      description:
        "Infrastructure-grade ducting supply and installation for an aviation terminal.",
      imageUrl: "/images/hero-3.jpg",
      sortOrder: 6,
    },
    {
      slug: "oberoi-commerce-iii",
      name: "Oberoi Commerce III",
      location: "Mumbai, Maharashtra",
      category: "Commercial",
      status: "completed",
      scopeOfWork: "MS rectangular ducting and installation.",
      description:
        "HVAC ducting works for a modern commercial office tower.",
      imageUrl: "/images/hero-1.jpg",
      sortOrder: 7,
    },
  ]);

  // Trusted clients
  await db.insert(clients).values([
    {
      slug: "idfc-bank",
      name: "IDFC Bank",
      logoUrl: "/images/clients/client.svg",
      row: 1,
      workSummary: "Corporate office HVAC ducting supply and installation.",
      servicesProvided: ["MS Duct Manufacturing", "Fabrication", "Site Installation"],
      projectDetails:
        "We supplied and installed complete MS ducting for the IDFC Bank corporate office. The scope covered drawing coordination, fabrication and on-site installation, all delivered to project timelines and quality standards.",
      sortOrder: 1,
    },
    {
      slug: "oberoi-realty",
      name: "Oberoi Realty",
      logoUrl: "/images/clients/client.svg",
      row: 1,
      workSummary: "Ducting works across multiple premium developments.",
      servicesProvided: ["MS & SS Ducting", "Flanged Ducting", "Installation"],
      projectDetails:
        "MSNSS delivered ducting for Oberoi Sky City and Oberoi Commerce III. Our work included MS and SS rectangular ducting with flange joints, fabricated and installed for large commercial spaces.",
      sortOrder: 2,
    },
    {
      slug: "four-seasons",
      name: "Four Seasons Hotel",
      logoUrl: "/images/clients/client.svg",
      row: 1,
      workSummary: "Hotel ducting with fire-rated coating.",
      servicesProvided: ["MS & SS Ducting", "Fire-Rated Coating", "Installation"],
      projectDetails:
        "For Four Seasons Hotel, we are supplying ducting and fire-rated coated ductwork. The project needs high finishing quality and careful site coordination, which our team provides end to end.",
      sortOrder: 3,
    },
    {
      slug: "bikanervala",
      name: "Bikanervala",
      logoUrl: "/images/clients/client.svg",
      row: 2,
      workSummary: "Commercial kitchen exhaust ducting.",
      servicesProvided: ["SS Kitchen Exhaust Duct", "Fabrication", "Installation"],
      projectDetails:
        "We built and installed grease-safe SS kitchen exhaust ducting for Bikanervala. The ducting removes smoke, heat and grease safely from the busy commercial kitchen.",
      sortOrder: 4,
    },
    {
      slug: "jupiter-hospital",
      name: "Jupiter Hospital",
      logoUrl: "/images/clients/client.svg",
      row: 2,
      workSummary: "Hygienic healthcare ducting.",
      servicesProvided: ["SS Hygienic Ducting", "Installation", "Finishing"],
      projectDetails:
        "For Jupiter Hospital, we are supplying hygienic stainless steel ducting for critical care zones. Clean, rust-free ducting is important for healthcare air quality.",
      sortOrder: 5,
    },
    {
      slug: "aviation-terminal",
      name: "General Aviation Terminal",
      logoUrl: "/images/clients/client.svg",
      row: 2,
      workSummary: "Infrastructure-grade ducting works.",
      servicesProvided: ["Large MS Ducting", "Fabrication", "Site Execution"],
      projectDetails:
        "We are executing large-scale MS ducting for the General Aviation Terminal. Infrastructure projects need strong ducting and reliable site execution, which MSNSS delivers.",
      sortOrder: 6,
    },
  ]);

  // Services
  await db.insert(services).values([
    {
      slug: "duct-manufacturing",
      name: "Duct Manufacturing",
      icon: "🏭",
      shortDescription: "MS and SS duct production for HVAC needs.",
      fullDescription:
        "We make MS and SS ducts at our Vasai plant with a capacity of up to 2,000 SQM per month. Every duct is cut, formed and joined to your approved drawings for a perfect fit.",
      sortOrder: 1,
    },
    {
      slug: "fabrication",
      name: "Fabrication",
      icon: "🔧",
      shortDescription: "Custom fabrication from your drawings.",
      fullDescription:
        "Our team fabricates custom ducting and frames based on your project drawings. We handle special shapes, sizes and joints so the ductwork fits your site exactly.",
      sortOrder: 2,
    },
    {
      slug: "installation",
      name: "Site Installation",
      icon: "🏗️",
      shortDescription: "Professional duct fitting at your site.",
      fullDescription:
        "We install ducting at your project location with a skilled site team. From lifting to fixing and sealing, we make sure the system is fitted safely and on time.",
      sortOrder: 3,
    },
    {
      slug: "insulation-pasting",
      name: "Insulation Pasting",
      icon: "🧊",
      shortDescription: "Factory-side insulation on ducts.",
      fullDescription:
        "We apply insulation on ducts in our facility for selected requirements. Good insulation saves energy and keeps air at the right temperature.",
      sortOrder: 4,
    },
    {
      slug: "fire-rated-coating",
      name: "Fire-Rated Coating",
      icon: "🔥",
      shortDescription: "Fire and heat protection for ductwork.",
      fullDescription:
        "We apply fire-rated coating systems on ducts for smoke exhaust, kitchen exhaust and pressurization. This adds fire and heat protection to critical ductwork.",
      sortOrder: 5,
    },
    {
      slug: "surface-treatment",
      name: "Surface Treatment",
      icon: "🎨",
      shortDescription: "Sand blasting, priming and painting.",
      fullDescription:
        "We offer sand blasting, priming and paint application on ducts as needed. A clean, coated surface looks better and lasts longer.",
      sortOrder: 6,
    },
  ]);

  console.log("✅ Seed complete. Admin login: admin@msnss.com / admin123");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
