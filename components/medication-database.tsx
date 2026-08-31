// This file contains a comprehensive database of medications for the hospital management system
// It includes details like generic names, brand names, dosages, side effects, etc.

export interface MedicationInfo {
  id: string
  name: string
  genericName: string
  category: string
  forms: string[]
  strengths: string[]
  routes: string[]
  sideEffects: string[]
  interactions: string[]
  contraindications: string[]
  description?: string
  usageInstructions?: string
  storageInstructions?: string
  pregnancyCategory?: string
  halfLife?: string
  mechanismOfAction?: string
}

export const MEDICATION_DATABASE: MedicationInfo[] = [
  {
    id: "med-001",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    forms: ["Capsule", "Tablet", "Suspension"],
    strengths: ["250mg", "500mg", "875mg"],
    routes: ["Oral"],
    sideEffects: ["Diarrhea", "Nausea", "Rash"],
    interactions: ["Allopurinol", "Probenecid", "Warfarin"],
    contraindications: ["Penicillin allergy", "Mononucleosis"],
    description:
      "Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins",
    pregnancyCategory: "B",
  },
  {
    id: "med-002",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "Antihypertensive",
    forms: ["Tablet"],
    strengths: ["5mg", "10mg", "20mg", "40mg"],
    routes: ["Oral"],
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    interactions: ["Potassium supplements", "NSAIDs", "Lithium"],
    contraindications: ["Pregnancy", "History of angioedema"],
    description:
      "Lisinopril is an ACE inhibitor that is used to treat high blood pressure (hypertension) or heart failure. It is also used to improve survival after a heart attack.",
    mechanismOfAction: "Inhibits angiotensin-converting enzyme, reducing formation of angiotensin II",
    pregnancyCategory: "D",
  },
  {
    id: "med-003",
    name: "Atorvastatin",
    genericName: "Atorvastatin",
    category: "Statin",
    forms: ["Tablet"],
    strengths: ["10mg", "20mg", "40mg", "80mg"],
    routes: ["Oral"],
    sideEffects: ["Muscle pain", "Liver problems", "Digestive issues"],
    interactions: ["Erythromycin", "Clarithromycin", "Grapefruit juice"],
    contraindications: ["Liver disease", "Pregnancy"],
    description:
      "Atorvastatin is used to lower blood levels of cholesterol and other fatty substances. It helps to prevent heart attacks and strokes.",
    mechanismOfAction: "Inhibits HMG-CoA reductase, reducing cholesterol synthesis",
    pregnancyCategory: "X",
  },
  {
    id: "med-004",
    name: "Metformin",
    genericName: "Metformin",
    category: "Antidiabetic",
    forms: ["Tablet", "Extended-release tablet"],
    strengths: ["500mg", "850mg", "1000mg"],
    routes: ["Oral"],
    sideEffects: ["Nausea", "Diarrhea", "Abdominal discomfort"],
    interactions: ["Cimetidine", "Furosemide", "Nifedipine"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
    description:
      "Metformin is used to treat type 2 diabetes. It helps control blood sugar levels by improving the body's response to insulin and reducing the amount of sugar made by the liver.",
    mechanismOfAction:
      "Decreases hepatic glucose production and intestinal glucose absorption, increases insulin sensitivity",
    pregnancyCategory: "B",
  },
  {
    id: "med-005",
    name: "Albuterol",
    genericName: "Albuterol",
    category: "Bronchodilator",
    forms: ["Inhaler", "Nebulizer solution"],
    strengths: ["90mcg/actuation", "2.5mg/3mL"],
    routes: ["Inhalation"],
    sideEffects: ["Tremor", "Nervousness", "Increased heart rate"],
    interactions: ["Beta-blockers", "Diuretics", "MAO inhibitors"],
    contraindications: ["Hypersensitivity to albuterol"],
    description:
      "Albuterol is a bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. It is used to treat bronchospasm in patients with asthma or COPD.",
    mechanismOfAction: "Stimulates beta-2 adrenergic receptors in lungs, causing bronchodilation",
    pregnancyCategory: "C",
  },
  {
    id: "med-006",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID",
    forms: ["Tablet", "Capsule", "Suspension"],
    strengths: ["200mg", "400mg", "600mg", "800mg"],
    routes: ["Oral"],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness"],
    interactions: ["Aspirin", "Blood thinners", "ACE inhibitors"],
    contraindications: ["Aspirin allergy", "Heart failure", "Stomach ulcers"],
    description:
      "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever.",
    mechanismOfAction: "Inhibits cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis",
    pregnancyCategory: "C (D in 3rd trimester)",
  },
  {
    id: "med-007",
    name: "Levothyroxine",
    genericName: "Levothyroxine",
    category: "Thyroid hormone",
    forms: ["Tablet"],
    strengths: [
      "25mcg",
      "50mcg",
      "75mcg",
      "88mcg",
      "100mcg",
      "112mcg",
      "125mcg",
      "137mcg",
      "150mcg",
      "175mcg",
      "200mcg",
    ],
    routes: ["Oral"],
    sideEffects: ["Weight loss", "Tremors", "Insomnia"],
    interactions: ["Calcium supplements", "Iron supplements", "Antacids"],
    contraindications: ["Thyrotoxicosis", "Adrenal insufficiency"],
    description:
      "Levothyroxine is a synthetic form of the thyroid hormone thyroxine used to treat hypothyroidism and other thyroid disorders.",
    mechanismOfAction: "Replaces or supplements endogenous thyroid hormones",
    pregnancyCategory: "A",
  },
  {
    id: "med-008",
    name: "Sertraline",
    genericName: "Sertraline",
    category: "SSRI",
    forms: ["Tablet", "Oral solution"],
    strengths: ["25mg", "50mg", "100mg"],
    routes: ["Oral"],
    sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
    interactions: ["MAO inhibitors", "Pimozide", "Other SSRIs"],
    contraindications: ["MAO inhibitor use within 14 days"],
    description:
      "Sertraline is a selective serotonin reuptake inhibitor (SSRI) used to treat depression, panic attacks, obsessive-compulsive disorder, and other mental health conditions.",
    mechanismOfAction: "Inhibits neuronal reuptake of serotonin in the CNS",
    pregnancyCategory: "C",
  },
  {
    id: "med-009",
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Proton pump inhibitor",
    forms: ["Capsule", "Tablet"],
    strengths: ["10mg", "20mg", "40mg"],
    routes: ["Oral"],
    sideEffects: ["Headache", "Abdominal pain", "Diarrhea"],
    interactions: ["Clopidogrel", "Diazepam", "Phenytoin"],
    contraindications: ["Hypersensitivity to omeprazole"],
    description:
      "Omeprazole is a proton pump inhibitor that decreases the amount of acid produced in the stomach. It is used to treat symptoms of gastroesophageal reflux disease (GERD) and other conditions caused by excess stomach acid.",
    mechanismOfAction: "Inhibits H+/K+ ATPase enzyme system in gastric parietal cells",
    pregnancyCategory: "C",
  },
  {
    id: "med-010",
    name: "Hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    category: "Diuretic",
    forms: ["Tablet"],
    strengths: ["12.5mg", "25mg", "50mg"],
    routes: ["Oral"],
    sideEffects: ["Increased urination", "Dizziness", "Electrolyte imbalance"],
    interactions: ["Lithium", "Digoxin", "NSAIDs"],
    contraindications: ["Sulfa allergy", "Anuria"],
    description:
      "Hydrochlorothiazide is a thiazide diuretic (water pill) that helps prevent your body from absorbing too much salt, which can cause fluid retention. It treats fluid retention and high blood pressure.",
    mechanismOfAction: "Inhibits sodium and chloride reabsorption in distal convoluted tubule",
    pregnancyCategory: "B (D if used in pregnancy-induced hypertension)",
  },
]

// Function to search medications
export function searchMedications(query: string): MedicationInfo[] {
  if (!query.trim()) return MEDICATION_DATABASE

  const lowercaseQuery = query.toLowerCase()
  return MEDICATION_DATABASE.filter(
    (med) =>
      med.name.toLowerCase().includes(lowercaseQuery) ||
      med.genericName.toLowerCase().includes(lowercaseQuery) ||
      med.category.toLowerCase().includes(lowercaseQuery),
  )
}

// Function to get medication by ID
export function getMedicationById(id: string): MedicationInfo | undefined {
  return MEDICATION_DATABASE.find((med) => med.id === id)
}

// Function to check for medication interactions
export function checkInteractions(medications: string[]): string[] {
  const warnings: string[] = []

  // Check each pair of medications for interactions
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = MEDICATION_DATABASE.find((m) => m.name === medications[i])
      const med2 = MEDICATION_DATABASE.find((m) => m.name === medications[j])

      if (med1 && med2) {
        if (med1.interactions.includes(med2.name) || med2.interactions.includes(med1.name)) {
          warnings.push(`Potential interaction between ${med1.name} and ${med2.name}`)
        }
      }
    }
  }

  return warnings
}

// Function to check for allergies
export function checkAllergies(medications: string[], allergies: string[]): string[] {
  const warnings: string[] = []

  medications.forEach((medName) => {
    const med = MEDICATION_DATABASE.find((m) => m.name === medName)
    if (med) {
      allergies.forEach((allergy) => {
        if (
          med.name.toLowerCase().includes(allergy.toLowerCase()) ||
          med.category.toLowerCase().includes(allergy.toLowerCase()) ||
          med.contraindications.some((c) => c.toLowerCase().includes(allergy.toLowerCase()))
        ) {
          warnings.push(`Patient has an allergy to ${allergy} which may be related to ${med.name}`)
        }
      })
    }
  })

  return warnings
}
