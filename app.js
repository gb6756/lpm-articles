// Variables globales
let allArticles= [];
let filteredArticles = [];
// --- VARIABLES POUR LA PAGINATION ---
let currentPage = 1;
const itemsPerPage = 24; // Ex: 24 livres par page (divisible par 4 colonnes = 6 lignes)
// Utilitaire pour récupérer une valeur CSV sans se soucier des majuscules/accents
// Nettoyage HTML pour éviter les failles
   function getVal(row, possibleKeys) {
        if (!row) return '';
        const keys = Object.keys(row);
        for (let pk of possibleKeys) {
            const found = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
            if (found && row[found] !== undefined && row[found] !== null) return row[found].toString().trim();
        }
        return '';
    }
function escapeHtml(str) {
   if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Affichage du tableau et du compteur
// Affichage sous forme de cartes (pavés)
  function applyFilters() {
        const n = document.getElementById('fnumero').value.toLowerCase();
        const y = document.getElementById('fannee').value.toLowerCase();
        const m = document.getElementById('fmois').value.toLowerCase();
		const a = document.getElementById('fauteur').value.toLowerCase();
		const t = document.getElementById('ftitre').value.toLowerCase();
		const w = document.getElementById('fmotscle').value.toLowerCase();
        filteredArticles = allArticles.filter(b => {
            const num = getVal(b, ['Numéro']).toLowerCase();
            const annee = getVal(b, ['Année']).toLowerCase();
            const moisnum = getVal(b, ['MoisNum']).toLowerCase();
			const auteur = getVal(b, ['Auteur']).toLowerCase();
			const titre = getVal(b, ['Titre']).toLowerCase();
			const motscle = getVal(b, ['MotsClé']).toLowerCase();
			const lien = getVal(b, ['Lien']);			
			

            return (!n || num.includes(n)) &&
                   (!y || annee.includes(y)) &&
                   (!m || moisnum.includes(m)) &&
				   (!a || auteur.includes(a)) &&
				   (!t || titre.includes(t)) &&				   
				   (!w || motscle.includes(w)) &&
				   lien;
        });
        render();
    }
// Affichage sous forme de cartes (pavés)
function render() {
    const grid = document.getElementById('articlesGrid');
	const countElement = document.getElementById('linkCount');

    if (!grid) return;
	  if (countElement) {
        if (allArticles.length === 0) {
            countElement.textContent = "Aucun lien dans le catalogue.";
        } else if (filteredArticles.length === allArticles.length) {
            countElement.innerHTML = `Total : <span class="results-count-badge">${allArticles.length}</span> liens`;
        } else {
            countElement.innerHTML = `Trouvé(s) : <span class="results-count-badge">${filteredArticles.length}</span> sur ${allArticles.length} liens`;
        }
    }
    // Si aucun livre trouvé
    if (filteredArticles.length === 0) {
        grid.innerHTML = '<div class="no-results">Aucun lien ne correspond à votre recherche.</div>';
        return;
    }
// 3. Découpage des résultats pour la page actuelle
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    // Si la page actuelle dépasse le total suite à un filtrage, on revient à la page 1
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const articlesToDisplay = filteredArticles.slice(startIndex, endIndex);
	
    // Génération des cartes
    grid.innerHTML = articlesToDisplay.map((b, i) => {
		// Indice réel du livre dans le tableau filteredBooks
		const realIndex = startIndex + i;
		
        const num = escapeHtml(getVal(b, ['Numéro']) || '-');
        const annee = escapeHtml(getVal(b, ['Année']) || '-');
        const mois = escapeHtml(getVal(b, ['Mois']) || '-');
		const ref=num+" - "+mois+" "+annee;
        const auteur = escapeHtml(getVal(b, ['Auteur']) || '-');
        const titre = escapeHtml(getVal(b, ['Titre']) || '');
		//const lien = escapeHtml(getVal(b, ['Lien']) || '');
        return `
			<a href="${getVal(b,['Lien'])}"target="_blank" rel="noopener noreferrer">
            <div class="articles-card">
				<div class="ref-card">${ref}</div>
				<div class="auteur-card">Auteur : ${auteur}</div>
				<div class="titre-card">Titre : ${titre}</div>
			</div>
			</a>
        `;
    }).join('');
	// 5. Génération des boutons de pagination
    renderPagination(totalPages);
}
// Fonction qui génère les boutons 1, 2, 3...
function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement || totalPages <= 1) {
        if (paginationElement) paginationElement.innerHTML = '';
        return;
    }

    let buttonsHtml = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">❮ Précédent</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        // Affiche la page si elle est proche de la page courante
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            buttonsHtml += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            buttonsHtml += `<span class="page-dots">...</span>`;
        }
    }

    buttonsHtml += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Suivant ❯</button>
    `;

    paginationElement.innerHTML = buttonsHtml;
}

// Changement de page
function changePage(newPage) {
    currentPage = newPage;
    render();
    // Remonte doucement en haut de la grille pour le confort
    document.getElementById('linkGrid').scrollIntoView({ behavior: 'smooth' });
}
// Fonction utilitaire pour retirer tous les accents et mettre en minuscules
function cleanString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Supprime tous les diacritiques (accents)
}
// --- INITIALISATION AU CHARGEMENT DE LA PAGE ---
window.addEventListener('DOMContentLoaded', function() {
    const statusEl = document.getElementById('status');

    if (statusEl) {
        statusEl.style.color = '#475569';
        statusEl.textContent = "Chargement du catalogue...";
    }

    fetch('lpm-articles.csv')
        .then(response => {
            if (!response.ok) throw new Error("Fichier introuvable");
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
				delimiter: "@",
                skipEmptyLines: true,
                complete: function(res) {
                    if (res.data && res.data.length > 0) {
                        allLinks = res.data;
                        if (statusEl) {
                            statusEl.style.color = '#16a34a';
                            statusEl.textContent = `✅ ${allArticles.length} liens disponibles`;
                        }

                        // Écouteurs d'événements sur les champs de filtrage
                        applyFilters();
                    } else {
                        if (statusEl) {
                            statusEl.style.color = '#dc2626';
                            statusEl.textContent = "❌ Le fichier CSV semble vide.";
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error(err);
            if (statusEl) {
                statusEl.style.color = '#dc2626';
                statusEl.textContent = "❌ Impossible de charger le catalogue.";
            }
        });
});