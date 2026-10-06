export type InsurancePartner = { code: string; name: string; description: string; accent: "blue" | "green" };

export const insurancePartners: readonly InsurancePartner[] = [
  { code: "PVI", name: "PVI Care", description: "Bảo hiểm Dầu Khí", accent: "blue" }, { code: "BẢO VIỆT", name: "Bảo Việt", description: "Bảo Việt An Gia", accent: "green" },
  { code: "GEN", name: "Generali", description: "Bảo hiểm Quốc tế", accent: "blue" }, { code: "PAP", name: "Papaya", description: "Bảo lãnh số E-claim", accent: "green" },
  { code: "LIB", name: "Liberty", description: "Liberty Insurance", accent: "blue" }, { code: "PTI", name: "PTI Care", description: "Bảo hiểm Bưu Điện", accent: "green" },
  { code: "INSM", name: "Insmart", description: "TPA Sức khỏe Quốc tế", accent: "blue" }, { code: "SAS", name: "S.A.S Care", description: "Bảo trợ y tế toàn cầu", accent: "green" },
  { code: "VBI", name: "VietinBank (VBI)", description: "Bảo hiểm VietinBank", accent: "blue" }, { code: "BAK", name: "Bảo An Khang", description: "Chăm sóc nụ cười", accent: "green" },
  { code: "MIC", name: "MIC Care", description: "Bảo hiểm Quân Đội", accent: "blue" }, { code: "BL", name: "Bảo Long", description: "Bảo Long Insurance", accent: "green" },
  { code: "PCV", name: "PCV TPA", description: "Bảo lãnh viện phí", accent: "blue" }, { code: "AIA", name: "AIA Vitality", description: "AIA Life Insurance", accent: "green" },
  { code: "ATAC", name: "ATACC", description: "Hỗ trợ bảo lãnh 24/7", accent: "blue" },
];
