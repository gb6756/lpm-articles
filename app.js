// Variables globales

let allArticles = [];
let filteredArticles = [];
// --- VARIABLES POUR LA PAGINATION ---
let currentPage = 1;
const itemsPerPage = 24; // Ex: 24 livres par page (divisible par 4 colonnes = 6 lignes)
// Utilitaire pour récupérer une valeur CSV sans se soucier des majuscules/accents
/*
function getVal(row, possibleKeys) {
    if (!row) return '';
    const keys = Object.keys(row);
    for (let pk of possibleKeys) {
        const found = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
        if (found && row[found] !== undefined && row[found] !== null) return row[found].toString().trim();
    }
    return '';
}

// Nettoyage HTML pour éviter les failles
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Surlignage du mot-clé dans le résumé
function highlightText(text, search) {
    if (!search) return escapeHtml(text);
    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="highlight">$1</mark>');
}

// Affichage du tableau et du compteur
function render() {
    const grid = document.getElementById('ArticlesGrid');
    const countElement = document.getElementById('bookCount');
    const paginationElement = document.getElementById('pagination');

    if (!grid) return;

    // 1. Mise à jour du compteur global
    if (countElement) {
        if (allArticles.length === 0) {
            countElement.textContent = "Aucun livre dans le catalogue.";
        } else if (filteredArticles.length === allArticles.length) {
            countElement.innerHTML = `Total : <span class="results-count-badge">${allArticles.length}</span> livre(s)`;
        } else {
            countElement.innerHTML = `Trouvé(s) : <span class="results-count-badge">${filteredArticles.length}</span> sur ${allArticles.length} livre(s)`;
        }
    }

    // 2. Si aucun résultat
    if (filteredArticles.length === 0) {
        grid.innerHTML = '<div class="no-results">Aucun livre ne correspond à votre recherche.</div>';
        if (paginationElement) paginationElement.innerHTML = '';
        return;
    }

    // 3. Découpage des résultats pour la page actuelle
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    
    // Si la page actuelle dépasse le total suite à un filtrage, on revient à la page 1
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const ArticlesToDisplay = filteredArticles.slice(startIndex, endIndex);

    // 4. Génération des cartes HTML (uniquement pour la page courante)
    grid.innerHTML = ArticlesToDisplay.map((b, i) => {
        // Indice réel du livre dans le tableau filteredArticles
        const realIndex = startIndex + i; 

        const numero = escapeHtml(getVal(b, ['Numero']) || '-');
		const annee = escapeHtml(getVal(b, ['Année']) || '-');
		const mois = escapeHtml(getVal(b, ['Mois']) || '-');		
        const titre = escapeHtml(getVal(b, ['Titre']) || 'Sans titre');
        const auteur = escapeHtml(getVal(b, ['Auteur']) || 'Auteur inconnu');
        return `
            <div class="book-card" onclick="openModal(${realIndex})">
                <div class="card-header">
                    <span class="cote-badge">${cote}</span>
                    ${type ? `<span class="type-badge">${type}</span>` : ''}
                </div>
                <h3 class="card-title">${titre}</h3>
                <p class="card-author">✍️ ${auteur}</p>
                ${theme ? `<p class="card-theme">📁 ${theme}</p>` : ''}
                <div class="card-footer">
                    <span>Voir la fiche →</span>
                </div>
            </div>
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
    document.getElementById('ArticlesGrid').scrollIntoView({ behavior: 'smooth' });
}
// Fonction utilitaire pour retirer tous les accents et mettre en minuscules
// Fonction utilitaire robuste pour retirer TOUS les accents / diacritiques
function cleanString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, ""); // Supprime tous les accents (méthode Unicode universelle)
}
*/
// Application des filtres de recherche (insensible aux accents et majuscules)
function applyFilters() {
    const elNumero = document.getElementById('fNumero');
	const elAnnee = document.getElementById('fAnnee');
	const elMois = document.getElementById('fMois');
    const elAuteur = document.getElementById('fAuteur');
    const elTitre = document.getElementById('fTitre');	
    const elMotsCle = document.getElementById('fMotsClé');

    // Nettoyage de ce que saisit l'utilisateur (sans accents, sans majuscules)
    const n = cleanString(elNumero ? elNumero.value : '');
	const an = cleanString(elAnnee ? elAnnee.value : '');
	const m = cleanString(elMois ? elMois.value : '');
    const t = cleanString(elTitre ? elTitre.value : '');
    const a = cleanString(elAuteur ? elAuteur.value : '');
    const r = cleanString(elMotsCle ? elMotsCle.value : '');

    filteredArticles = allArticles.filter(b => {
        // Nettoyage des données des livres pour la comparaison
        const cote = cleanString(getVal(b, ['Cote']));
        const cote = cleanString(getVal(b, ['Cote']));		
        const titre = cleanString(getVal(b, ['Titre']));
        const auteur = cleanString(getVal(b, ['Auteur']));
        const resume = cleanString(getVal(b, ['MotsClé', 'MotsClé']));

        return (!n || cote.includes(n)) &&
               (!t || titre.includes(t)) &&
               (!a || auteur.includes(a)) &&
               (!r || resume.includes(r));
    });

    render();
}

// Remise à zéro des filtres
function resetFilters() {
    if (document.getElementById('fNumero')) document.getElementById('fNumero').value = '';
	if (document.getElementById('fAnnee')) document.getElementById('fAnnee').value = '';
	if (document.getElementById('fMois')) document.getElementById('fMois').value = '';
    if (document.getElementById('fAuteur')) document.getElementById('fAuteur').value = '';	
    if (document.getElementById('fTitre')) document.getElementById('fTitre').value = '';
    if (document.getElementById('fMotsCle')) document.getElementById('fMotsCle').value = '';
    applyFilters();
}
/*
// Gestion de la Pop-up (Modal)
function openModal(i) {
    const b = filteredArticles[i];
    if (!b) return;

    const elResume = document.getElementById('fResume');
    const searchTerm = elResume ? elResume.value.trim() : '';

    document.getElementById('mTitre').textContent = getVal(b, ['Titre']) || 'Sans titre';
    document.getElementById('mAuteur').textContent = getVal(b, ['Auteur']) || '-';
    document.getElementById('mCote').textContent = getVal(b, ['Cote']) || '-';
    document.getElementById('mType').textContent = getVal(b, ['Type']) || '-';
    document.getElementById('mDispo').textContent = getVal(b, ['Disponibilité', 'Disponibilite']) || '-';
    document.getElementById('mFond').textContent = getVal(b, ['Fond', 'Fonds']) || '-';
    
    const date = getVal(b, ['Date']);
    const edit = getVal(b, ['Édition', 'Edition']);
    document.getElementById('mDateEdit').textContent = (date || '-') + (edit ? ` (Éd. ${edit})` : '');
    
    document.getElementById('mTome').textContent = getVal(b, ['Tome']) || '-';
    document.getElementById('mTheme').textContent = (getVal(b, ['Thème général', 'Theme general']) || '-') + ' / ' + (getVal(b, ['Thème particulier', 'Theme particulier']) || '-');
    
    const rawResume = getVal(b, ['Résumé', 'Resume']) || 'Aucun résumé renseigné.';
    const mResume = document.getElementById('mResume');
    
    if (searchTerm && rawResume !== 'Aucun résumé renseigné.') {
        mResume.innerHTML = highlightText(rawResume, searchTerm);
    } else {
        mResume.textContent = rawResume;
    }
    
    document.getElementById('modal').classList.add('active');
}
//Fermeture pop-up modal par la croix X
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
}
//Fermeture pop-up modal par clic extérieur
window.addEventListener('click', function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});
*/
// --- CHARGEMENT AUTOMATIQUE DEPUIS GITHUB ---
window.addEventListener('DOMContentLoaded', function() {
	alert('ok');
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.style.color = 'black';
        statusEl.textContent = "Chargement des articles...";
    }

    fetch('lpm-articles.csv')
        .then(response => {
            if (!response.ok) throw new Error("Fichier introuvable");
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(res) {
                    if (res.data && res.data.length > 0) {
                        allArticles = res.data;

                        if (statusEl) {
                            statusEl.style.color = '#16a34a';
                            statusEl.textContent = `✅ ${allArticles.length} articles disponibles`;
                        }
                        applyFilters();
                    } else {
                        if (statusEl) {
                            statusEl.style.color = '#dc2626';
                            statusEl.textContent = "❌ Pas d'articles.";
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
