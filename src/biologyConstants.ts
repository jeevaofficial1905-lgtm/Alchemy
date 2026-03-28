
export interface BiologyTopic {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  details: string[];
  color: string;
  icon: string;
}

export const BIOLOGY_TOPICS: BiologyTopic[] = [
  {
    id: "heart",
    name: "Human Heart",
    subtitle: "Circulation",
    summary: "The human heart is a muscular organ that pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to tissues and removing carbon dioxide and other wastes.",
    details: [
      "Four chambers: Right atrium, Right ventricle, Left atrium, Left ventricle.",
      "Double circulation: Pulmonary and Systemic.",
      "Valves ensure one-way blood flow.",
      "Electrical impulses coordinate the heartbeat."
    ],
    color: "#ef4444",
    icon: "Heart"
  },
  {
    id: "cell",
    name: "Plant Cell",
    subtitle: "Cell Biology",
    summary: "Plant cells are eukaryotic cells that differ in several key aspects from the cells of other eukaryotic organisms. Their distinctive features include a cell wall, large central vacuole, and chloroplasts.",
    details: [
      "Cell Wall: Provides structural support and protection.",
      "Chloroplasts: Site of photosynthesis.",
      "Large Central Vacuole: Maintains turgor pressure.",
      "Nucleus: Contains genetic material."
    ],
    color: "#22c55e",
    icon: "Leaf"
  },
  {
    id: "digestive",
    name: "Digestive System",
    subtitle: "Nutrition",
    summary: "The human digestive system consists of the gastrointestinal tract plus the accessory organs of digestion. Digestion involves the breakdown of food into smaller and smaller components.",
    details: [
      "Mouth: Mechanical and chemical digestion starts.",
      "Stomach: Acidic environment for protein breakdown.",
      "Small Intestine: Major site of nutrient absorption.",
      "Large Intestine: Water absorption and waste formation."
    ],
    color: "#f59e0b",
    icon: "Utensils"
  },
  {
    id: "neuron",
    name: "The Neuron",
    subtitle: "Control & Coordination",
    summary: "A neuron is an electrically excitable cell that communicates with other cells via specialized connections called synapses. It is the main component of nervous tissue.",
    details: [
      "Dendrites: Receive signals from other neurons.",
      "Axon: Transmits electrical impulses.",
      "Myelin Sheath: Insulates the axon for faster signal transmission.",
      "Synapse: Gap between neurons for chemical signaling."
    ],
    color: "#3b82f6",
    icon: "Zap"
  },
  {
    id: "flower",
    name: "Structure of Flower",
    subtitle: "Reproduction",
    summary: "A flower is the reproductive structure found in flowering plants. The biological function of a flower is to facilitate reproduction, usually by providing a mechanism for the union of sperm with eggs.",
    details: [
      "Stamen: Male reproductive part (Anther and Filament).",
      "Pistil: Female reproductive part (Stigma, Style, and Ovary).",
      "Petals: Attract pollinators.",
      "Sepals: Protect the flower bud."
    ],
    color: "#ec4899",
    icon: "Flower2"
  }
];
