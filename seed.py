"""
Semantic Search Engine — Data Seed Script
Populates MongoDB with diverse documents and pre-computed embeddings.

Usage:
    python seed.py              # Clear existing docs, then seed
    python seed.py --no-clear   # Seed without clearing existing docs
"""
import sys
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# ── Configuration ─────────────────────────────────────────────
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "semantic_search_db")
COLLECTION_NAME = os.getenv("MONGODB_COLLECTION_NAME", "documents")
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

# ── Seed Data ─────────────────────────────────────────────────
SEED_DOCUMENTS = [
    # ── Technology & AI (8 docs) ─────────────────────────────
    {
        "title": "Introduction to Machine Learning",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data, learn from it, and make predictions or decisions. Common approaches include supervised learning, unsupervised learning, and reinforcement learning.",
        "category": "Technology & AI"
    },
    {
        "title": "The Rise of Large Language Models",
        "content": "Large language models like GPT-4, Claude, and Gemini have transformed how we interact with AI. These models are trained on vast amounts of text data and can generate human-like responses, translate languages, write code, and answer complex questions. They represent a major leap in natural language processing capabilities.",
        "category": "Technology & AI"
    },
    {
        "title": "Cloud Computing Fundamentals",
        "content": "Cloud computing delivers computing services over the internet, including servers, storage, databases, networking, software, and analytics. Major providers like AWS, Azure, and Google Cloud Platform offer scalable infrastructure that eliminates the need for organizations to maintain physical data centers. This has revolutionized how businesses deploy and manage applications.",
        "category": "Technology & AI"
    },
    {
        "title": "Cybersecurity in the Digital Age",
        "content": "Cybersecurity involves protecting computer systems, networks, and data from digital attacks. With increasing reliance on technology, threats like ransomware, phishing, and data breaches have become more sophisticated. Organizations must implement multi-layered security strategies including encryption, multi-factor authentication, and regular security audits to protect sensitive information.",
        "category": "Technology & AI"
    },
    {
        "title": "Blockchain Technology Explained",
        "content": "Blockchain is a decentralized, distributed digital ledger that records transactions across many computers. Each block contains a cryptographic hash of the previous block, creating an immutable chain. Beyond cryptocurrency, blockchain has applications in supply chain management, healthcare records, voting systems, and smart contracts.",
        "category": "Technology & AI"
    },
    {
        "title": "The Internet of Things Revolution",
        "content": "The Internet of Things connects everyday devices to the internet, enabling them to send and receive data. From smart home thermostats to industrial sensors, IoT is transforming industries by providing real-time monitoring, automation, and data-driven insights. By 2025, there are estimated to be over 75 billion connected devices worldwide.",
        "category": "Technology & AI"
    },
    {
        "title": "Quantum Computing Progress",
        "content": "Quantum computing harnesses the principles of quantum mechanics to process information in fundamentally new ways. Unlike classical bits, quantum bits or qubits can exist in multiple states simultaneously through superposition. This enables quantum computers to solve certain problems exponentially faster than classical computers, particularly in cryptography, drug discovery, and optimization.",
        "category": "Technology & AI"
    },
    {
        "title": "DevOps and Continuous Integration",
        "content": "DevOps is a set of practices that combines software development and IT operations to shorten the development lifecycle. Continuous Integration and Continuous Deployment (CI/CD) pipelines automate testing and deployment, enabling teams to deliver software updates more frequently and reliably. Tools like Docker, Kubernetes, Jenkins, and GitHub Actions are central to modern DevOps workflows.",
        "category": "Technology & AI"
    },

    # ── Science & Space (6 docs) ─────────────────────────────
    {
        "title": "The James Webb Space Telescope",
        "content": "The James Webb Space Telescope, launched in December 2021, is the most powerful space telescope ever built. It observes the universe in infrared light, allowing it to peer through cosmic dust clouds and see the earliest galaxies formed after the Big Bang. Its discoveries are reshaping our understanding of star formation, exoplanet atmospheres, and the age of the universe.",
        "category": "Science & Space"
    },
    {
        "title": "CRISPR Gene Editing Technology",
        "content": "CRISPR-Cas9 is a revolutionary gene editing tool that allows scientists to precisely modify DNA sequences. Discovered from a bacterial immune system, it has applications in treating genetic diseases, developing drought-resistant crops, and combating antibiotic-resistant bacteria. Clinical trials are underway for sickle cell disease, cancer immunotherapy, and hereditary blindness.",
        "category": "Science & Space"
    },
    {
        "title": "Mars Exploration and Colonization",
        "content": "Mars exploration has accelerated with rovers like Perseverance analyzing the planet's geology and searching for signs of ancient microbial life. SpaceX's Starship aims to transport humans to Mars, while NASA's Artemis program plans a lunar gateway as a stepping stone. Challenges include radiation exposure, the thin atmosphere, and sustaining life on a planet with no breathable air.",
        "category": "Science & Space"
    },
    {
        "title": "The Physics of Black Holes",
        "content": "Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape. They form when massive stars collapse at the end of their life cycle. The Event Horizon Telescope captured the first image of a black hole in 2019. Stephen Hawking theorized that black holes emit radiation and slowly evaporate over time, known as Hawking radiation.",
        "category": "Science & Space"
    },
    {
        "title": "Ocean Exploration and Deep-Sea Life",
        "content": "The deep ocean remains one of Earth's last frontiers, with over 80 percent of the ocean floor unmapped. Submersibles and remotely operated vehicles have discovered extraordinary creatures adapted to extreme pressure and darkness, including bioluminescent organisms and extremophiles near hydrothermal vents. These discoveries challenge our understanding of where life can exist.",
        "category": "Science & Space"
    },
    {
        "title": "Nuclear Fusion Energy Breakthrough",
        "content": "Nuclear fusion, the process that powers the sun, promises virtually unlimited clean energy. In December 2022, the National Ignition Facility achieved fusion ignition for the first time, producing more energy from fusion than the laser energy used to drive it. Projects like ITER in France aim to demonstrate that fusion power can be commercially viable by the 2030s.",
        "category": "Science & Space"
    },

    # ── Health & Wellness (6 docs) ───────────────────────────
    {
        "title": "The Science of Sleep",
        "content": "Sleep is essential for physical and mental health. During sleep, the brain consolidates memories, clears toxins, and repairs neural connections. Adults need 7-9 hours of quality sleep per night. Sleep deprivation increases the risk of obesity, heart disease, diabetes, and depression. Good sleep hygiene includes maintaining a consistent schedule, limiting screen time, and keeping a cool, dark bedroom.",
        "category": "Health & Wellness"
    },
    {
        "title": "Mental Health and Meditation",
        "content": "Meditation and mindfulness practices have been shown to reduce stress, anxiety, and symptoms of depression. Research demonstrates that regular meditation can physically change brain structure, increasing gray matter in areas associated with self-awareness, compassion, and introspection. Apps like Headspace and Calm have made meditation accessible to millions of people worldwide.",
        "category": "Health & Wellness"
    },
    {
        "title": "Nutrition and the Gut Microbiome",
        "content": "The gut microbiome consists of trillions of microorganisms that play a crucial role in digestion, immune function, and even mental health through the gut-brain axis. A diet rich in fiber, fermented foods, and diverse plant-based foods promotes a healthy microbiome. Research has linked gut health to conditions ranging from autoimmune diseases to mood disorders.",
        "category": "Health & Wellness"
    },
    {
        "title": "Advances in Cancer Treatment",
        "content": "Cancer treatment has been transformed by immunotherapy, which harnesses the patient's own immune system to fight cancer cells. CAR-T cell therapy, immune checkpoint inhibitors, and cancer vaccines represent major breakthroughs. Personalized medicine, which tailors treatment based on a tumor's genetic profile, is improving outcomes and reducing side effects for many cancer patients.",
        "category": "Health & Wellness"
    },
    {
        "title": "Exercise and Brain Health",
        "content": "Regular physical exercise has profound effects on brain health. It increases blood flow to the brain, promotes neurogenesis (the growth of new neurons), and releases neurotransmitters like endorphins and serotonin. Studies show that aerobic exercise can improve memory, reduce the risk of dementia, and alleviate symptoms of anxiety and depression.",
        "category": "Health & Wellness"
    },
    {
        "title": "Telemedicine and Digital Health",
        "content": "Telemedicine has become a vital part of healthcare delivery, allowing patients to consult with doctors remotely via video calls. Digital health technologies including wearable devices, health monitoring apps, and AI-powered diagnostic tools are making healthcare more accessible and personalized. The COVID-19 pandemic accelerated adoption, and telemedicine is now a permanent fixture in modern healthcare.",
        "category": "Health & Wellness"
    },

    # ── Business & Finance (5 docs) ──────────────────────────
    {
        "title": "The Future of Remote Work",
        "content": "Remote work has fundamentally changed how organizations operate. Companies are adopting hybrid models where employees split time between office and home. This shift has led to investments in collaboration tools, virtual office platforms, and new management strategies. Remote work offers benefits like flexibility and access to global talent pools, while challenges include maintaining team culture and work-life balance.",
        "category": "Business & Finance"
    },
    {
        "title": "Cryptocurrency and Digital Finance",
        "content": "Cryptocurrency has evolved from a niche technology to a major financial asset class. Bitcoin, Ethereum, and thousands of altcoins offer alternatives to traditional banking. Decentralized Finance (DeFi) platforms enable lending, borrowing, and trading without intermediaries. Central banks worldwide are exploring Central Bank Digital Currencies (CBDCs) as a digital evolution of national currencies.",
        "category": "Business & Finance"
    },
    {
        "title": "Startup Ecosystem and Venture Capital",
        "content": "The startup ecosystem thrives on innovation, disruption, and rapid growth. Venture capital firms invest in early-stage companies with high growth potential, providing funding, mentorship, and industry connections. Silicon Valley remains a hub, but startup ecosystems have emerged in cities worldwide. Key metrics include product-market fit, customer acquisition cost, and monthly recurring revenue.",
        "category": "Business & Finance"
    },
    {
        "title": "Supply Chain Management and Logistics",
        "content": "Modern supply chain management leverages technology to optimize the flow of goods from manufacturers to consumers. AI-driven demand forecasting, warehouse automation with robotics, and real-time tracking systems improve efficiency and reduce costs. The COVID-19 pandemic exposed vulnerabilities in global supply chains, driving a shift toward nearshoring and diversified supplier networks.",
        "category": "Business & Finance"
    },
    {
        "title": "ESG Investing and Sustainable Business",
        "content": "Environmental, Social, and Governance (ESG) investing has grown rapidly as investors seek to align their portfolios with sustainability goals. Companies are increasingly reporting on carbon emissions, diversity metrics, and corporate governance practices. Green bonds, impact investing, and sustainability-linked loans are financial instruments driving capital toward environmentally and socially responsible projects.",
        "category": "Business & Finance"
    },

    # ── Environment & Sustainability (5 docs) ────────────────
    {
        "title": "Climate Change and Renewable Energy",
        "content": "Climate change driven by greenhouse gas emissions is one of the most pressing global challenges. Renewable energy sources including solar, wind, and hydroelectric power are essential for reducing carbon emissions. Solar energy costs have dropped by over 90 percent in the last decade, making it the cheapest electricity source in many regions. The transition to clean energy is critical for limiting global warming to 1.5 degrees Celsius.",
        "category": "Environment & Sustainability"
    },
    {
        "title": "Electric Vehicles and Transportation",
        "content": "Electric vehicles are transforming the automotive industry, with companies like Tesla, Rivian, and legacy automakers investing billions in EV development. Battery technology improvements have increased range and reduced costs. Government incentives and emissions regulations are accelerating adoption. EV charging infrastructure is expanding rapidly, with fast chargers enabling long-distance travel.",
        "category": "Environment & Sustainability"
    },
    {
        "title": "Biodiversity Conservation",
        "content": "Biodiversity loss threatens ecosystems worldwide as species extinction rates accelerate due to habitat destruction, pollution, and climate change. Conservation efforts include establishing protected areas, wildlife corridors, and rewilding projects. The UN Biodiversity Conference has set targets to protect 30 percent of land and ocean by 2030. Indigenous communities play a vital role in conservation as stewards of some of the most biodiverse regions.",
        "category": "Environment & Sustainability"
    },
    {
        "title": "Sustainable Agriculture and Food Systems",
        "content": "Sustainable agriculture aims to meet food demand while preserving natural resources for future generations. Practices include regenerative farming, vertical farming, precision agriculture with drones and sensors, and reducing food waste. Plant-based proteins and lab-grown meat are emerging alternatives that require less land, water, and energy compared to conventional animal agriculture.",
        "category": "Environment & Sustainability"
    },
    {
        "title": "Water Scarcity and Conservation",
        "content": "Water scarcity affects over 2 billion people worldwide and is worsening due to climate change, population growth, and pollution. Solutions include desalination technology, rainwater harvesting, drip irrigation, and water recycling systems. Smart water management using IoT sensors and AI can detect leaks and optimize distribution. Protecting watersheds and wetlands is essential for maintaining freshwater supplies.",
        "category": "Environment & Sustainability"
    },

    # ── History & Culture (5 docs) ────────────────────────────
    {
        "title": "The Digital Preservation of Cultural Heritage",
        "content": "Museums and cultural institutions are using 3D scanning, virtual reality, and digital archives to preserve artifacts and historical sites. Google Arts and Culture has digitized millions of artworks from museums worldwide. Digital preservation ensures that cultural heritage is accessible to future generations and protects irreplaceable works from damage by natural disasters, conflict, or climate change.",
        "category": "History & Culture"
    },
    {
        "title": "The History of the Internet",
        "content": "The internet evolved from ARPANET, a US military research network created in 1969. Tim Berners-Lee invented the World Wide Web in 1989, transforming the internet into a public information system. The dot-com boom of the late 1990s, the rise of social media in the 2000s, and the mobile revolution of the 2010s have made the internet an integral part of daily life for billions of people.",
        "category": "History & Culture"
    },
    {
        "title": "Ancient Civilizations and Their Innovations",
        "content": "Ancient civilizations made remarkable contributions to human progress. The Mesopotamians developed writing and mathematics, the Egyptians built the pyramids and advanced medicine, the Greeks pioneered democracy and philosophy, and the Romans engineered aqueducts and roads. These innovations laid the foundation for modern science, governance, and infrastructure.",
        "category": "History & Culture"
    },
    {
        "title": "The Renaissance and Scientific Revolution",
        "content": "The Renaissance, spanning the 14th to 17th centuries, was a period of cultural rebirth in Europe that transformed art, science, and philosophy. Artists like Leonardo da Vinci and Michelangelo created masterpieces, while scientists like Copernicus, Galileo, and Newton revolutionized our understanding of the natural world. The printing press enabled the rapid spread of knowledge and ideas.",
        "category": "History & Culture"
    },
    {
        "title": "Space Race and the Moon Landing",
        "content": "The Space Race between the United States and the Soviet Union drove unprecedented advances in space exploration. The Soviet Union launched Sputnik in 1957 and sent Yuri Gagarin into orbit in 1961. The United States responded with the Apollo program, culminating in Neil Armstrong's historic moon landing on July 20, 1969. This achievement remains one of humanity's greatest technological accomplishments.",
        "category": "History & Culture"
    },
]


def main():
    no_clear = "--no-clear" in sys.argv

    print("=" * 60)
    print("🌱 SEMANTIC SEARCH ENGINE — DATA SEED SCRIPT")
    print("=" * 60)

    # ── Connect to MongoDB ────────────────────────────────────
    print("\n📡 Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        print(f"   ✅ Connected to {DB_NAME}/{COLLECTION_NAME}")
    except Exception as e:
        print(f"   ❌ Connection failed: {e}")
        sys.exit(1)

    # ── Optionally clear existing documents ───────────────────
    if not no_clear:
        existing = collection.count_documents({})
        if existing > 0:
            print(f"\n🗑️  Clearing {existing} existing document(s)...")
            collection.delete_many({})
            print("   ✅ Collection cleared")
    else:
        print("\n⏭️  Skipping clear (--no-clear flag set)")

    # ── Load embedding model ──────────────────────────────────
    print(f"\n🤖 Loading embedding model: {MODEL_NAME}")
    print("   (this may take a moment on first run)...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(MODEL_NAME)
    test_vec = model.encode("test")
    dim = len(test_vec)
    print(f"   ✅ Model loaded — output dimension: {dim}")

    # ── Generate embeddings and insert ────────────────────────
    total = len(SEED_DOCUMENTS)
    print(f"\n📝 Seeding {total} documents...\n")

    # Batch-encode all content for efficiency
    texts = [doc["content"] for doc in SEED_DOCUMENTS]
    print("   Generating embeddings (batch)...")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=32)
    print(f"   ✅ Generated {len(embeddings)} embeddings\n")

    # Build documents for insertion
    now = datetime.now(timezone.utc)
    docs_to_insert = []
    for i, doc in enumerate(SEED_DOCUMENTS):
        docs_to_insert.append({
            "title": doc["title"],
            "content": doc["content"],
            "category": doc["category"],
            "embedding": embeddings[i].tolist(),
            "created_at": now,
            "updated_at": now,
        })

    # Insert all at once
    result = collection.insert_many(docs_to_insert)
    inserted_count = len(result.inserted_ids)

    # ── Summary ───────────────────────────────────────────────
    print("=" * 60)
    print(f"🎉 SUCCESS: Inserted {inserted_count} documents")
    print("=" * 60)

    # Show category breakdown
    from collections import Counter
    categories = Counter(d["category"] for d in SEED_DOCUMENTS)
    print("\n📊 Category Breakdown:")
    for cat, count in sorted(categories.items()):
        print(f"   • {cat}: {count} docs")

    total_in_db = collection.count_documents({})
    print(f"\n📦 Total documents in collection: {total_in_db}")
    print(f"🔑 Embedding dimensions: {dim}")
    print(f"🏷️  Index name expected: {os.getenv('MONGODB_VECTOR_INDEX_NAME', 'vector_index')}")

    print("\n" + "=" * 60)
    print("✅ NEXT STEPS:")
    print("   1. Create the Atlas Vector Search Index (if not done)")
    print("   2. Run: python check_embeddings.py  (verify embeddings)")
    print("   3. Run: python verify_setup.py       (full system check)")
    print("=" * 60)

    client.close()


if __name__ == "__main__":
    main()
