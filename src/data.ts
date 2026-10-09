export type PartCategory = "Engine" | "Transmission";

export type Product = {
  id: string;
  category: PartCategory;
  title: string;
  make: string;
  model: string;
  years: string;
  yearStart: number;
  yearEnd: number;
  engineSize: string;
  price: number;
  description: string;
  sampleRef: string;
  image: string;
  imageAlt: string;
  transmissionType?: string;
  drivetrain?: string;
};

export const brands = [
  "Toyota",
  "Ford",
  "GMC",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Mazda",
];

export const vehicleModels: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra"],
  Ford: ["F-150", "Escape", "Explorer", "Fusion", "Edge", "Mustang"],
  GMC: ["Sierra 1500", "Yukon", "Terrain", "Acadia", "Canyon"],
  Hyundai: ["Sonata", "Elantra", "Santa Fe", "Tucson", "Kona"],
  Kia: ["Optima", "Sorento", "Sportage", "Forte", "Telluride"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "Sprinter"],
  Audi: ["A4", "A6", "Q5", "Q7", "A3"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey"],
  Chevrolet: ["Silverado 1500", "Equinox", "Malibu", "Traverse"],
  Nissan: ["Altima", "Rogue", "Sentra", "Frontier"],
};

export const years = Array.from({ length: 2026 - 1995 + 1 }, (_, index) =>
  String(2026 - index),
);

export const products: Product[] = [
  {
    id: "toyota-camry-engine-demo",
    category: "Engine",
    title: "Toyota Camry Engine Assembly",
    make: "Toyota",
    model: "Camry",
    years: "2012–2017",
    yearStart: 2012,
    yearEnd: 2017,
    engineSize: "2.5L 4-cylinder",
    price: 1250,
    description: "Used engine assembly. Ask for the specific inspection and condition details before purchase.",
    sampleRef: "AS-ENG-DEMO-01",
    image:
      "https://images.pexels.com/photos/7565172/pexels-photo-7565172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    imageAlt: "Detailed engine components on a clean workshop bench",
  },
  {
    id: "ford-f150-engine-demo",
    category: "Engine",
    title: "Ford F-150 Engine Assembly",
    make: "Ford",
    model: "F-150",
    years: "2015–2017",
    yearStart: 2015,
    yearEnd: 2017,
    engineSize: "3.5L V6",
    price: 1450,
    description: "Used engine assembly example. Exact configuration and included components need confirmation.",
    sampleRef: "AS-ENG-DEMO-02",
    image:
      "https://images.pexels.com/photos/4116203/pexels-photo-4116203.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    imageAlt: "Automotive engine assembly in a professional workshop",
  },
  {
    id: "hyundai-sonata-engine-demo",
    category: "Engine",
    title: "Hyundai Sonata Engine Assembly",
    make: "Hyundai",
    model: "Sonata",
    years: "2015–2019",
    yearStart: 2015,
    yearEnd: 2019,
    engineSize: "2.4L 4-cylinder",
    price: 1100,
    description: "Used engine assembly example. Request the current condition and testing information.",
    sampleRef: "AS-ENG-DEMO-03",
    image:
      "https://images.pexels.com/photos/33559313/pexels-photo-33559313.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    imageAlt: "Close-up of a metallic engine cylinder head and components",
  },
  {
    id: "toyota-camry-transmission-demo",
    category: "Transmission",
    title: "Automatic Transmission Assembly",
    make: "Toyota",
    model: "Camry",
    years: "2012–2017",
    yearStart: 2012,
    yearEnd: 2017,
    engineSize: "2.5L application example",
    price: 850,
    description: "Used automatic transmission example. Verify transmission code and vehicle configuration.",
    sampleRef: "AS-TRN-DEMO-01",
    image: "/images/transmission-assembly.jpg",
    imageAlt: "Clean automatic transmission assembly photographed in a parts warehouse",
    transmissionType: "Automatic",
    drivetrain: "Front-wheel drive",
  },
  {
    id: "gmc-sierra-transmission-demo",
    category: "Transmission",
    title: "GMC Sierra Transmission Assembly",
    make: "GMC",
    model: "Sierra 1500",
    years: "2014–2018",
    yearStart: 2014,
    yearEnd: 2018,
    engineSize: "5.3L application example",
    price: 1100,
    description: "Used transmission assembly example. Check drivetrain, engine, and transmission code before purchase.",
    sampleRef: "AS-TRN-DEMO-02",
    image:
      "https://images.pexels.com/photos/40046211/pexels-photo-40046211.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    imageAlt: "Detailed view of mechanical gears and automotive components",
    transmissionType: "Automatic",
    drivetrain: "4-wheel drive",
  },
  {
    id: "volkswagen-jetta-engine-demo",
    category: "Engine",
    title: "Volkswagen Jetta Engine Assembly",
    make: "Volkswagen",
    model: "Jetta",
    years: "2014–2018",
    yearStart: 2014,
    yearEnd: 2018,
    engineSize: "1.8L turbo example",
    price: 950,
    description: "Used engine assembly example. Confirm engine code and included components with the team.",
    sampleRef: "AS-ENG-DEMO-04",
    image:
      "https://images.pexels.com/photos/33559451/pexels-photo-33559451.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    imageAlt: "Engine assembly being prepared in an automotive workshop",
  },
];

export const faqs = [
  {
    question: "Are your engines and transmissions tested?",
    answer:
      "Our advertisement describes engines as tested and transmissions as inspected. Contact us to confirm the specific testing and condition details for the part you’re considering.",
  },
  {
    question: "Do parts come with a warranty?",
    answer:
      "Our supplied advertisement states a 30-day warranty on parts. Please confirm the written warranty terms, coverage, and exclusions before purchasing.",
  },
  {
    question: "Can you help me find the right part?",
    answer:
      "Yes. Share your vehicle’s year, make, model, and the part you need so the team can help confirm the appropriate replacement.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Delivery is advertised for Maryland, Virginia, New York, New Jersey, and Delaware. Timing and availability depend on your location and order.",
  },
  {
    question: "Can I pick up a part?",
    answer:
      "Pickup is advertised as an option. Contact the team to confirm the arrangement.",
  },
  {
    question: "Are you available around the clock?",
    answer:
      "The advertisement promotes 24/7 service and lists two contact numbers. Contact the business to confirm response and availability for your specific request.",
  },
];