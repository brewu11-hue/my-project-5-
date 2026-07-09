/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Neighborhood, WorkerProfile, JobPosting, Message } from "../types";

export const mockNeighborhoods: Neighborhood[] = [
  // ==========================================
  // GAUTENG (GP) - 5 Districts/Metros
  // ==========================================
  {
    id: "soweto",
    name: "Soweto",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["Soweto-JHB CBD Taxi", "Soweto-Sandton Taxi"],
  },
  {
    id: "jhb_cbd",
    name: "Johannesburg CBD",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["Soweto-JHB CBD Taxi", "JHB CBD-Sandton Taxi", "JHB CBD-Midrand Taxi"],
  },
  {
    id: "alexandra",
    name: "Alexandra",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["Alex-Sandton Taxi", "Alex-JHB CBD Taxi"],
  },
  {
    id: "sandton",
    name: "Sandton",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["Alex-Sandton Taxi", "Soweto-Sandton Taxi", "JHB CBD-Sandton Taxi"],
  },
  {
    id: "randburg",
    name: "Randburg",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["Randburg-JHB CBD Taxi", "Randburg-Sandton Taxi"],
  },
  {
    id: "midrand",
    name: "Midrand",
    city: "Johannesburg",
    district: "City of Johannesburg Metro",
    province: "Gauteng",
    transitLines: ["JHB CBD-Midrand Taxi", "Midrand-Tembisa Taxi"],
  },
  {
    id: "pretoria_cbd",
    name: "Pretoria CBD",
    city: "Tshwane",
    district: "City of Tshwane Metro",
    province: "Gauteng",
    transitLines: ["Pretoria-Centurion Taxi", "Pretoria CBD-Mamelodi Taxi"],
  },
  {
    id: "mamelodi",
    name: "Mamelodi",
    city: "Tshwane",
    district: "City of Tshwane Metro",
    province: "Gauteng",
    transitLines: ["Pretoria CBD-Mamelodi Taxi"],
  },
  {
    id: "soshanguve",
    name: "Soshanguve",
    city: "Tshwane",
    district: "City of Tshwane Metro",
    province: "Gauteng",
    transitLines: ["Pretoria-Soshanguve Taxi"],
  },
  {
    id: "centurion",
    name: "Centurion",
    city: "Tshwane",
    district: "City of Tshwane Metro",
    province: "Gauteng",
    transitLines: ["Pretoria-Centurion Taxi", "Centurion-Midrand Taxi"],
  },
  {
    id: "tembisa",
    name: "Tembisa",
    city: "Ekurhuleni",
    district: "City of Ekurhuleni Metro",
    province: "Gauteng",
    transitLines: ["Midrand-Tembisa Taxi", "Tembisa-Kempton Park Taxi"],
  },
  {
    id: "kempton_park",
    name: "Kempton Park",
    city: "Ekurhuleni",
    district: "City of Ekurhuleni Metro",
    province: "Gauteng",
    transitLines: ["Tembisa-Kempton Park Taxi"],
  },
  {
    id: "krugersdorp",
    name: "Krugersdorp",
    city: "Krugersdorp",
    district: "West Rand District",
    province: "Gauteng",
    transitLines: ["Krugersdorp-Randfontein Taxi"],
  },
  {
    id: "vereeniging",
    name: "Vereeniging",
    city: "Vereeniging",
    district: "Sedibeng District",
    province: "Gauteng",
    transitLines: ["Vereeniging-JHB CBD Taxi"],
  },

  // ==========================================
  // WESTERN CAPE (WC) - 6 Districts/Metros
  // ==========================================
  {
    id: "ct_cbd",
    name: "Cape Town CBD",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Khayelitsha-Cape Town CBD Taxi", "Mitchells Plain-CT CBD Taxi"],
  },
  {
    id: "khayelitsha",
    name: "Khayelitsha",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Khayelitsha-Cape Town CBD Taxi", "Khayelitsha-Bellville Taxi"],
  },
  {
    id: "mitchells_plain",
    name: "Mitchells Plain",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Mitchells Plain-CT CBD Taxi", "Mitchells Plain-Bellville Taxi"],
  },
  {
    id: "bellville",
    name: "Bellville",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Khayelitsha-Bellville Taxi", "Mitchells Plain-Bellville Taxi"],
  },
  {
    id: "wynberg",
    name: "Wynberg",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Wynberg-Cape Town CBD Taxi"],
  },
  {
    id: "gugulethu",
    name: "Gugulethu",
    city: "Cape Town",
    district: "City of Cape Town Metro",
    province: "Western Cape",
    transitLines: ["Gugulethu-CT CBD Taxi"],
  },
  {
    id: "stellenbosch",
    name: "Stellenbosch",
    city: "Stellenbosch",
    district: "Cape Winelands District",
    province: "Western Cape",
    transitLines: ["Stellenbosch-Paarl Taxi"],
  },
  {
    id: "paarl",
    name: "Paarl",
    city: "Paarl",
    district: "Cape Winelands District",
    province: "Western Cape",
    transitLines: ["Stellenbosch-Paarl Taxi"],
  },
  {
    id: "george",
    name: "George",
    city: "George",
    district: "Garden Route District",
    province: "Western Cape",
    transitLines: ["George-Mossel Bay Taxi"],
  },
  {
    id: "vredenburg",
    name: "Vredenburg",
    city: "Vredenburg",
    district: "West Coast District",
    province: "Western Cape",
    transitLines: ["Saldanha-Vredenburg Taxi"],
  },
  {
    id: "hermanus",
    name: "Hermanus",
    city: "Hermanus",
    district: "Overberg District",
    province: "Western Cape",
    transitLines: ["Hermanus-Cape Town Taxi"],
  },
  {
    id: "beaufort_west",
    name: "Beaufort West",
    city: "Beaufort West",
    district: "Central Karoo District",
    province: "Western Cape",
    transitLines: ["Beaufort West Local Taxi"],
  },
  {
    id: "knysna",
    name: "Knysna",
    city: "Knysna",
    district: "Garden Route District",
    province: "Western Cape",
    transitLines: ["Knysna-George Taxi"],
  },
  {
    id: "swellendam",
    name: "Swellendam",
    city: "Swellendam",
    district: "Overberg District",
    province: "Western Cape",
    transitLines: ["Swellendam-Hermanus Taxi"],
  },

  // ==========================================
  // KWAZULU-NATAL (KZN) - 11 Districts/Metros
  // ==========================================
  {
    id: "durban_cbd",
    name: "Durban CBD",
    city: "eThekwini",
    district: "eThekwini Metro",
    province: "KwaZulu-Natal",
    transitLines: ["Durban CBD-Umlazi Taxi", "Durban CBD-Pinetown Taxi"],
  },
  {
    id: "umlazi",
    name: "Umlazi",
    city: "eThekwini",
    district: "eThekwini Metro",
    province: "KwaZulu-Natal",
    transitLines: ["Durban CBD-Umlazi Taxi"],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    city: "eThekwini",
    district: "eThekwini Metro",
    province: "KwaZulu-Natal",
    transitLines: ["Durban CBD-Phoenix Taxi"],
  },
  {
    id: "pinetown",
    name: "Pinetown",
    city: "eThekwini",
    district: "eThekwini Metro",
    province: "KwaZulu-Natal",
    transitLines: ["Durban CBD-Pinetown Taxi"],
  },
  {
    id: "pietermaritzburg",
    name: "Pietermaritzburg",
    city: "Msunduzi",
    district: "uMgungundlovu District",
    province: "KwaZulu-Natal",
    transitLines: ["PMB-Howick Taxi", "PMB-Durban Taxi"],
  },
  {
    id: "port_shepstone",
    name: "Port Shepstone",
    city: "Port Shepstone",
    district: "Ugu District",
    province: "KwaZulu-Natal",
    transitLines: ["Port Shepstone-Margate Taxi"],
  },
  {
    id: "ladysmith",
    name: "Ladysmith",
    city: "Ladysmith",
    district: "uThukela District",
    province: "KwaZulu-Natal",
    transitLines: ["Ladysmith Local Taxi"],
  },
  {
    id: "dundee",
    name: "Dundee",
    city: "Dundee",
    district: "uZinyathi District",
    province: "KwaZulu-Natal",
    transitLines: ["Dundee-Nqutu Taxi"],
  },
  {
    id: "newcastle",
    name: "Newcastle",
    city: "Newcastle",
    district: "Amajuba District",
    province: "KwaZulu-Natal",
    transitLines: ["Newcastle Local Taxi"],
  },
  {
    id: "vryheid",
    name: "Vryheid",
    city: "Vryheid",
    district: "Zululand District",
    province: "KwaZulu-Natal",
    transitLines: ["Vryheid-Ulundi Taxi"],
  },
  {
    id: "jozini",
    name: "Jozini",
    city: "Jozini",
    district: "uMkhanyakude District",
    province: "KwaZulu-Natal",
    transitLines: ["Jozini Local Taxi"],
  },
  {
    id: "richards_bay",
    name: "Richards Bay",
    city: "Richards Bay",
    district: "King Cetshwayo District",
    province: "KwaZulu-Natal",
    transitLines: ["Richards Bay-Empangeni Taxi"],
  },
  {
    id: "kwadukuza",
    name: "KwaDukuza (Stanger)",
    city: "KwaDukuza",
    district: "iLembe District",
    province: "KwaZulu-Natal",
    transitLines: ["KwaDukuza-Ballito Taxi"],
  },
  {
    id: "kokstad",
    name: "Kokstad",
    city: "Kokstad",
    district: "Harry Gwala District",
    province: "KwaZulu-Natal",
    transitLines: ["Kokstad-Ixopo Taxi"],
  },

  // ==========================================
  // EASTERN CAPE (EC) - 8 Districts/Metros
  // ==========================================
  {
    id: "gqeberha",
    name: "Gqeberha (Port Elizabeth)",
    city: "Nelson Mandela Bay",
    district: "Nelson Mandela Bay Metro",
    province: "Eastern Cape",
    transitLines: ["Gqeberha-Kariega Taxi"],
  },
  {
    id: "kariega",
    name: "Kariega (Uitenhage)",
    city: "Nelson Mandela Bay",
    district: "Nelson Mandela Bay Metro",
    province: "Eastern Cape",
    transitLines: ["Gqeberha-Kariega Taxi"],
  },
  {
    id: "east_london",
    name: "East London",
    city: "Buffalo City",
    district: "Buffalo City Metro",
    province: "Eastern Cape",
    transitLines: ["East London-Mdantsane Taxi"],
  },
  {
    id: "mdantsane",
    name: "Mdantsane",
    city: "Buffalo City",
    district: "Buffalo City Metro",
    province: "Eastern Cape",
    transitLines: ["East London-Mdantsane Taxi"],
  },
  {
    id: "mount_ayliff",
    name: "Mount Ayliff",
    city: "Mount Ayliff",
    district: "Alfred Nzo District",
    province: "Eastern Cape",
    transitLines: ["Mount Ayliff-Bizana Taxi"],
  },
  {
    id: "butterworth",
    name: "Butterworth",
    city: "Butterworth",
    district: "Amathole District",
    province: "Eastern Cape",
    transitLines: ["Butterworth Local Taxi"],
  },
  {
    id: "queenstown",
    name: "Komani (Queenstown)",
    city: "Queenstown",
    district: "Chris Hani District",
    province: "Eastern Cape",
    transitLines: ["Queenstown-Cradock Taxi"],
  },
  {
    id: "aliwal_north",
    name: "Aliwal North",
    city: "Aliwal North",
    district: "Joe Gqabi District",
    province: "Eastern Cape",
    transitLines: ["Aliwal North Local Taxi"],
  },
  {
    id: "mthatha",
    name: "Mthatha",
    city: "Mthatha",
    district: "OR Tambo District",
    province: "Eastern Cape",
    transitLines: ["Mthatha Local Taxi"],
  },
  {
    id: "grahamstown",
    name: "Makhanda (Grahamstown)",
    city: "Makhanda",
    district: "Sarah Baartman District",
    province: "Eastern Cape",
    transitLines: ["Makhanda-Jeffreys Bay Taxi"],
  },

  // ==========================================
  // FREE STATE (FS) - 5 Districts/Metros
  // ==========================================
  {
    id: "bloemfontein",
    name: "Bloemfontein",
    city: "Mangaung",
    district: "Mangaung Metro",
    province: "Free State",
    transitLines: ["Bloemfontein-Botshabelo Taxi"],
  },
  {
    id: "botshabelo",
    name: "Botshabelo",
    city: "Mangaung",
    district: "Mangaung Metro",
    province: "Free State",
    transitLines: ["Bloemfontein-Botshabelo Taxi"],
  },
  {
    id: "sasolburg",
    name: "Sasolburg",
    city: "Sasolburg",
    district: "Fezile Dabi District",
    province: "Free State",
    transitLines: ["Sasolburg-Kroonstad Taxi"],
  },
  {
    id: "welkom",
    name: "Welkom",
    city: "Welkom",
    district: "Lejweleputswa District",
    province: "Free State",
    transitLines: ["Welkom-Virginia Taxi"],
  },
  {
    id: "bethlehem",
    name: "Bethlehem",
    city: "Bethlehem",
    district: "Thabo Mofutsanyana District",
    province: "Free State",
    transitLines: ["Bethlehem-Harrismith Taxi"],
  },
  {
    id: "trompsburg",
    name: "Trompsburg",
    city: "Trompsburg",
    district: "Xhariep District",
    province: "Free State",
    transitLines: ["Trompsburg Local Taxi"],
  },
  {
    id: "harrismith",
    name: "Harrismith",
    city: "Harrismith",
    district: "Thabo Mofutsanyana District",
    province: "Free State",
    transitLines: ["Bethlehem-Harrismith Taxi"],
  },

  // ==========================================
  // LIMPOPO (LP) - 5 Districts
  // ==========================================
  {
    id: "polokwane",
    name: "Polokwane",
    city: "Polokwane",
    district: "Capricorn District",
    province: "Limpopo",
    transitLines: ["Polokwane Local Taxi"],
  },
  {
    id: "tzaneen",
    name: "Tzaneen",
    city: "Tzaneen",
    district: "Mopani District",
    province: "Limpopo",
    transitLines: ["Tzaneen-Giyani Taxi"],
  },
  {
    id: "groblersdal",
    name: "Groblersdal",
    city: "Groblersdal",
    district: "Sekhukhune District",
    province: "Limpopo",
    transitLines: ["Groblersdal-Jane Furse Taxi"],
  },
  {
    id: "thohoyandou",
    name: "Thohoyandou",
    city: "Thohoyandou",
    district: "Vhembe District",
    province: "Limpopo",
    transitLines: ["Thohoyandou Local Taxi"],
  },
  {
    id: "bela_bela",
    name: "Bela-Bela",
    city: "Bela-Bela",
    district: "Waterberg District",
    province: "Limpopo",
    transitLines: ["Bela-Bela-Mokopane Taxi"],
  },
  {
    id: "mokopane",
    name: "Mokopane",
    city: "Mokopane",
    district: "Waterberg District",
    province: "Limpopo",
    transitLines: ["Bela-Bela-Mokopane Taxi"],
  },

  // ==========================================
  // MPUMALANGA (MP) - 3 Districts
  // ==========================================
  {
    id: "nelspruit",
    name: "Nelspruit (Mbombela)",
    city: "Mbombela",
    district: "Ehlanzeni District",
    province: "Mpumalanga",
    transitLines: ["Nelspruit Local Taxi"],
  },
  {
    id: "secunda",
    name: "Secunda",
    city: "Secunda",
    district: "Gert Sibande District",
    province: "Mpumalanga",
    transitLines: ["Secunda-Ermelo Taxi"],
  },
  {
    id: "witbank",
    name: "Witbank",
    city: "Emalahleni",
    district: "Nkangala District",
    province: "Mpumalanga",
    transitLines: ["Witbank-Middelburg Taxi"],
  },
  {
    id: "middelburg_mp",
    name: "Middelburg (MP)",
    city: "Middelburg",
    district: "Nkangala District",
    province: "Mpumalanga",
    transitLines: ["Witbank-Middelburg Taxi"],
  },
  {
    id: "ermelo",
    name: "Ermelo",
    city: "Ermelo",
    district: "Gert Sibande District",
    province: "Mpumalanga",
    transitLines: ["Secunda-Ermelo Taxi"],
  },

  // ==========================================
  // NORTH WEST (NW) - 4 Districts
  // ==========================================
  {
    id: "rustenburg",
    name: "Rustenburg",
    city: "Rustenburg",
    district: "Bojanala Platinum District",
    province: "North West",
    transitLines: ["Rustenburg Local Taxi"],
  },
  {
    id: "mahikeng",
    name: "Mahikeng",
    city: "Mahikeng",
    district: "Ngaka Modiri Molema District",
    province: "North West",
    transitLines: ["Mahikeng Local Taxi"],
  },
  {
    id: "vryburg",
    name: "Vryburg",
    city: "Vryburg",
    district: "Dr Ruth Segomotsi Mompati District",
    province: "North West",
    transitLines: ["Vryburg Local Taxi"],
  },
  {
    id: "klerksdorp",
    name: "Klerksdorp",
    city: "Klerksdorp",
    district: "Dr Kenneth Kaunda District",
    province: "North West",
    transitLines: ["Klerksdorp-Potchefstroom Taxi"],
  },
  {
    id: "potchefstroom",
    name: "Potchefstroom",
    city: "Potchefstroom",
    district: "Dr Kenneth Kaunda District",
    province: "North West",
    transitLines: ["Klerksdorp-Potchefstroom Taxi"],
  },

  // ==========================================
  // NORTHERN CAPE (NC) - 5 Districts
  // ==========================================
  {
    id: "kimberley",
    name: "Kimberley",
    city: "Kimberley",
    district: "Frances Baard District",
    province: "Northern Cape",
    transitLines: ["Kimberley Local Taxi"],
  },
  {
    id: "kuruman",
    name: "Kuruman",
    city: "Kuruman",
    district: "John Taolo Gaetsewe District",
    province: "Northern Cape",
    transitLines: ["Kuruman-Kathu Taxi"],
  },
  {
    id: "springbok",
    name: "Springbok",
    city: "Springbok",
    district: "Namakwa District",
    province: "Northern Cape",
    transitLines: ["Springbok Local Taxi"],
  },
  {
    id: "de_aar",
    name: "De Aar",
    city: "De Aar",
    district: "Pixley ka Seme District",
    province: "Northern Cape",
    transitLines: ["De Aar-Colesberg Taxi"],
  },
  {
    id: "upington",
    name: "Upington",
    city: "Upington",
    district: "ZF Mgcawu District",
    province: "Northern Cape",
    transitLines: ["Upington Local Taxi"],
  }
];

export const initialWorkers: WorkerProfile[] = [
  {
    id: "worker_1",
    fullName: "Sipho Ndlovu",
    phoneNumber: "+27 82 459 1102",
    email: "sipho.ndlovu@gmail.com",
    location: "soweto",
    skills: ["Plumbing", "Leak Repair", "Drain Unblocking"],
    hourlyRate: 85,
    availability: "Available",
    bio: "Experienced plumber with 6 years working around Soweto and JHB Central. Specializes in bathroom installations, leak fixing, and drain cleaning. Reliable and has own tools.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400", // Plumbing pipe work
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400", // Pipe fitting
    ],
    completedJobsCount: 42,
    rating: 4.9,
    isVisible: true,
  },
  {
    id: "worker_2",
    fullName: "Nomvula Khumalo",
    phoneNumber: "+27 73 982 4431",
    email: "nomvula.k@yahoo.com",
    location: "alexandra",
    skills: ["Domestic Work", "Deep Cleaning", "Laundry & Ironing"],
    hourlyRate: 65,
    availability: "Available",
    bio: "Hardworking domestic professional. I provide thorough cleaning, iron delicately, and can help with weekly meal prep. Regularly take the Alex-Sandton Taxi link daily.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400", // Clean home
    ],
    completedJobsCount: 19,
    rating: 4.7,
    isVisible: true,
  },
  {
    id: "worker_3",
    fullName: "Pieter Botha",
    phoneNumber: "+27 84 321 0098",
    email: "pieter.botha.paint@gmail.com",
    location: "bellville",
    skills: ["Painting", "Wall Scraping", "Varnish Woodwork"],
    hourlyRate: 95,
    availability: "Part-time",
    bio: "Professional painter for residential houses and apartments. Over 10 years experience. Excellent attention to prep-work which ensures paint lasts long. Travel along Mitchells Plain-Bellville and Khayelitsha-Bellville lines.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400", // Wall painting
    ],
    completedJobsCount: 31,
    rating: 4.8,
    isVisible: true,
  },
  {
    id: "worker_4",
    fullName: "Thabo Mokoena",
    phoneNumber: "+27 61 776 5543",
    email: "thabo.garden@outlook.com",
    location: "soweto",
    skills: ["Gardening", "Lawn Mowing", "Tree Felling"],
    hourlyRate: 70,
    availability: "Available",
    bio: "Passionate landscaper and gardener. I do clean-ups, lawn-mowing, flowerbed creation, and hedge trimming. Reliable, brings own basic equipment.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400", // Gardening work
    ],
    completedJobsCount: 15,
    rating: 4.6,
    isVisible: true,
  },
  {
    id: "worker_5",
    fullName: "Amahle Zondi",
    phoneNumber: "+27 72 453 9091",
    email: "amahle.zondi@gmail.com",
    location: "khayelitsha",
    skills: ["Sewing", "Tailoring", "Curtain Alterations"],
    hourlyRate: 110,
    availability: "Available",
    bio: "Fashion design graduate working as an informal seamstress. I tailor dresses, suit fittings, and make custom curtains. High precision and fast turnaround.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1528570221379-33827ba135a5?auto=format&fit=crop&q=80&w=400", // Sewing machine alterations
    ],
    completedJobsCount: 26,
    rating: 5.0,
    isVisible: true,
  },
];

export const initialJobs: JobPosting[] = [
  {
    id: "job_1",
    clientId: "client_1",
    clientName: "Lerato Molefe",
    title: "Urgent Kitchen Pipe Leak Repair",
    category: "Plumbing",
    description: "Our kitchen sink pipe burst this morning and we had to shut off the main water supply. Need an experienced plumber to replace the joint and restore water. Must bring own pipe wrenches.",
    location: "sandton",
    budget: 350, // total or equivalent
    duration: "4 Hours",
    transitRouteRequired: ["Soweto-Sandton Taxi", "JHB CBD-Sandton Taxi"],
    status: "Open",
    clientPhone: "+27 82 890 4321",
  },
  {
    id: "job_2",
    clientId: "client_2",
    clientName: "David Harrison",
    title: "Double-Story House Exterior Painting",
    category: "Painting",
    description: "Looking for a skilled painter to scrape off old peeling paint and paint the exterior walls of a 4-bedroom house. Paint and brushes will be provided, but you must have a ladder or comfortable working with height.",
    location: "bellville",
    budget: 2400,
    duration: "4 Days",
    transitRouteRequired: ["Mitchells Plain-Bellville Taxi", "Khayelitsha-Bellville Taxi"],
    status: "Open",
    clientPhone: "+27 84 454 3210",
  },
  {
    id: "job_3",
    clientId: "client_3",
    clientName: "Zandile Mthembu",
    title: "Full Garden Clean-up & Hedge Trimming",
    category: "Gardening",
    description: "Need a thorough garden cleaning. Overgrown grass, weeding, trimming bougainvillea hedges, and bagging garden refuse. Refuse bags provided. Garden trimmer is a plus.",
    location: "jhb_cbd",
    budget: 450,
    duration: "1 Day",
    transitRouteRequired: ["Soweto-JHB CBD Taxi", "Alex-JHB CBD Taxi"],
    status: "Open",
    clientPhone: "+27 71 332 9901",
  },
  {
    id: "job_4",
    clientId: "client_4",
    clientName: "Precious Dlamini",
    title: "Once-off Spring Cleaning",
    category: "Domestic Work",
    description: "Need someone for a thorough spring clean of a 2-bedroom apartment. Focus on window washing, scrubbing oven, wiping down inside cupboards, and deep floor wash.",
    location: "sandton",
    budget: 400,
    duration: "1 Day",
    transitRouteRequired: ["Alex-Sandton Taxi", "Soweto-Sandton Taxi"],
    status: "Open",
    clientPhone: "+27 73 111 8892",
  },
];

export const initialMessages: Message[] = [
  {
    id: "msg_1",
    senderId: "worker_1",
    senderRole: "worker",
    receiverId: "client_1",
    content: "Sanibona, I saw your post about the kitchen leak. I am currently in Soweto and can take the Soweto-Sandton taxi line. I can be there in 45 minutes.",
    timestamp: "2026-07-08T09:15:00-07:00",
    jobId: "job_1",
  },
  {
    id: "msg_2",
    senderId: "client_1",
    senderRole: "client",
    receiverId: "worker_1",
    content: "Dumelang! Yes, the water is currently shut off. Do you have a spare 50mm copper sleeve joint? That is what looks cracked.",
    timestamp: "2026-07-08T09:20:00-07:00",
    jobId: "job_1",
  },
  {
    id: "msg_3",
    senderId: "worker_1",
    senderRole: "worker",
    receiverId: "client_1",
    content: "Yebo, I have a few copper couplings and sleeves in my toolbox, as well as thread tape and solder. I will bring them all. Let's agree on R85 per hour, plus R50 for the material?",
    timestamp: "2026-07-08T09:23:00-07:00",
    jobId: "job_1",
  },
];

export function getLocalStorageData() {
  if (typeof window === "undefined") {
    return {
      workers: initialWorkers,
      jobs: initialJobs,
      messages: initialMessages,
      contracts: [] as any[],
    };
  }

  const workers = localStorage.getItem("sizawork_workers");
  const jobs = localStorage.getItem("sizawork_jobs");
  const messages = localStorage.getItem("sizawork_messages");
  const contracts = localStorage.getItem("sizawork_contracts");

  if (!workers || !jobs || !messages) {
    localStorage.setItem("sizawork_workers", JSON.stringify(initialWorkers));
    localStorage.setItem("sizawork_jobs", JSON.stringify(initialJobs));
    localStorage.setItem("sizawork_messages", JSON.stringify(initialMessages));
    localStorage.setItem("sizawork_contracts", JSON.stringify([]));
    return {
      workers: initialWorkers,
      jobs: initialJobs,
      messages: initialMessages,
      contracts: [],
    };
  }

  return {
    workers: JSON.parse(workers),
    jobs: JSON.parse(jobs),
    messages: JSON.parse(messages),
    contracts: contracts ? JSON.parse(contracts) : [],
  };
}

export function saveLocalStorageData(data: {
  workers: WorkerProfile[];
  jobs: JobPosting[];
  messages: Message[];
  contracts: any[];
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sizawork_workers", JSON.stringify(data.workers));
  localStorage.setItem("sizawork_jobs", JSON.stringify(data.jobs));
  localStorage.setItem("sizawork_messages", JSON.stringify(data.messages));
  localStorage.setItem("sizawork_contracts", JSON.stringify(data.contracts));
}
