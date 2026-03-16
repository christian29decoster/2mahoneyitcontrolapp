/**
 * Seed-Daten für Musterkunden (Tenants) – verschiedene Namen, Standorte, Größen.
 * Wird in lib/data/tenants.ts beim Start geladen.
 */

import type { Tenant, TenantLocation } from '@/lib/auth/roles'

const iso = new Date().toISOString()

function loc(name: string, address: string, lat: number, lng: number): TenantLocation {
  return { name, address, lat, lng }
}

/** Zusätzliche Musterkunden (ca. 86 Stück) – auf mehrere Partner verteilt, verschiedene Größen/Standorte. */
export function getSeedTenants(): Tenant[] {
  const partners = [undefined, 'partner-1', 'partner-2', 'partner-3', 'partner-4', 'partner-5'] as (string | undefined)[]
  let pi = 0
  const nextPartner = () => partners[pi++ % partners.length]

  return [
    // Kleine Standorte (1 Location)
    { id: 'tenant-4', name: 'Büro am Park GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Hauptstandort', 'Parkstr. 12, 10115 Berlin', 52.52, 13.405)] },
    { id: 'tenant-5', name: 'Müller & Söhne Steuerberatung', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Kanzlei München', 'Leopoldstr. 52, 80802 München', 48.1351, 11.582)] },
    { id: 'tenant-6', name: 'Nordlicht Logistik OHG', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Büro Hamburg', 'Jungfernstieg 1, 20354 Hamburg', 53.5511, 9.9937)] },
    { id: 'tenant-7', name: 'RheinTech Software', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Köln Zentrum', 'Domplatte 1, 50668 Köln', 50.9375, 6.9603)] },
    { id: 'tenant-8', name: 'Stuttgarter Ingenieurbüro', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Stuttgart Mitte', 'Königstr. 28, 70173 Stuttgart', 48.7758, 9.1829)] },
    { id: 'tenant-9', name: 'Dresdner Dental Lab', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Labor Dresden', 'Prager Str. 10, 01069 Dresden', 51.0504, 13.7372)] },
    { id: 'tenant-10', name: 'Leipzig Marketing GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Leipzig Office', 'Grimmaische Str. 2, 04109 Leipzig', 51.3397, 12.3731)] },
    { id: 'tenant-11', name: 'Hannover Consulting Group', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Hannover HQ', 'Georgstr. 50, 30159 Hannover', 52.3759, 9.732)] },
    { id: 'tenant-12', name: 'Nürnberg Elektronik', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Werk Nürnberg', 'Königstr. 93, 90402 Nürnberg', 49.4521, 11.0767)] },
    { id: 'tenant-13', name: 'Bremen Schiffbau GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Werft Bremen', 'Hafenstr. 1, 28195 Bremen', 53.0793, 8.8017)] },
    { id: 'tenant-14', name: 'Wien Legal Partners', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Kanzlei Wien', 'Graben 15, 1010 Wien', 48.2082, 16.3738)] },
    { id: 'tenant-15', name: 'Zürich Asset Management', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Zürich Bahnhofstr.', 'Bahnhofstrasse 45, 8001 Zürich', 47.3769, 8.5417)] },
    { id: 'tenant-16', name: 'Amsterdam Design Studio', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Studio Amsterdam', 'Damrak 1, 1012 Amsterdam', 52.3676, 4.9041)] },
    { id: 'tenant-17', name: 'Brussels EU Affairs', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Brussels Office', 'Rue de la Loi 200, 1040 Brussels', 50.8503, 4.3517)] },
    { id: 'tenant-18', name: 'Prague Dev Hub s.r.o.', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Prague HQ', 'Václavské nám. 1, 110 00 Praha', 50.0755, 14.4378)] },
    { id: 'tenant-19', name: 'Edinburgh FinTech Ltd', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Edinburgh Office', 'Princes St 1, Edinburgh EH2', 55.9533, -3.1883)] },
    { id: 'tenant-20', name: 'Birmingham Manufacturing Co', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Birmingham Plant', 'Broad St, Birmingham B15', 52.4862, -1.8904)] },
    { id: 'tenant-21', name: 'Dublin Tech Solutions', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Dublin HQ', 'O\'Connell St, Dublin 1', 53.3498, -6.2603)] },
    { id: 'tenant-22', name: 'Boston Medical Devices Inc', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Boston Lab', 'Cambridge St, Boston, MA', 42.3601, -71.0589)] },
    { id: 'tenant-23', name: 'Denver Outdoor Gear LLC', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Denver Store', '16th St Mall, Denver, CO', 39.7392, -104.9903)] },
    { id: 'tenant-24', name: 'Phoenix Solar Systems', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Phoenix HQ', 'Central Ave, Phoenix, AZ', 33.4484, -112.074)] },
    { id: 'tenant-25', name: 'San Diego Biotech', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('San Diego Lab', 'La Jolla, San Diego, CA', 32.8328, -117.2713)] },
    { id: 'tenant-26', name: 'Atlanta Logistics Group', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Atlanta Depot', 'Peachtree St, Atlanta, GA', 33.749, -84.388)] },
    { id: 'tenant-27', name: 'Chicago Legal Associates', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Chicago Office', 'Michigan Ave, Chicago, IL', 41.8781, -87.6298)] },
    { id: 'tenant-28', name: 'Portland Green Energy', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Portland HQ', 'Pioneer Square, Portland, OR', 45.5152, -122.6784)] },
    { id: 'tenant-29', name: 'Montreal Consulting Inc', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Montreal Office', 'Saint-Catherine St, Montreal', 45.5017, -73.5673)] },
    { id: 'tenant-30', name: 'Vancouver Maritime Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Vancouver Port', 'Hastings St, Vancouver, BC', 49.2827, -123.1207)] },
    // Mittlere Standorte (2 Locations)
    { id: 'tenant-31', name: 'Doppelstandort GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Büro A Düsseldorf', 'Königsallee 60, 40212 Düsseldorf', 51.2277, 6.7735), loc('Büro B Essen', 'Kettwiger Str. 1, 45127 Essen', 51.4556, 7.0116)] },
    { id: 'tenant-32', name: 'Rhein-Main Industrie AG', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Frankfurt HQ', 'Taunusanlage 1, 60329 Frankfurt', 50.1109, 8.6821), loc('Wiesbaden Werk', 'Wilhelmstr. 1, 65183 Wiesbaden', 50.0825, 8.24)] },
    { id: 'tenant-33', name: 'Norddeutsche Werften GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Rostock', 'Lange Str. 1, 18055 Rostock', 54.0924, 12.0991), loc('Kiel', 'Holstenstr. 1, 24103 Kiel', 54.3233, 10.1228)] },
    { id: 'tenant-34', name: 'SüdChemie Labortechnik', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('München Lab', 'Leopoldstr. 100, 80802 München', 48.1351, 11.582), loc('Regensburg Produktion', 'Landshuter Str. 1, 93047 Regensburg', 49.0134, 12.1016)] },
    { id: 'tenant-35', name: 'UK Midlands Engineering', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Nottingham HQ', 'Market Sq, Nottingham NG1', 52.9548, -1.1581), loc('Leicester Site', 'Gallowtree Gate, Leicester', 52.6369, -1.1398)] },
    { id: 'tenant-36', name: 'Benelux Pharma Distribution', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Rotterdam Warehouse', 'Wilhelminakade 1, Rotterdam', 51.9225, 4.4792), loc('Antwerp Office', 'Meir 50, 2000 Antwerp', 51.2194, 4.4025)] },
    { id: 'tenant-37', name: 'Texas Oil & Gas Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Houston HQ', 'Texas Ave, Houston, TX', 29.7604, -95.3698), loc('Dallas Office', 'Main St, Dallas, TX', 32.7767, -96.797)] },
    { id: 'tenant-38', name: 'California Dual Site Inc', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('San Francisco', 'Market St, San Francisco, CA', 37.7749, -122.4194), loc('Los Angeles', 'Wilshire Blvd, Los Angeles, CA', 34.0522, -118.2437)] },
    { id: 'tenant-39', name: 'Florida Healthcare Group', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Miami Medical', 'Brickell, Miami, FL', 25.7617, -80.1918), loc('Tampa Clinic', 'Downtown Tampa, FL', 27.9506, -82.4572)] },
    { id: 'tenant-40', name: 'Ohio Manufacturing Corp', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Cleveland Plant', 'Public Sq, Cleveland, OH', 41.4993, -81.6944), loc('Columbus Office', 'High St, Columbus, OH', 39.9612, -82.9988)] },
    // Größere Standorte (3 Locations)
    { id: 'tenant-41', name: 'EuroLogistik DACH AG', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Berlin Zentrale', 'Unter den Linden 1, 10117 Berlin', 52.517, 13.3889), loc('Wien Lager', 'Praterstr. 1, 1020 Wien', 48.2082, 16.3738), loc('Zürich Vertrieb', 'Bahnhofstr. 20, 8001 Zürich', 47.3769, 8.5417)] },
    { id: 'tenant-42', name: 'Global Parts Distribution', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Stuttgart HQ', 'Königstr. 1, 70173 Stuttgart', 48.7758, 9.1829), loc('Lyon Depot', 'Place Bellecour, 69002 Lyon', 45.764, 4.8357), loc('Milan Office', 'Via Montenapoleone 1, Milano', 45.4642, 9.19)] },
    { id: 'tenant-43', name: 'Scandinavian Tech AB', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Stockholm HQ', 'Kungsgatan 1, Stockholm', 59.3293, 18.0686), loc('Oslo Office', 'Karl Johans gate 1, Oslo', 59.9139, 10.7522), loc('Copenhagen', 'Strøget 1, Copenhagen', 55.6761, 12.5683)] },
    { id: 'tenant-44', name: 'Iberia Food & Beverage', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Madrid HQ', 'Gran Vía 1, 28013 Madrid', 40.4168, -3.7038), loc('Barcelona', 'Las Ramblas 1, Barcelona', 41.3851, 2.1734), loc('Lisbon', 'Rua Augusta 1, Lisbon', 38.7223, -9.1393)] },
    { id: 'tenant-45', name: 'US East Coast Legal', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('New York', 'Wall St, New York, NY', 40.7074, -74.0092), loc('Washington DC', 'Pennsylvania Ave, DC', 38.8977, -77.0365), loc('Boston', 'State St, Boston, MA', 42.3587, -71.0567)] },
    // Weitere kleine Standorte
    { id: 'tenant-46', name: 'Kieler Softwarehaus', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Kiel', 'Sophienblatt 1, 24114 Kiel', 54.3233, 10.1228)] },
    { id: 'tenant-47', name: 'Lübeck Handel GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Lübeck', 'Breite Str. 1, 23552 Lübeck', 53.8655, 10.6866)] },
    { id: 'tenant-48', name: 'Freiburg Solar GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Freiburg', 'Kaiser-Joseph-Str. 1, 79098 Freiburg', 47.999, 7.8421)] },
    { id: 'tenant-49', name: 'Heidelberg Research Lab', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Heidelberg', 'Hauptstr. 1, 69117 Heidelberg', 49.3988, 8.6804)] },
    { id: 'tenant-50', name: 'Karlsruhe IT Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Karlsruhe', 'Kaiserstr. 1, 76133 Karlsruhe', 49.0069, 8.4037)] },
    { id: 'tenant-51', name: 'Mannheim Industrie', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Mannheim', 'Planken 1, 68161 Mannheim', 49.4875, 8.466)] },
    { id: 'tenant-52', name: 'Wuppertal Textil AG', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Wuppertal', 'Elberfelder Str. 1, 42103 Wuppertal', 51.2562, 7.1508)] },
    { id: 'tenant-53', name: 'Bonn Verwaltung GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Bonn', 'Remigiusstr. 1, 53111 Bonn', 50.7374, 7.0982)] },
    { id: 'tenant-54', name: 'Münster Marketing', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Münster', 'Ludgeristr. 1, 48143 Münster', 51.9607, 7.6261)] },
    { id: 'tenant-55', name: 'Braunschweig Maschinenbau', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Braunschweig', 'Bohlweg 1, 38100 Braunschweig', 52.2642, 10.5234)] },
    { id: 'tenant-56', name: 'Kassel Energie GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Kassel', 'Königsplatz 1, 34117 Kassel', 51.3127, 9.4797)] },
    { id: 'tenant-57', name: 'Göttingen Forschung', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Göttingen', 'Weender Str. 1, 37073 Göttingen', 51.5344, 9.9323)] },
    { id: 'tenant-58', name: 'Würzburg Medizintechnik', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Würzburg', 'Domstr. 1, 97070 Würzburg', 49.7941, 9.9313)] },
    { id: 'tenant-59', name: 'Erfurt Verwaltung', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Erfurt', 'Anger 1, 99084 Erfurt', 50.9787, 11.0328)] },
    { id: 'tenant-60', name: 'Rostock Hafen GmbH', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Rostock', 'Lange Str. 1, 18055 Rostock', 54.0924, 12.0991)] },
    { id: 'tenant-61', name: 'Luxembourg Finance Sàrl', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Luxembourg', 'Place Guillaume II, Luxembourg', 49.6116, 6.1319)] },
    { id: 'tenant-62', name: 'Lyon Industrie SAS', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Lyon', 'Place Bellecour, 69002 Lyon', 45.764, 4.8357)] },
    { id: 'tenant-63', name: 'Lille Retail France', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Lille', 'Rue de la Grande Chaussée, Lille', 50.6292, 3.0573)] },
    { id: 'tenant-64', name: 'Bordeaux Wine Export', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Bordeaux', 'Place de la Bourse, Bordeaux', 44.8378, -0.5792)] },
    { id: 'tenant-65', name: 'Toulouse Aerospace', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Toulouse', 'Capitole, 31000 Toulouse', 43.6047, 1.4442)] },
    { id: 'tenant-66', name: 'Valencia Logistics ES', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Valencia', 'Plaza del Ayuntamiento, Valencia', 39.4699, -0.3763)] },
    { id: 'tenant-67', name: 'Seville Tourism SL', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Seville', 'Avenida de la Constitución, Sevilla', 37.3891, -5.9845)] },
    { id: 'tenant-68', name: 'Genoa Port Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Genoa', 'Via XX Settembre, Genova', 44.4056, 8.9463)] },
    { id: 'tenant-69', name: 'Turin Automotive SpA', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Turin', 'Piazza Castello, Torino', 45.0703, 7.6869)] },
    { id: 'tenant-70', name: 'Naples Food Distribution', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Naples', 'Via Toledo, Napoli', 40.8378, 14.2488)] },
    { id: 'tenant-71', name: 'Bristol Aerospace UK', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Bristol', 'Queen Square, Bristol BS1', 51.4545, -2.5879)] },
    { id: 'tenant-72', name: 'Leeds Digital Agency', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Leeds', 'Briggate, Leeds LS1', 53.796, -1.5451)] },
    { id: 'tenant-73', name: 'Newcastle Shipping Ltd', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Newcastle', 'Grey St, Newcastle upon Tyne', 54.9783, -1.6178)] },
    { id: 'tenant-74', name: 'Liverpool Maritime', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Liverpool', 'Pier Head, Liverpool', 53.4084, -2.9916)] },
    { id: 'tenant-75', name: 'Cardiff Financial Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Cardiff', 'Queen St, Cardiff CF10', 51.4816, -3.1791)] },
    { id: 'tenant-76', name: 'Glasgow Tech Hub', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Glasgow', 'Buchanan St, Glasgow G1', 55.8642, -4.2518)] },
    { id: 'tenant-77', name: 'Belfast Software Ltd', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Belfast', 'Donegall Square, Belfast', 54.5973, -5.9301)] },
    { id: 'tenant-78', name: 'Minneapolis Retail Corp', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Minneapolis', 'Nicollet Mall, Minneapolis, MN', 44.9778, -93.265)] },
    { id: 'tenant-79', name: 'Detroit Auto Parts', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Detroit', 'Woodward Ave, Detroit, MI', 42.3314, -83.0458)] },
    { id: 'tenant-80', name: 'Salt Lake City Outdoor', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Salt Lake City', 'Main St, Salt Lake City, UT', 40.7608, -111.891)] },
    { id: 'tenant-81', name: 'Las Vegas Hospitality', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Las Vegas', 'Las Vegas Blvd, Las Vegas, NV', 36.1699, -115.1398)] },
    { id: 'tenant-82', name: 'Nashville Music Group', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Nashville', 'Broadway, Nashville, TN', 36.1627, -86.7816)] },
    { id: 'tenant-83', name: 'Charlotte Banking Inc', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Charlotte', 'Tryon St, Charlotte, NC', 35.2271, -80.8431)] },
    { id: 'tenant-84', name: 'Orlando Theme Parks Co', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Orlando', 'International Dr, Orlando, FL', 28.5383, -81.3792)] },
    { id: 'tenant-85', name: 'San Antonio Healthcare', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('San Antonio', 'Alamo Plaza, San Antonio, TX', 29.4241, -98.4936)] },
    { id: 'tenant-86', name: 'Calgary Energy Ltd', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Calgary', '8th Ave SW, Calgary, AB', 51.0447, -114.0719)] },
    { id: 'tenant-87', name: 'Ottawa Government Services', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Ottawa', 'Parliament Hill, Ottawa, ON', 45.4215, -75.6972)] },
    { id: 'tenant-88', name: 'Sydney Pacific Pty Ltd', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Sydney', 'George St, Sydney NSW', -33.8688, 151.2093)] },
    { id: 'tenant-89', name: 'Melbourne Consulting', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Melbourne', 'Collins St, Melbourne VIC', -37.8136, 144.9631)] },
    { id: 'tenant-90', name: 'Auckland Logistics NZ', partnerId: nextPartner(), connectors: {}, active: true, createdAtISO: iso, locations: [loc('Auckland', 'Queen St, Auckland', -36.8509, 174.7645)] },
  ]
}
