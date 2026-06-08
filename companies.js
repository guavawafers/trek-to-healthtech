const companies = [
  ["AliveCor","alivecor.com","Diagnostics","Growth","Personal ECG devices and cardiac insights","High","https://www.alivecor.com/careers"],
  ["Alto Pharmacy","alto.com","Pharmacy","Growth","Digital pharmacy and medication delivery","High","https://www.alto.com/careers"],
  ["Amazon One Medical","onemedical.com","Care Delivery","Enterprise","Hybrid primary care and membership experience","High","https://www.onemedical.com/careers/"],
  ["Amwell","amwell.com","Care Delivery","Public","Enterprise virtual care platform","High","https://business.amwell.com/about-us/careers/"],
  ["athenahealth","athenahealth.com","Infrastructure","Enterprise","Cloud-based EHR and practice management","High","https://www.athenahealth.com/careers"],
  ["Carbon Health","carbonhealth.com","Care Delivery","Late Stage","Hybrid primary and urgent care","High","https://carbonhealth.com/careers"],
  ["Carrot Fertility","get-carrot.com","Benefits","Late Stage","Global fertility and family-building benefits","High","https://www.get-carrot.com/careers"],
  ["Dexcom","dexcom.com","Diagnostics","Public","Continuous glucose monitoring experiences","High","https://careers.dexcom.com/"],
  ["Doximity","doximity.com","Infrastructure","Public","Professional network and tools for clinicians","High","https://workat.doximity.com/"],
  ["Epic","epic.com","Infrastructure","Enterprise","Foundational electronic health record platform","High","https://careers.epic.com/"],
  ["Grow Therapy","growtherapy.com","Care Delivery","Growth","Mental health provider marketplace and tools","High","https://growtherapy.com/careers/"],
  ["Health Gorilla","healthgorilla.com","Infrastructure","Growth","Health information network and data exchange","High","https://www.healthgorilla.com/careers"],
  ["Innovaccer","innovaccer.com","Infrastructure","Late Stage","Healthcare data activation and population health","High","https://innovaccer.com/careers"],
  ["Kindbody","kindbody.com","Care Delivery","Growth","Fertility clinic and family-building platform","High","https://kindbody.com/careers/"],
  ["Medallion","medallion.co","Infrastructure","Growth","Provider credentialing and operations","High","https://www.medallion.co/careers"],
  ["Midi Health","joinmidi.com","Care Delivery","Growth","Virtual care for women in midlife","High","https://www.joinmidi.com/careers"],
  ["Noom","noom.com","Consumer","Late Stage","Behavior change and metabolic health","High","https://www.noom.com/careers/"],
  ["Nuna","nuna.com","Infrastructure","Late Stage","Health data analytics for payers and government","High","https://www.nuna.com/careers"],
  ["Pomelo Care","pomelocare.com","Care Delivery","Growth","Virtual maternity and newborn care","High","https://www.pomelocare.com/careers"],
  ["Progyny","progyny.com","Benefits","Public","Fertility and family-building benefits","High","https://progyny.com/careers/"],
  ["Redox","redoxengine.com","Infrastructure","Growth","Healthcare interoperability and integration","High","https://redoxengine.com/careers/"],
  ["Spring Health","springhealth.com","Benefits","Late Stage","Precision mental health benefits","High","https://www.springhealth.com/careers"],
  ["Teladoc Health","teladochealth.com","Care Delivery","Public","Large-scale virtual care platform","High","https://careers.teladochealth.com/"],
  ["Tia","asktia.com","Care Delivery","Growth","Whole-person primary care for women","High","https://asktia.com/careers"],
  ["Wellthy","wellthy.com","Benefits","Growth","Caregiving support and navigation","High","https://wellthy.com/careers/"],
  ["Zus Health","zushealth.com","Infrastructure","Growth","Shared health data infrastructure","High","https://zushealth.com/careers/"],
  ["Abridge","abridge.com","Infrastructure","Growth","Clinical AI documentation and ambient intelligence","High","https://www.abridge.com/careers"],
  ["Aidoc","aidoc.com","Infrastructure","Growth","AI coordination layer for clinical teams","High","https://www.aidoc.com/about/careers/"],
  ["Alma","helloalma.com","Care Delivery","Growth","Mental health provider network and practice tools","High","https://helloalma.com/careers/"],
  ["Arcadia","arcadia.io","Infrastructure","Growth","Healthcare data platform for value-based care","High","https://arcadia.io/careers/"],
  ["Included Health","includedhealth.com","Benefits","Late Stage","Navigation and virtual care for employers","High","https://includedhealth.com/careers/"],
  ["Cedar","cedar.com","Infrastructure","Late Stage","Patient financial experiences and billing","High","https://www.cedar.com/careers/"],
  ["Cityblock Health","cityblock.com","Care Delivery","Late Stage","Complex care for underserved communities","High","https://www.cityblock.com/careers"],
  ["Color Health","color.com","Diagnostics","Late Stage","Population health programs and screening","High","https://www.color.com/careers"],
  ["Commure","commure.com","Infrastructure","Growth","Connected technology for health systems","High","https://www.commure.com/careers"],
  ["Datavant","datavant.com","Infrastructure","Late Stage","Secure health data exchange and connectivity","High","https://www.datavant.com/careers"],
  ["Devoted Health","devoted.com","Benefits","Late Stage","Tech-enabled Medicare Advantage experience","High","https://www.devoted.com/careers"],
  ["Flatiron Health","flatiron.com","Infrastructure","Late Stage","Oncology data, research, and clinical software","High","https://flatiron.com/careers/"],
  ["Freenome","freenome.com","Diagnostics","Growth","AI-powered early cancer detection","Medium","https://www.freenome.com/careers"],
  ["Garner Health","getgarner.com","Benefits","Growth","Data-driven provider navigation","High","https://www.getgarner.com/careers"],
  ["GoodRx","goodrx.com","Pharmacy","Public","Prescription affordability and consumer health","High","https://www.goodrx.com/jobs"],
  ["Guardant Health","guardanthealth.com","Diagnostics","Public","Precision oncology and digital health AI","High","https://guardanthealth.com/careers/"],
  ["Headspace","headspace.com","Consumer","Late Stage","Digital mental health and mindfulness","High","https://www.headspace.com/careers"],
  ["Headway","headway.co","Care Delivery","Growth","Mental healthcare access and provider tools","High","https://headway.co/careers"],
  ["Highmark Health","highmarkhealth.org","Benefits","Enterprise","Integrated payer and provider experiences","Medium","https://careers.highmarkhealth.org/"],
  ["Hinge Health","hingehealth.com","Care Delivery","Late Stage","Digital musculoskeletal care","High","https://www.hingehealth.com/careers/"],
  ["Honor","honorcare.com","Care Delivery","Late Stage","Technology-enabled home care","High","https://www.honorcare.com/careers"],
  ["iRhythm","irhythmtech.com","Diagnostics","Public","Connected cardiac monitoring experiences","High","https://www.irhythmtech.com/us/en/careers"],
  ["Komodo Health","komodohealth.com","Infrastructure","Late Stage","Healthcare analytics and market intelligence","High","https://www.komodohealth.com/careers"],
  ["Kyruus Health","kyruushealth.com","Infrastructure","Growth","Provider search, scheduling, and access","High","https://kyruushealth.com/careers"],
  ["Maven Clinic","mavenclinic.com","Care Delivery","Late Stage","End-to-end family health platform","High","https://www.mavenclinic.com/careers"],
  ["Modern Health","modernhealth.com","Benefits","Growth","Global mental health benefits platform","High","https://www.modernhealth.com/careers"],
  ["Nourish","usenourish.com","Care Delivery","Growth","Virtual nutrition care and dietitian access","High","https://www.usenourish.com/careers"],
  ["Omada Health","omadahealth.com","Care Delivery","Late Stage","Virtual chronic condition care","High","https://www.omadahealth.com/careers"],
  ["Oscar Health","hioscar.com","Benefits","Public","Consumer-focused health insurance","High","https://www.hioscar.com/careers"],
  ["Oura","ouraring.com","Consumer","Late Stage","Consumer wearable and preventive health insights","High","https://ouraring.com/careers"],
  ["Owkin","owkin.com","Diagnostics","Growth","AI for drug discovery and precision medicine","Medium","https://www.owkin.com/careers"],
  ["Particle Health","particlehealth.com","Infrastructure","Growth","API platform for healthcare data access","High","https://www.particlehealth.com/careers"],
  ["Pearl Health","pearlhealth.com","Care Delivery","Growth","Technology for value-based primary care","High","https://www.pearlhealth.com/careers"],
  ["Ro","ro.co","Consumer","Late Stage","Direct-to-patient virtual care","High","https://ro.co/careers/"],
  ["Rula","rula.com","Care Delivery","Growth","Behavioral health access and provider network","High","https://www.rula.com/careers/"],
  ["Sword Health","swordhealth.com","Care Delivery","Late Stage","AI-powered digital physical therapy","High","https://swordhealth.com/careers"],
  ["Talkspace","talkspace.com","Consumer","Public","Virtual behavioral healthcare","High","https://www.talkspace.com/careers"],
  ["Tempus AI","tempus.com","Diagnostics","Public","Clinical data and AI for precision medicine","High","https://www.tempus.com/careers/"],
  ["Thirty Madison","thirtymadison.com","Consumer","Late Stage","Specialty virtual care platform","High","https://www.thirtymadison.com/careers"],
  ["Transcarent","transcarent.com","Benefits","Late Stage","Employer healthcare navigation and care","High","https://transcarent.com/careers/"],
  ["Truepill","truepill.com","Pharmacy","Growth","Digital pharmacy and fulfillment infrastructure","High","https://www.truepill.com/careers"],
  ["Turquoise Health","turquoise.health","Infrastructure","Growth","Healthcare pricing transparency","High","https://turquoise.health/careers"],
  ["Twist Bioscience","twistbioscience.com","Diagnostics","Public","Synthetic biology and precision health tools","Medium","https://www.twistbioscience.com/company/careers"],
  ["Verily","verily.com","Infrastructure","Late Stage","Health data, research, and care platforms","High","https://verily.com/careers"],
  ["Virta Health","virtahealth.com","Care Delivery","Late Stage","Virtual metabolic health treatment","High","https://www.virtahealth.com/careers"],
  ["Viz.ai","viz.ai","Infrastructure","Growth","AI-powered care coordination","High","https://www.viz.ai/careers"],
  ["Waymark","waymarkcare.com","Care Delivery","Growth","Community-based Medicaid care","High","https://www.waymarkcare.com/careers"],
  ["Wheel","wheel.com","Infrastructure","Growth","Virtual care infrastructure and clinician network","High","https://www.wheel.com/careers"],
  ["Woebot Health","woebothealth.com","Consumer","Growth","AI-supported mental health tools","High","https://woebothealth.com/careers/"],
  ["Zocdoc","zocdoc.com","Consumer","Late Stage","Healthcare discovery and appointment booking","High","https://www.zocdoc.com/about/careers/"]
];

const usHiringCompanies = new Set([
  "Abridge", "AliveCor", "Alma", "Alto Pharmacy", "Amazon One Medical", "Amwell", "Arcadia", "athenahealth",
  "Carbon Health", "Carrot Fertility", "Cedar", "Cityblock Health", "Color Health", "Commure", "Datavant", "Devoted Health",
  "Dexcom", "Doximity", "Epic", "Flatiron Health", "Freenome", "Garner Health", "GoodRx", "Grow Therapy",
  "Guardant Health", "Headspace", "Headway", "Health Gorilla", "Highmark Health", "Hinge Health", "Honor", "Included Health",
  "iRhythm", "Kindbody", "Komodo Health", "Kyruus Health", "Maven Clinic", "Medallion", "Midi Health", "Modern Health",
  "Noom", "Nourish", "Nuna", "Omada Health", "Oscar Health", "Particle Health", "Pearl Health", "Pomelo Care",
  "Progyny", "Redox", "Ro", "Rula", "Spring Health", "Talkspace", "Teladoc Health", "Tempus AI",
  "Thirty Madison", "Tia", "Transcarent", "Turquoise Health", "Twist Bioscience", "Verily", "Virta Health",
  "Waymark", "Wellthy", "Wheel", "Zocdoc", "Zus Health"
]);
const eligibleCompanies = companies.filter((company) => usHiringCompanies.has(company[0]));

const database = document.querySelector("#companyDatabase");
const search = document.querySelector("#companySearch");
const filters = document.querySelectorAll(".database-filter");
let activeFilter = "all";

function sectorDot(sector) {
  if (["Care Delivery","Benefits"].includes(sector)) return "green-dot";
  if (["Infrastructure","Diagnostics"].includes(sector)) return "purple-dot";
  return "coral-dot";
}

function stageLabel(stage) {
  return stage === "Enterprise" ? "Enterprise" : stage;
}

function renderCompanies() {
  const query = search.value.trim().toLowerCase();
  const visible = eligibleCompanies.filter((company) => {
    const filterMatch = activeFilter === "all" || company[2] === activeFilter;
    return filterMatch && company.join(" ").toLowerCase().includes(query);
  }).sort((a, b) => a[0].localeCompare(b[0]));

  database.innerHTML = visible.map(([name, domain, sector, stage, interesting, fit, careers]) => `
    <div class="table-row company-row">
      <a class="company-name" href="https://${domain}" target="_blank" rel="noopener"><span class="logo-block"><img src="https://www.google.com/s2/favicons?domain=${domain}&sz=128" alt="${name} logo"></span><div><strong>${name}</strong><small>${domain}</small></div></a>
      <span><i class="sector-dot ${sectorDot(sector)}"></i>${sector}</span>
      <span class="stage">${stageLabel(stage)}</span>
      <span>${interesting}</span>
      <span class="fit ${fit === "High" ? "fit-high" : "fit-medium"}">${fit}</span>
      <a class="career-link" href="${careers}" target="_blank" rel="noopener"><strong>View careers →</strong></a>
    </div>`).join("");

  document.querySelector("#companyResultCount").textContent = `${visible.length} ${visible.length === 1 ? "company" : "companies"}`;
  document.querySelector("#emptyCompanies").hidden = visible.length !== 0;
  document.querySelector(".company-database-table").hidden = visible.length === 0;
}

document.querySelector("#companyTotal").textContent = `${eligibleCompanies.length} companies`;
localStorage.setItem("companyDatabaseCount", eligibleCompanies.length);
search.addEventListener("input", renderCompanies);
filters.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filters.forEach((filter) => filter.classList.toggle("active", filter === button));
  renderCompanies();
}));
renderCompanies();
