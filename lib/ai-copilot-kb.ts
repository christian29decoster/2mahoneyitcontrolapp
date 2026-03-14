/**
 * AI Co-Pilot knowledge base: ~100–150 answers that support the app's value.
 * Demo + live context: risk, devices, EDR, backup, compliance, incidents, governance, etc.
 * First matching intent wins; order more specific patterns first.
 */

export type CopilotIntent = { match: RegExp; answer: string }

export const copilotIntents: CopilotIntent[] = [
  // —— Greeting / what can you do ——
  { match: /^(hi|hello|hey|hallo)\s*\.*$/i, answer: "Hello! I'm your AI Co-Pilot. Ask me about risk, devices, backups, compliance, incidents, or anything in your control surface. For example: 'What's my current risk?' or 'Which devices need attention?'" },
  { match: /what can you do|was kannst du|help me|hilf mir|what do you know/i, answer: "I answer questions about your security posture, devices, EDR coverage, backups, mail, compliance, incidents, and upgrades. I use your dashboard and demo data. Try: 'Which devices are unprotected?', 'How is our backup scope?', or 'Should we upgrade to Prime?'" },
  { match: /why (mahoney )?control|why this app|existenzgrund|value of (the )?app/i, answer: "Mahoney Control gives you one surface for risk, operations, and growth: unified visibility into devices, EDR, backups, mail, compliance, and incidents. You see what matters, fix gaps faster, and demonstrate governance—without switching tools." },

  // —— Risk & security posture ——
  { match: /(overall |current |my |our )?risk(\s+level)?|security posture|how (are we|do we) (doing|stand)/i, answer: "Overall risk is Moderate. You have 3 active alerts, EDR coverage at 92%, and backups covering 78% of scope. Two devices lack EDR or have stale check-ins. Address those to lower risk." },
  { match: /risk score|grow score|mahoney grow/i, answer: "Your Mahoney Grow (risk-to-growth) score reflects protected devices, patch compliance, backup coverage, MFA, and EDR—minus penalties for critical findings. Improve it by closing gaps in Devices and Governance." },
  { match: /critical (gaps?|findings?)|immediate (action|steps)/i, answer: "Two devices need EDR or have stale check-ins; one mailbox is near quota. Open the Service Cockpit or Devices view to remediate. No critical compliance findings require escalation today." },
  { match: /(are we|am i) (secure|safe)|security status/i, answer: "Security status is Moderate. EDR coverage 92%, backups 78% of scope, RTO on target. Focus on the 2 unprotected devices and mailbox quota to improve." },

  // —— EDR & devices ——
  { match: /unprotected (device|endpoint)|devices? (without|lack) edr|edr (gap|missing)/i, answer: "Two devices lack EDR or have stale check-ins. Open Devices & Staff or Remediation to deploy agents or refresh. This will raise your EDR coverage toward 98%." },
  { match: /edr (coverage|scope)|(how many|which) (devices? )?have edr/i, answer: "EDR coverage is 92%. A few devices are unprotected or have stale check-ins. Enabling automated discovery can help raise coverage; check the Service Cockpit recommendation." },
  { match: /(which|what) devices? (need|require|should) (attention|fix|remediation)/i, answer: "Two devices need attention: they lack EDR or have stale agent check-ins. Open the Devices view and filter by EDR status to remediate." },
  { match: /offline devices?|devices? (offline|disconnected)/i, answer: "RMM and EDR report device status. Check Devices & Staff or the dashboard for offline or stale devices; typically a few need reconnection or agent refresh." },
  { match: /(total )?devices?|device count|how many (endpoints?|machines)/i, answer: "Your plan covers 250 devices and 150 seats. Device and EDR status are in Devices & Staff; the dashboard shows online/offline and protected counts." },
  { match: /(stale|outdated) (agent|edr|check)/i, answer: "A few devices have stale EDR or RMM check-ins. Open Remediation or Devices to refresh agents and restore coverage." },
  { match: /patch(es)?|patching|(missing )?updates/i, answer: "Patch status is part of your risk and compliance view. Run a compliance or device audit to see missing patches; the Service Cockpit can suggest next steps." },
  { match: /(rmm|remote (monitoring|management))/i, answer: "RMM gives you device inventory, monitoring, and automation. In Mahoney Control you see device status, EDR coverage, and alerts in one place alongside SOC and compliance." },

  // —— Backups & DR ——
  { match: /backup(s)?|back.?up scope|(how is|what about) (our )?backups?/i, answer: "Backups cover 78% of scope; RTO is on target. Two recent backup failures are worth reviewing. Consider DR verification for critical systems like Finance DB." },
  { match: /rto|rpo|recovery (time|point)/i, answer: "Your RTO is on target. Backup scope is 78%; consider expanding for Finance DB and adding DR verification for critical workloads." },
  { match: /restore|(can we|how do we) restore/i, answer: "Restore is handled by your backup provider. Mahoney Control shows backup scope and status; use the Financials or Service Cockpit for runbooks and DR verification options." },
  { match: /(dr|disaster recovery)|failover/i, answer: "DR verification is recommended for critical systems. Backup scope is 78% and RTO on target; add DR testing to close the gap." },

  // —— Mail & O365 ——
  { match: /mail(box)?|o365|office 365|exchange|quota/i, answer: "One O365 mailbox is approaching quota; one on-prem Exchange DB (DB02) has high utilization. Expand mailbox analytics or capacity to avoid issues." },
  { match: /(mailbox|mail) (near |approaching )?quota/i, answer: "One O365 mailbox is near quota. Check mail or capacity views and plan expansion or archiving." },

  // —— Compliance & governance ——
  { match: /compliance|soc 2|soc.?compliance|(are we )?compliant/i, answer: "Compliance score is 78. Gaps include MFA on legacy mail and VLAN segmentation review. Run the SOC questionnaire or Governance handbook to track controls." },
  { match: /governance|controls?|(control )?framework/i, answer: "Governance in Mahoney Control covers policies, handbooks, and SOC-style controls. Use Governance and SOC-Compliance & Handbook to document and assess controls." },
  { match: /(soc )?questionnaire|handbook/i, answer: "Use SOC-Compliance & Handbook to run questionnaires and maintain your security handbook. Results feed into risk and compliance views." },
  { match: /mfa|multi.?factor|two.?factor/i, answer: "MFA is part of your compliance score. One gap noted: MFA on legacy mail. Address it in Identity or mail settings to improve the score." },
  { match: /vlan|segmentation|network segment/i, answer: "VLAN segmentation review is listed as a compliance gap. Use Governance or Projects to plan and document network segmentation." },

  // —— SOC ——
  { match: /soc (team|status|monitoring)|(who is|what is) (our )?soc/i, answer: "Your SOC status is Monitoring; team SOC-III-US-Team. SOC appears in the dashboard and Mission Briefing for alert and coverage context." },
  { match: /(security )?operations|(soc )?analyst/i, answer: "Security operations are supported by SOC monitoring and the control surface. Alerts, EDR, and compliance data are in one place for analysts and you." },

  // —— Incidents & alerts ——
  { match: /(active )?alerts?|(open )?incidents?|tickets?/i, answer: "You have 3 active alerts. Check Incidents or the dashboard for details. EDR and RMM feed alerts; SOC can escalate when needed." },
  { match: /mttr|mean time to repair|(how )?fast (do we |can we )?fix/i, answer: "MTTR improves with clear visibility and automation. Upgrading to Prime can reduce MTTR via auto-discovery and better prioritization. Check Incidents for current response times." },
  { match: /(create|open|new) (an? )?incident|(report|log) (an? )?incident/i, answer: "Use Incidents to create and track incidents. You can open a new incident from the Incidents section and link it to devices or alerts." },
  { match: /(incident )?sla|service level/i, answer: "SLA targets and incident response are in Incidents and Mission Briefing. The app helps you see breach risk and meet response targets." },

  // —— Upgrades & plans ——
  { match: /upgrade|(should we|can we) (upgrade|go) (to )?prime|prime (plan)?/i, answer: "Upgrading to Prime unlocks auto-discovery and can reduce MTTR. Estimated +$600/mo. Check Marketplace or Upselling for your plan options." },
  { match: /(essential|prime|elite) (plan|tier)/i, answer: "You're on Essential (150 seats, 250 devices). Prime adds auto-discovery and stronger analytics; Elite adds full premium features. See Marketplace or Enhance / Upgrades." },
  { match: /(plan|tier) (upgrade|change)|(change|switch) plan/i, answer: "Plan changes are in Marketplace or Enhance / Upgrades. Prime and Elite offer more automation and visibility; I can summarize differences if you ask." },
  { match: /renewal|(when does|contract )?renew/i, answer: "Your plan renewal is in the Contracts or company view. The Service Cockpit also shows renewal context. Check Financials or Contracts for exact dates." },

  // —— Projects & network ——
  { match: /project(s)?|(create|new) project|vlan|(network )?segment/i, answer: "Create a Network project (VLANs, Wi-Fi, firewall) from Projects. We can generate a scoped quote and track implementation." },
  { match: /(network )?vlan|wifi|firewall (rule)/i, answer: "VLAN and network changes fit in Projects. Document scope and use the control surface to align with compliance (e.g. segmentation review)." },

  // —— Mission Briefing ——
  { match: /mission briefing|(mission )?briefing|briefing (dashboard)?/i, answer: "Mission Briefing gives a single view of risk, alerts, and readiness. Use it for daily standups or before major changes. Open Mission Control from the menu." },
  { match: /debrief|(post.?)?incident (review|debrief)/i, answer: "Use Mission Briefing and Debrief to capture lessons learned after incidents. This supports SLA and continuous improvement." },
  { match: /(daily |standup|status )?(meeting|brief)/i, answer: "Mission Briefing is built for daily or situational briefs: risk, open alerts, device and backup status in one place." },

  // —— Financials & billing ——
  { match: /(cost|spend|billing|financials?)|(how much|what do we )?(pay|spend)/i, answer: "Financials shows spend, cost per device, and trends. For plan pricing and upgrades, see Marketplace and Contracts." },
  { match: /(mdu|data )?(cost|usage|events)/i, answer: "MDU (data processing) usage and cost appear in billing and dashboard. Events from RMM/EDR drive volume; check Billing or Admin for thresholds." },

  // —— Contracts ——
  { match: /contract(s)?|(vendor )?agreement|(license )?renewal/i, answer: "Contracts and renewals are in the Contracts section. Your plan renewal date is visible there and in the Service Cockpit." },

  // —— Marketplace & purchasing ——
  { match: /marketplace|(buy|purchase|order) (something|add.?on)/i, answer: "The Marketplace is where you add Platform tiers, SOC, MIT-AI, and bundles. You sell at list price; partners see margin on Partner Pricing." },
  { match: /(add.?on|add.?on)|(mit.?ai|mitai)|(soc )?add/i, answer: "Add-ons like SOC and MIT-AI are in the Marketplace. MIT-AI adds Co-Pilot and analytics; SOC tiers add monitoring and response. See Marketplace for options." },
  { match: /(partner )?pricing|(partner )?margin|(how much )?margin/i, answer: "Partner pricing and margins are on the Partner Pricing page (for partners). You sell at list; your margin is the tier discount (20–40%) plus MDU and add-ons." },

  // —— Dashboard & cockpit ——
  { match: /(service )?cockpit|cockpit (view|recommendation)/i, answer: "The Service Cockpit summarizes risk, EDR, backup, mail, and compliance and suggests next steps. Open it from the dashboard for a single view." },
  { match: /dashboard|(main )?view|overview/i, answer: "The dashboard shows alerts, MRR, devices, and key metrics. Use it with the Service Cockpit for a quick overview and next actions." },
  { match: /(next )?steps?|(what should|what to do) (next|now)/i, answer: "Next steps: 1) Address 2 unprotected/stale EDR devices. 2) Review mailbox quota. 3) Run a quick compliance gap check. Open the Service Cockpit for the full list." },
  { match: /recommendation(s)?|(what do you )?recommend/i, answer: "I recommend fixing the 2 EDR gaps, reviewing backup scope for Finance DB, and running a SOC gap assessment. The Service Cockpit has the full set." },

  // —— Devices & staff (more) ——
  { match: /(devices? )?and staff|(staff|user) (count|list)/i, answer: "Devices & Staff shows device inventory, EDR status, and staff context. Your plan: 150 seats, 250 devices. Use it to find unprotected or offline devices." },
  { match: /(how many|number of) (seats?|users?)/i, answer: "Your plan includes 150 seats and 250 devices. Details are in the dashboard and company/plan view." },

  // —— Cloud & company ——
  { match: /cloud (security|status)|(cloud.?based|saas)/i, answer: "Cloud Security in the app covers cloud assets and posture. Use the Cloud section and link with EDR/SOC for a full picture." },
  { match: /company (info|details|profile)/i, answer: "Company info is on the Company page: locations, plan, and high-level context. Financials and Contracts tie to the same company." },

  // —— AI / Co-Pilot meta ——
  { match: /(who are you|what are you|are you (an? )?ai)/i, answer: "I'm the AI Co-Pilot for Mahoney Control. I answer questions using your app's data—risk, devices, backups, compliance, incidents—so you can act faster without leaving the control surface." },
  { match: /(how do you work|where do you get (your )?data)/i, answer: "I use the same data as your dashboard and Service Cockpit: device status, EDR, backups, mail, compliance, and incidents. In demo mode answers are based on demo data; with live data I'd use your real metrics." },
  { match: /(can you |do you )?(create|change|fix|remediate)/i, answer: "I give answers and recommendations. Actual changes—deploying EDR, changing backups, creating incidents—you do in the app. I point you to the right place and next steps." },
  { match: /(thank you|thanks|danke)/i, answer: "You're welcome. Ask anytime about risk, devices, backups, or compliance." },
  { match: /(bye|goodbye|tschüss)/i, answer: "Goodbye. Come back when you need a quick answer on risk or operations." },

  // —— More variations: risk & status ——
  { match: /(summarize|summary of) (our )?(risk|status|posture)/i, answer: "Summary: risk Moderate, 3 active alerts, EDR 92%, backups 78%. Two devices need EDR or refresh. One mailbox near quota. Service Cockpit has the full list of next steps." },
  { match: /(any )?(critical|high|open) (alerts?|issues?)/i, answer: "You have 3 active alerts. Two devices need EDR attention; one mailbox is near quota. Nothing requires immediate escalation beyond addressing those." },
  { match: /(we have|there are|number of) alerts?/i, answer: "There are 3 active alerts. Check the Incidents or dashboard view for details and link to devices or mail as needed." },
  { match: /(security )?gaps?|(what )?gaps?/i, answer: "Current gaps: 2 devices without EDR or stale check-ins, 1 mailbox near quota, MFA on legacy mail, and VLAN segmentation review. Tackle devices first for the biggest impact." },
  { match: /(improve|lower|reduce) (our )?risk/i, answer: "To lower risk: fix the 2 EDR gaps, resolve mailbox quota, and close the MFA and VLAN compliance gaps. The Service Cockpit orders these by impact." },
  { match: /(where (do|can) i (see|find)|show me) (risk|posture)/i, answer: "Risk and posture are on the Dashboard and in Mahoney Grow (AI Growth & Risk Intelligence). The Service Cockpit gives a one-screen summary with next steps." },

  // —— More: devices & endpoints ——
  { match: /(list|show|which) (are )?(the )?unprotected/i, answer: "Two devices are unprotected or have stale EDR check-ins. Open Devices & Staff and filter by EDR status to see the list and remediate." },
  { match: /(deploy|install|enable) edr/i, answer: "EDR is deployed via your RMM or EDR provider. Use the Devices or Remediation view to see which devices need agents and follow your deployment process." },
  { match: /(endpoint|device) (protection|security)/i, answer: "Endpoint security is reflected in EDR coverage (92%) and device status. Unprotected or stale devices are in Devices & Staff; fix them to improve protection." },
  { match: /(laptop|workstation|server) (status|count)/i, answer: "Device types and counts are in Devices & Staff. Your plan covers 250 devices; the dashboard and RMM/EDR show status by type." },
  { match: /(agent|software) (deployment|install)/i, answer: "Agent deployment is done through your RMM or EDR. Mahoney Control shows which devices need agents; use Remediation or Devices to act." },

  // —— More: backup & data ——
  { match: /(backup )?(scope|coverage|percent)/i, answer: "Backup scope is 78%. Consider expanding for Finance DB and adding DR verification. RTO is on target." },
  { match: /(last|recent) (backup )?(failure|error)/i, answer: "There were 2 recent backup failures. Review them in the backup or Service Cockpit view and add DR verification for critical systems." },
  { match: /(finance|critical) (db|database|system)/i, answer: "Finance DB is called out for backup and DR attention. Expand backup scope and add DR verification for it." },
  { match: /(data )?protection|(protect|protection of) data/i, answer: "Data protection is covered by backups (78% scope), RTO targets, and DR. Improve by expanding scope and adding DR verification." },

  // —— More: compliance & audit ——
  { match: /(audit|assessment|review) (compliance|controls?)/i, answer: "Run the SOC questionnaire or Governance handbook for a compliance audit. Your score is 78; gaps are MFA on legacy mail and VLAN segmentation." },
  { match: /(score|rating) (for |of )?(compliance|governance)/i, answer: "Compliance score is 78. Improve it by addressing MFA on legacy mail and completing the VLAN segmentation review." },
  { match: /(certification|certify|soc 2)/i, answer: "SOC 2 and certifications are supported by the Governance and SOC-Compliance & Handbook modules. Document controls and run assessments to prepare for audit." },
  { match: /(policy|policies|handbook)/i, answer: "Policies and the security handbook are in Governance and SOC-Compliance & Handbook. Keep them updated and link to controls for audits." },

  // —— More: incidents & response ——
  { match: /(open|active|current) (incident|ticket)/i, answer: "You have 3 active alerts/incidents. Open the Incidents section to see details, assign, and track resolution." },
  { match: /(respond|response) (time|to )?incident/i, answer: "Response times and SLA are in Incidents and Mission Briefing. Improving visibility and automation (e.g. Prime) can reduce MTTR." },
  { match: /(escalat(e|ion)|escalate to soc)/i, answer: "Escalation to SOC is configured in your integration. Alerts and severity drive when SOC is involved; check Incidents and SOC status." },
  { match: /(ticket|incident) (create|new|open)/i, answer: "Create new incidents from the Incidents section. You can link them to devices or alerts and track until closure." },

  // —— More: plans & pricing ——
  { match: /(how much|price|cost) (for )?(prime|elite|upgrade)/i, answer: "Prime upgrade is roughly +$600/mo; exact pricing is in Marketplace or Enhance / Upgrades. Elite and other tiers are listed there too." },
  { match: /(essential|current plan|our plan)/i, answer: "You're on Essential: 150 seats, 250 devices. Renewal and plan details are in Contracts and the Service Cockpit." },
  { match: /(auto.?discovery|discovery)/i, answer: "Auto-discovery is available with Prime and above. It helps find unmanaged devices and can raise EDR coverage. See Marketplace for plan comparison." },
  { match: /(marketplace|buy|purchase) (plan|tier)/i, answer: "Plan tiers and add-ons are in the Marketplace. You can compare Essential, Prime, Elite, and add SOC or MIT-AI." },
  { match: /(mit.?ai|ai (add.?on|pack))/i, answer: "MIT-AI adds AI analytics and Co-Pilot (this experience). Plans like Insight, Intelligence, and Command are in the Marketplace." },

  // —— More: Mission Briefing & reporting ——
  { match: /(report|reporting|board report)/i, answer: "Reporting is in Mission Briefing, Financials, and Governance. Use Mission Briefing for daily or situational status and board-ready views." },
  { match: /(readiness|ready|prepared)/i, answer: "Readiness is summarized in Mission Briefing: risk, alerts, devices, and backups in one view. Use it before major changes or for standups." },
  { match: /(daily|weekly) (status|update|brief)/i, answer: "Use Mission Briefing for daily or weekly status. It pulls risk, alerts, and key metrics into one place." },

  // —— More: financials & contracts ——
  { match: /(spend|cost) (per device|per user)/i, answer: "Cost per device and spend trends are in Financials. Use it to track efficiency and plan upgrades." },
  { match: /(renewal|renew) (date|when)/i, answer: "Renewal date is in Contracts and the Service Cockpit. Your plan renewal is visible there." },
  { match: /(vendor|license|subscription)/i, answer: "Vendors, licenses, and subscriptions are tracked in Contracts. Renewals and costs tie into Financials." },

  // —— More: partners & marketplace ——
  { match: /(partner|reseller) (margin|pricing)/i, answer: "Partners see margin and pricing on the Partner Pricing page: tier discount (20–40%), platform list prices, SOC and MIT-AI margins, and MDU." },
  { match: /(white.?label|white label|own brand)/i, answer: "Partners can customize app name and logo (white-label) in Admin under Partners → Customize. Customers see the partner's brand when they log in." },
  { match: /(mdu|data (processing|revenue))/i, answer: "MDU is data processing/event volume. Partners earn margin per 1k events; see Partner Pricing for the deal calculator and MDU potential." },

  // —— More: app usage & navigation ——
  { match: /(where (is|do i find)|how (do i|to) (open|find))/i, answer: "Use the menu: Dashboard for overview, Devices & Staff for devices and EDR, Governance for compliance, Incidents for tickets, Marketplace for plans and add-ons. Ask me for a specific topic." },
  { match: /(navigate|navigation|menu)/i, answer: "The main menu has Dashboard, AI Co-Pilot, Devices, Company, Governance, Incidents, Mission Briefing, Marketplace, and Settings. I can point you to the right section for any question." },
  { match: /(service cockpit|cockpit) (where|how)/i, answer: "Open the Service Cockpit from the dashboard. It shows risk, EDR, backup, mail, and compliance with recommended next steps in one view." },
  { match: /(dashboard|home) (show|display)/i, answer: "The dashboard shows alerts, key metrics, device and backup status, and quick access to the Service Cockpit and main areas." },

  // —— More: general reassurance ——
  { match: /(everything )?ok|(all )?good|(any )?problems?/i, answer: "No critical escalation needed. You have 3 alerts and a few gaps (2 EDR devices, 1 mailbox). Address those and you're in good shape. Check the Service Cockpit for the list." },
  { match: /(what'?s?|what is) (the )?priority|(top )?priorities?/i, answer: "Top priorities: 1) Fix 2 EDR gaps. 2) Resolve mailbox quota. 3) Run a quick compliance gap check. The Service Cockpit has the full ordered list." },
  { match: /(quick (win|action)|fast(est)? (way|improvement))/i, answer: "Quick win: fix the 2 unprotected or stale EDR devices. That raises coverage and reduces risk with minimal effort. Then tackle mailbox quota." },

  // —— Fallback / generic ——
  { match: /.*/, answer: "I can answer questions about risk, devices, EDR, backups, mail, compliance, incidents, upgrades, and the Service Cockpit. Try: 'What is my current risk?', 'Which devices need attention?', or 'What should I do next?'" },
]

/** Return the first matching answer for a question. */
export function answerFromKb(question: string): string {
  const q = question.trim()
  if (!q) return "Ask me anything about your risk, devices, backups, compliance, or next steps. For example: 'What is my current risk?' or 'Which devices are unprotected?'"
  const intent = copilotIntents.find((x) => x.match.test(q))
  return intent ? intent.answer : copilotIntents[copilotIntents.length - 1].answer
}
