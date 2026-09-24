export interface WeddingImage {
  id: string;
  url: string;
  name: string;
  caption: string;
  photographer?: string;
}

export interface WeddingAlbum {
  id: string;
  title: string;
  couple: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  photographer: string;
  guestCount: number;
  theme: string;
  badge: string;
  story: string;
  coverImage: string;
  images: WeddingImage[];
}

export const WEDDING_ALBUMS: WeddingAlbum[] = [
  {
    id: 'arjun-ananya-udaipur',
    title: "Arjun & Ananya's Royal Palace Wedding",
    couple: "Arjun Singhal & Ananya Sharma",
    venue: "The City Palace & Jagmandir Island",
    city: "Udaipur",
    state: "Rajasthan",
    date: "November 18, 2025",
    photographer: "Devendra Rathore | Royal Frames Studio",
    guestCount: 380,
    theme: "Royal Rajputana Grandeur & Pichola Lake Procession",
    badge: "Royal Palace",
    story: "Set on the shimmering waters of Lake Pichola, Arjun and Ananya exchanged vows against the 400-year-old marble courtyards of Udaipur's City Palace, followed by a candlelit floating banquet at Jagmandir Island.",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    images: [
      { id: 'u-01', url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", name: "ananya_bridal_regal.jpg", caption: "Ananya in her hand-embroidered zardozi royal lehenga" },
      { id: 'u-02', url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", name: "vow_hands_rings.jpg", caption: "The sacred promise sealed with emerald heirloom bands" },
      { id: 'u-03', url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85", name: "palace_banquet_tables.jpg", caption: "Jagmandir Island courtyard banquet with marigolds and tuberose" },
      { id: 'u-04', url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85", name: "couple_lake_promenade.jpg", caption: "Arjun and Ananya walking along the Pichola lakeside promenade" },
      { id: 'u-05', url: "https://images.unsplash.com/photo-1532712938730-4e36c457b1c5?auto=format&fit=crop&w=1200&q=85", name: "royal_mandap_canopy.jpg", caption: "Floating mandap sculpted with red roses and brass lanterns" },
      { id: 'u-06', url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85", name: "sacred_hands_varmala.jpg", caption: "Tied together in eternal commitment during the pheras" },
      { id: 'u-07', url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85", name: "kundan_jewelry_details.jpg", caption: "Traditional polki and kundan jewellery of the royal bride" },
      { id: 'u-08', url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85", name: "golden_hour_embrace.jpg", caption: "Golden hour sunset portrait from the Zenana Mahal terrace" },
      { id: 'u-09', url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85", name: "bridal_kalire_veil.jpg", caption: "Golden kalire dangling softly before the grand entry" },
      { id: 'u-10', url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=85", name: "first_look_smile.jpg", caption: "Arjun's breathless reaction seeing Ananya step into the pavilion" },
      { id: 'u-11', url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85", name: "royal_dinner_cheers.jpg", caption: "Families raising a glass under the crystal chandeliers" },
      { id: 'u-12', url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85", name: "aisle_flower_path.jpg", caption: "Petal-dusted carpet leading to the water's edge" },
      { id: 'u-13', url: "https://images.unsplash.com/photo-1545232979-fbf6c97a55c2?auto=format&fit=crop&w=1200&q=85", name: "palace_amber_lights.jpg", caption: "The illuminated ramparts casting reflections across Pichola" },
      { id: 'u-14', url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=85", name: "varmala_exchange_moment.jpg", caption: "Varmala garland exchange under a shower of fragrant Mogra" },
      { id: 'u-15', url: "https://images.unsplash.com/photo-1609151162377-794fa68b02f6?auto=format&fit=crop&w=1200&q=85", name: "candid_ananya_laughter.jpg", caption: "Candid laughter during the ring-hunting ritual" },
      { id: 'u-16', url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85", name: "grand_reception_tables.jpg", caption: "Five-course royal banquet set with antique silver thalis" },
      { id: 'u-17', url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85", name: "starlit_lake_portrait.jpg", caption: "Twilight silhouette with the Jag Niwas palace glowing behind" },
      { id: 'u-18', url: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=1200&q=85", name: "henna_mehendi_clasp.jpg", caption: "Intricate bridal henna detailing secret initials of Arjun" },
      { id: 'u-19', url: "https://images.unsplash.com/photo-1549416869-d6e06556f8f5?auto=format&fit=crop&w=1200&q=85", name: "haveli_courtyard_guests.jpg", caption: "Guests admiring the vintage Rajasthani folk musicians" },
      { id: 'u-20', url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85", name: "rose_petal_congratulations.jpg", caption: "Petals cascading down as newly crowned husband and wife" },
      { id: 'u-21', url: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1200&q=85", name: "sheer_veil_portrait.jpg", caption: "Dramatic sheer crimson veil catching the palace breeze" },
      { id: 'u-22', url: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=85", name: "royal_cake_cutting.jpg", caption: "Five-tier saffron-pistachio celebration cake cutting" },
      { id: 'u-23', url: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=1200&q=85", name: "first_dance_jagmandir.jpg", caption: "Their first dance beneath the stars on the island courtyard" },
      { id: 'u-24', url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=85", name: "groom_sherwani_sword.jpg", caption: "Arjun in ivory silk sherwani and royal heritage sword" },
      { id: 'u-25', url: "https://images.unsplash.com/photo-1546804784-896d0dca3800?auto=format&fit=crop&w=1200&q=85", name: "lake_pichola_fireworks.jpg", caption: "Spectacular fireworks illuminating Lake Pichola at midnight" }
    ]
  },
  {
    id: 'kabir-meera-goa',
    title: "Kabir & Meera's Coastal Sunset Nuptials",
    couple: "Kabir Varma & Meera Alvares",
    venue: "Cabo Serai & Morjim Seaside Sanctuary",
    city: "Goa",
    state: "Goa",
    date: "December 12, 2025",
    photographer: "Maya D'Souza | Oceanic Tales Photography",
    guestCount: 210,
    theme: "Boho Tropical Coastline & Golden Hour Vows",
    badge: "Beach & Sunset",
    story: "Barefoot in the golden sands with Arabian Sea waves crashing gently in rhythm, Kabir and Meera celebrated an intimate coastal union surrounded by palm fronds, warm sea breeze, and acoustic sunset melodies.",
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85",
    images: [
      { id: 'g-01', url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85", name: "barefoot_beach_aisle.jpg", caption: "Barefoot bamboo altar right at the water's edge" },
      { id: 'g-02', url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85", name: "sunset_coastal_silhouette.jpg", caption: "Golden hour silhouette against the Arabian Sea horizon" },
      { id: 'g-03', url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85", name: "palm_leaf_tablescape.jpg", caption: "Boho tablescape with monstera leaves, pampas grass, and shells" },
      { id: 'g-04', url: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=1200&q=85", name: "shoreline_laugh_run.jpg", caption: "Kabir and Meera running through the gentle coastal surf" },
      { id: 'g-05', url: "https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=1200&q=85", name: "driftwood_floral_arch.jpg", caption: "Natural driftwood circular arch draped with white orchids" },
      { id: 'g-06', url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=85", name: "meera_ocean_breeze.jpg", caption: "Meera's silk gown catching the afternoon Goan breeze" },
      { id: 'g-07', url: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&w=1200&q=85", name: "coconut_cocktail_welcome.jpg", caption: "Fresh spiced coconut water welcoming guests to the beach" },
      { id: 'g-08', url: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=85", name: "groom_linen_suit.jpg", caption: "Kabir in tailored beige linen observing the arriving guests" },
      { id: 'g-09', url: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a50b?auto=format&fit=crop&w=1200&q=85", name: "whispered_beach_vows.jpg", caption: "Personalized written vows read as waves crested the shore" },
      { id: 'g-10', url: "https://images.unsplash.com/photo-1532712938355-6677f98555e7?auto=format&fit=crop&w=1200&q=85", name: "protea_wildflower_bouquet.jpg", caption: "Wild coastal floral arrangement tied with raw twine" },
      { id: 'g-11', url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85", name: "golden_lens_flare.jpg", caption: "Warm amber glow wrapping the couple at sunset" },
      { id: 'g-12', url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85", name: "candid_meera_joy.jpg", caption: "Uncontrollable smiles after the final vow sealing" },
      { id: 'g-13', url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85", name: "champagne_splash_beach.jpg", caption: "Popping celebratory champagne onto the sunset sands" },
      { id: 'g-14', url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85", name: "acoustic_sunset_band.jpg", caption: "Live acoustic guitar by the ocean during dusk" },
      { id: 'g-15', url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85", name: "coastal_cliffs_dusk.jpg", caption: "Dramatic coastline cliffs of Cabo de Rama at sunset" },
      { id: 'g-16', url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85", name: "endless_sea_horizon.jpg", caption: "The tranquil vast ocean framing the ceremony meadow" },
      { id: 'g-17', url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85", name: "sand_dance_floor.jpg", caption: "Kicking off sandals to dance barefoot on the wooden deck" },
      { id: 'g-18', url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85", name: "guests_tropical_cheers.jpg", caption: "Friends sharing laughs with customized shell necklaces" },
      { id: 'g-19', url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85", name: "night_sparkler_tunnel.jpg", caption: "Sparkler farewell tunnel winding between the coconut trees" },
      { id: 'g-20', url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", name: "peaceful_tide_morning.jpg", caption: "Morning after serenity on the calm Morjim coastline" },
      { id: 'g-21', url: "https://images.unsplash.com/photo-1510076894343-a65c270d707c?auto=format&fit=crop&w=1200&q=85", name: "coastal_cove_portrait.jpg", caption: "Meera walking along the secluded sea cove rocks" },
      { id: 'g-22', url: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&w=1200&q=85", name: "tropical_canopy_shadows.jpg", caption: "Tropical palms casting dappled shadows on the ceremony lawn" },
      { id: 'g-23', url: "https://images.unsplash.com/photo-1510074377623-fa5c3ab81111?auto=format&fit=crop&w=1200&q=85", name: "sunset_ocean_vibe.jpg", caption: "Warm sea waves glowing in crimson and violet evening lights" },
      { id: 'g-24', url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85", name: "coastal_breeze_laugh.jpg", caption: "Kabir laughing with groomsmen by the seaside cabana" },
      { id: 'g-25', url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85", name: "beachside_dinner_gathering.jpg", caption: "Candlelit seaside long table banquet under open Goan skies" }
    ]
  },
  {
    id: 'rohan-sanjana-jaipur',
    title: "Rohan & Sanjana's Heritage Havelis & Sangeet",
    couple: "Rohan Kothari & Sanjana Bahl",
    venue: "Alila Fort Bishangarh & Samode Haveli",
    city: "Jaipur",
    state: "Rajasthan",
    date: "January 24, 2026",
    photographer: "Vivaah Stories by Joseph & Team",
    guestCount: 450,
    theme: "Vibrant Haldi, High-Octane Sangeet & Royal Fort Baraat",
    badge: "Heritage & Sangeet",
    story: "Spanning three days of electrifying festivities, Rohan and Sanjana brought together high-energy Punjabi and Marwari traditions — from a sunrise marigold Haldi splash to an open-air fortress Sangeet with 50 performers.",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    images: [
      { id: 'j-01', url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85", name: "haldi_yellow_splash.jpg", caption: "Explosive yellow marigold petal shower during the morning Haldi" },
      { id: 'j-02', url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85", name: "intricate_mehendi_hands.jpg", caption: "Dark bridal henna with hidden peacocks and wedding dates" },
      { id: 'j-03', url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=85", name: "antique_polki_choker.jpg", caption: "Heritage uncut diamond polki necklace inherited from grandmother" },
      { id: 'j-04', url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=85", name: "sanjana_getting_ready.jpg", caption: "Sanjana's mother placing the customary family borla maang tikka" },
      { id: 'j-05', url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85", name: "fort_arches_couple.jpg", caption: "Bishangarh fort stone arches framing Rohan and Sanjana" },
      { id: 'j-06', url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=85", name: "dhol_punjabi_beats.jpg", caption: "Nashik and Punjabi Dhol players driving the electric baraat" },
      { id: 'j-07', url: "https://images.unsplash.com/photo-1545959570-a9446383a8f4?auto=format&fit=crop&w=1200&q=85", name: "sangeet_dance_stage.jpg", caption: "High-voltage choreography battle between bride and groom squads" },
      { id: 'j-08', url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=85", name: "vintage_rolls_royce_entry.jpg", caption: "Rohan arriving in a restored 1938 ivory convertible" },
      { id: 'j-09', url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85", name: "embroidered_safa_turban.jpg", caption: "Pink Kota Doria royal turbans tied for all 200 baraatis" },
      { id: 'j-10', url: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1200&q=85", name: "courtyard_brass_diyas.jpg", caption: "Over 3,000 brass oil lamps illuminating the haveli staircases" },
      { id: 'j-11', url: "https://images.unsplash.com/photo-1546768292-bf12635664ab?auto=format&fit=crop&w=1200&q=85", name: "sangeet_slow_waltz.jpg", caption: "Rohan spinning Sanjana under the open desert night sky" },
      { id: 'j-12', url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85", name: "rajasthani_dal_baati_feast.jpg", caption: "Traditional royal Rajasthani banquet feast served on silver katoris" },
      { id: 'j-13', url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85", name: "bhangra_family_circle.jpg", caption: "Grandmothers and cousins joining the unstoppable bhangra circle" },
      { id: 'j-14', url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", name: "aravali_hills_sunset.jpg", caption: "The sun setting over the rugged Aravali hills of Bishangarh" },
      { id: 'j-15', url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85", name: "ruby_red_dupatta.jpg", caption: "Sanjana adjusting her velvet bridal veil before pheras" },
      { id: 'j-16', url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85", name: "saath_phere_fire.jpg", caption: "Walking around the agni kund with Vedic chants echoing" },
      { id: 'j-17', url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85", name: "sindoor_sacred_parting.jpg", caption: "The emotional moment vermillion touched Sanjana's forehead" },
      { id: 'j-18', url: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=1200&q=85", name: "gulab_rose_shower.jpg", caption: "Two hundred kilograms of fragrant Desi Gulab petals raining down" },
      { id: 'j-19', url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85", name: "tearful_vidaai_hug.jpg", caption: "Bittersweet tearful embrace with parents during the Vidaai" },
      { id: 'j-20', url: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=85", name: "fortress_night_fireworks.jpg", caption: "Sky shot fireworks cascading down the ancient stone battlements" },
      { id: 'j-21', url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85", name: "laughing_joota_chupai.jpg", caption: "Sisters celebrating the successful stealing of Rohan's shoes" },
      { id: 'j-22', url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85", name: "groomsmen_toss_rohan.jpg", caption: "Groomsmen lifting Rohan into the air in sheer celebration" },
      { id: 'j-23', url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85", name: "confetti_blast_reception.jpg", caption: "Gold foil canons bursting open as the couple enters the afterparty" },
      { id: 'j-24', url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85", name: "jharokha_window_candid.jpg", caption: "Sanjana peering through carved stone jharokha watching the baraat" },
      { id: 'j-25', url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85", name: "afterparty_dj_stage.jpg", caption: "Dancing till 4:00 AM under laser projections on the fort walls" }
    ]
  },
  {
    id: 'dev-ishita-manali',
    title: "Dev & Ishita's Himalayan Pine Meadow Union",
    couple: "Dev Sen & Ishita Mukherjee",
    venue: "Solang Valley Pines & Span Resort",
    city: "Manali",
    state: "Himachal Pradesh",
    date: "February 14, 2026",
    photographer: "Alpine Whispers | Kabir Thapa",
    guestCount: 120,
    theme: "Cedar Woods, Snow-Capped Peaks & Intimate Warmth",
    badge: "Himalayan Forest",
    story: "Tucked inside a centuries-old deodar pine forest with snow-dusted Himalayan peaks towering overhead, Dev and Ishita held an intimate rustic mountain wedding complete with woolen pashminas, bonfire feasts, and gentle mountain flutes.",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    images: [
      { id: 'm-01', url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85", name: "snowy_himalayan_peaks.jpg", caption: "Snow-capped peaks of the Pir Panjal range overlooking the valley" },
      { id: 'm-02', url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85", name: "pine_canopy_morning.jpg", caption: "Morning mist weaving through tall cedar trees at 7,500 feet" },
      { id: 'm-03', url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=85", name: "alpine_meadow_altar.jpg", caption: "Open-air natural wooden mandap constructed with fallen cedar logs" },
      { id: 'm-04', url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85", name: "stone_cottage_prep.jpg", caption: "Rustic stone lodge where Dev and Ishita prepared for their day" },
      { id: 'm-05', url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=85", name: "ishita_pashmina_wrap.jpg", caption: "Hand-spun walnut Pashmina shawl keeping Ishita warm in the cold air" },
      { id: 'm-06', url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85", name: "hands_over_pine_fire.jpg", caption: "Warming hands together over the pinecone hearth before vows" },
      { id: 'm-07', url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85", name: "forest_needle_trail.jpg", caption: "Strolling along the fragrant brown pine needle forest paths" },
      { id: 'm-08', url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85", name: "pinecone_wildflowers.jpg", caption: "Bouquet of Himalayan mountain wildflowers and deodar cones" },
      { id: 'm-09', url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=85", name: "raw_wood_tables.jpg", caption: "Handmade oak tables decorated with moss, ferns, and candles" },
      { id: 'm-10', url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85", name: "mulled_cider_toast.jpg", caption: "Steaming mugs of cinnamon spiced mountain apple cider" },
      { id: 'm-11', url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=85", name: "ishita_cabin_portrait.jpg", caption: "Ishita gazing through frosted glass windows at snow flurries" },
      { id: 'm-12', url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=85", name: "dev_tweed_sherwani.jpg", caption: "Dev in wool tweed sherwani styled with an amber mountain brooch" },
      { id: 'm-13', url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85", name: "alpenglow_sunset_mountains.jpg", caption: "Pink and violet alpenglow coloring the mountain ridges" },
      { id: 'm-14', url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", name: "sunbeam_pine_trees.jpg", caption: "Piercing sunlight streaming through the 80-foot cedar canopy" },
      { id: 'm-15', url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85", name: "tree_lanterns_dusk.jpg", caption: "Vintage oil storm lanterns suspended between low pine branches" },
      { id: 'm-16', url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=85", name: "firelit_lodge_dinner.jpg", caption: "Cozy seated feast with slow-roasted Himalayan trout and lentils" },
      { id: 'm-17', url: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=85", name: "first_dance_by_hearth.jpg", caption: "Slow dance beside the river stone outdoor fireplace" },
      { id: 'm-18', url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=85", name: "acoustic_flute_mountain.jpg", caption: "Local Pahari flute and acoustic strings weaving soothing tunes" },
      { id: 'm-19', url: "https://images.unsplash.com/photo-1475921084701-577a14701302?auto=format&fit=crop&w=1200&q=85", name: "marshmallow_campfire.jpg", caption: "Guests laughing and roasting s'mores under wool blankets" },
      { id: 'm-20', url: "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=1200&q=85", name: "gentle_snowfall_kiss.jpg", caption: "Flurries of snow settling on their hair during the evening kiss" },
      { id: 'm-21', url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85", name: "rustic_wild_berry_cake.jpg", caption: "Unfrosted spiced walnut cake dusted with powdered snow" },
      { id: 'm-22', url: "https://images.unsplash.com/photo-1504567961542-e24d9439a724?auto=format&fit=crop&w=1200&q=85", name: "starlit_sparkler_farewell.jpg", caption: "Golden sparklers reflecting off fresh mountain snow" },
      { id: 'm-23', url: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?auto=format&fit=crop&w=1200&q=85", name: "morning_valley_frost.jpg", caption: "Frost crystalline patterns forming on cedar needle branches" },
      { id: 'm-24', url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85", name: "himalayan_ridgeline_lookout.jpg", caption: "Dev and Ishita taking in their first morning as married partners" },
      { id: 'm-25', url: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=85", name: "cedar_bark_rings.jpg", caption: "Twin wedding bands resting on raw ancient cedar bark" }
    ]
  }
];

export function getWeddingAlbumById(id: string): WeddingAlbum | undefined {
  if (!id) return undefined;
  const cleanId = id.trim().toLowerCase();
  if (cleanId === 'demo') {
    return WEDDING_ALBUMS[0]; // Default demo is Arjun & Ananya's Royal Palace
  }
  return WEDDING_ALBUMS.find(album => album.id.toLowerCase() === cleanId);
}
