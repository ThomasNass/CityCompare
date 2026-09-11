export const PARTY_COLORS = {
  M: "#52BDEC",
  C: "#2F8F3A",
  L: "#006AB3",
  KD: "#1B365D",
  MP: "#53A13D",
  S: "#E8112D",
  V: "#AF0000",
  SD: "#C9A227",
  ÖVRIGA: "#94A3B8",
};

export const PARTY_NAMES = {
  M: "Moderaterna",
  C: "Centerpartiet",
  L: "Liberalerna",
  KD: "Kristdemokraterna",
  MP: "Miljöpartiet",
  S: "Socialdemokraterna",
  V: "Vänsterpartiet",
  SD: "Sverigedemokraterna",
  ÖVRIGA: "Övriga",
};

export function partyColor(party) {
  return PARTY_COLORS[party] ?? "#64748b";
}

export function partyName(party) {
  return PARTY_NAMES[party] ?? party;
}

export function shareFor(election, party) {
  const index = election?.parties?.indexOf(party) ?? -1;
  if (index < 0) return null;
  const value = Number(election.share[index]);
  return Number.isFinite(value) ? value : null;
}
