export const PIPELINE_STAGES = [
  'First contact',
  'Study / Analyze client',
  'First meeting',
  'Prototype',
  'Follow up meetings',
  'Proposal',
  'Negotiation / Contracting',
  'Discovery'
] as const;

export const STAGE_DESCRIPTIONS = {
  'First contact': 'First interaction with the potential client',
  'Study / Analyze client': 'Research and analysis of client needs and requirements',
  'First meeting': 'Initial face-to-face or virtual meeting with client',
  'Prototype': 'Development of initial prototype or proof of concept',
  'Follow up meetings': 'Subsequent meetings to discuss progress and requirements',
  'Proposal': 'Formal proposal submission',
  'Negotiation / Contracting': 'Contract negotiation and finalization',
  'Discovery': 'Detailed project discovery and planning'
} as const;
