const focales = [24, 35, 50, 85, 105, 135, 200, 300, 400, 600, 800];
const ouvertures = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/22"];
const ouverturesNum = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const distances = [0.5, 1, 2, 3, 5, 10, 20, 50, 100];

let focaleIndex = 2; // 50mm
let ouvertureIndex = 2; // f/2.8
let distanceIndex = 2; // 2m


function changerValeur(param, direction) {
  switch(param) {
    case 'focale':
      focaleIndex = Math.max(0, Math.min(focales.length - 1, focaleIndex + direction));
      document.getElementById('focaleValeur').textContent = focales[focaleIndex];
      break;
    case 'ouverture':
      ouvertureIndex = Math.max(0, Math.min(ouvertures.length - 1, ouvertureIndex + direction));
      document.getElementById('ouvertureValeur').textContent = ouvertures[ouvertureIndex];
      break;
    case 'distance':
      distanceIndex = Math.max(0, Math.min(distances.length - 1, distanceIndex + direction));
      document.getElementById('distanceValeur').textContent = distances[distanceIndex];
      break;
  }
  calculer();
}

function calculer() {
  let f = focales[focaleIndex];
  let N = ouverturesNum[ouvertureIndex];
  let s = distances[distanceIndex] * 1000; // en mm
  let c = parseFloat(document.getElementById('capteur').value);

  const H = (f * f) / (N * c) + f;
  const near = (H * s) / (H + (s - f));
  const far = (H * s) / (H - (s - f));
  const nearM = near / 1000;
  const farM = far > 0 ? far / 1000 : Infinity;

  const unite = document.getElementById('uniteChamp').value;
  let profondeurChamp;
  if (farM === Infinity) {
    profondeurChamp = "∞";
  } else {
    const diffMeters = farM - nearM;
    let valeur, suffixe;
    if (unite === "mm") {
      valeur = diffMeters * 1000;
      suffixe = "mm";
    } else if (unite === "cm") {
      valeur = diffMeters * 100;
      suffixe = "cm";
    } else {
      valeur = diffMeters;
      suffixe = "m";
    }
    profondeurChamp = valeur.toFixed(2) + " " + suffixe;
  }

  document.getElementById('resultat').innerHTML =
    `Focale : ${f} mm<br>
    Ouverture : ${ouvertures[ouvertureIndex]}<br>
    Distance sujet : ${distances[distanceIndex]} m<br>
    Zone nette : de ${nearM.toFixed(2)} m à ${farM === Infinity ? "∞" : farM.toFixed(2) + " m"}<br>
    Hyperfocale : ${(H / 1000).toFixed(2)} m<br>
    Profondeur de champ : ${profondeurChamp}`;

  const svg = document.getElementById('schemaSVG');
  const svgWidth = svg.clientWidth || 500;
  const sujetPos = svgWidth / 2;
  const maxDistance = farM === Infinity ? (H / 1000) : Math.max(farM, H / 1000);
  const scale = (svgWidth - 100) / maxDistance;

  const nearPos = Math.max(20, sujetPos - (nearM * scale));
  const farPos = farM === Infinity ? svgWidth - 20 : Math.min(svgWidth - 20, sujetPos + (farM * scale));
  const hyperPos = Math.min(svgWidth - 20, sujetPos + ((H / 1000) * scale));

  const zoneNette = document.getElementById('zoneNette');
  zoneNette.setAttribute('x', nearPos);
  zoneNette.setAttribute('width', farPos - nearPos);

  const hyperfocale = document.getElementById('hyperfocale');
  hyperfocale.setAttribute('x1', hyperPos);
  hyperfocale.setAttribute('x2', hyperPos);

  const sujet = document.getElementById('sujet');
  sujet.setAttribute('cx', sujetPos);
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

window.addEventListener('DOMContentLoaded', () => {
  calculer();
  window.addEventListener('resize', calculer);

});
