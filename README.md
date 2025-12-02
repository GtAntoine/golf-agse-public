# ⛳ AGSE Golf - Case Study

> Portfolio d'une application web d'une association de golf
> avec adoption anticipée grâce à une approche centrée utilisateur et un ROI immédiat

<div align="center">
  <img src="./images/accueil" alt="Page d'accueil AGSE Golf" width="100%" />
  <br/>
  <em>Page d'accueil de l'application AGSE Golf</em>
</div>

<div align="center" style="margin-top: 20px;">
    <img src="./images/form.png" alt="Formulaire d'adhésion" width="100%" />
  <br/>
  <em>Formulaire d'adhésion multi-étapes</em>
</div>

---

## 👋 Contexte : Du Besoin à la Solution

### Le Stakeholder

**Mon père**, trésorier de l'AGSE Golf (Association Générale Sportive et d'Éducation - section Golf), gérait manuellement les adhésions de **~100 membres** avec :

- **Google Forms** pour la collecte d'adhésions
- **3 Google Sheets séparés** :
  - Feuille 1 : Données brutes du formulaire
  - Feuille 2 : Suivi des paiements (adhésion + licence FFG)
  - Feuille 3 : Liste des membres validés

**Pain points identifiés :**
- ❌ **Duplication de données** : Copier-coller manuel entre les 3 feuilles
- ❌ **Erreurs humaines** : Oublis, doublons, incohérences
- ❌ **Pas de workflow** : Validation ad-hoc, pas de statuts clairs
- ❌ **Export complexe** : Difficile de générer des exports pour la FFG
- ❌ **Pas de self-service** : Membres ne peuvent pas modifier leurs données
- ❌ **Gestion des paiements** : Tracking manuel, pas d'historique structuré

---

## 🔍 Analyse de Marché : Make vs Buy

En tant que Product Owner, j'ai d'abord analysé les **solutions existantes** avant de décider de construire.

### Options Évaluées

| Solution | Prix | Avantages | Inconvénients | Décision |
|----------|------|-----------|---------------|----------|
| **AssoConnect** | 29€/mois | Complet, support | Trop lourd (CRM, compta), surcoût inutile | ❌ Rejeté |
| **HelloAsso** | Gratuit + 5% frais | Paiement en ligne | Orienté événements, pas de gestion adhérents | ❌ Rejeté |
| **Yapla** | ~20€/mois | Spécialisé associations | Complexe, migration difficile, dépendance vendor | ❌ Rejeté |
| **Google Sheets (actuel)** | Gratuit | Familiarité | Manuel, erreurs, pas scalable | ❌ Insuffisant |
| **Solution custom** | 0€ (dev interne) | 100% adapté, gratuit, migrable | Temps dev | ✅ **Choisi** |

### Critères de Décision PO

**Pourquoi une solution custom a gagné :**

1. **ROI immédiat** : 0€ vs 20-30€/mois × 12 = **240-360€/an économisés**
2. **Simplicité** : Fonctionnalités exactement nécessaires, pas de bloat
3. **Propriété des données** : PostgreSQL auto-hébergeable, migration facile
4. **Pérennité** : Code open-source, pas de dépendance à un SaaS qui peut fermer
5. **Customisation** : Workflow exactement adapté (cycle Sept-Août, types de licences FFG)

**Temps de développement estimé vs coût SaaS :**
- Temps dev : ~40 heures (1 mois part-time)
- Équivalent monétaire si freelance : ~2 000€
- Break-even vs SaaS : 2000€ / 300€/an = **7 ans** (acceptable pour une association pérenne)

---

## 💡 Approche Product Owner

### Phase 1 : Discovery & Requirements Gathering

**Méthode :** Entretiens avec le stakeholder (mon père) + observation du process actuel

**Questions posées :**
- Quels sont les 3 moments les plus pénibles de ton workflow actuel ?
- Combien de temps passes-tu par semaine sur la gestion des adhésions ?
- Quelles erreurs se produisent régulièrement ?
- Quelles sont les données obligatoires pour la FFG ?
- Quel est le cycle de vie d'une adhésion ?

**Réponses clés obtenues :**
- **~2-3h/semaine** perdues sur des tâches manuelles
- **Erreurs fréquentes** : Oubli de validation, doublons, paiements non tracés
- **Données FFG** : Index golf, numéro licence, type de licence
- **Cycle** : Septembre → Août (année scolaire), renouvellement annuel

### Phase 2 : User Stories & Backlog

**En tant que trésorier**, je veux :
- ✅ Voir toutes les candidatures en attente de validation (dashboard admin)
- ✅ Valider une candidature en 1 clic (modal de validation)
- ✅ Tracker les paiements (adhésion + licence FFG séparés)
- ✅ Exporter la liste complète pour la FFG (CSV/Excel)
- ✅ Changer le statut d'un membre (AGSE → RATTACHE)
- ✅ Voir l'historique des paiements par année

**En tant que membre**, je veux :
- ✅ M'inscrire en ligne facilement (formulaire multi-étapes)
- ✅ Voir le statut de ma candidature (dashboard membre)
- ✅ Modifier mes informations personnelles (self-service)
- ✅ Voir mes paiements en cours et validés
- ✅ Télécharger mon reçu de paiement (V2)

### Phase 3 : Force de Proposition (Valeur Ajoutée PO)

**Fonctionnalités proposées (non demandées initialement) :**

#### 1. Multi-Step Form avec Calcul Automatique

**Problème identifié :** Le formulaire Google était long et intimidant (1 seule page).

**Solution proposée :**
- Découpage en 3 étapes : Type d'adhésion → Informations personnelles → Récapitulatif
- **Calcul automatique du total** selon :
  - Type d'adhésion (GOLF 70€, GOLF LOISIR 70€, GOLF JEUNE 35€)
  - Type de licence FFG (Adulte 78€, Jeune adulte 54€, Jeune 31€, Enfant 24€)
  - Application ou non d'une licence FFG

**Impact :** Taux de complétion du formulaire amélioré (aucun abandon observé vs ~10% avec Google Forms)

#### 2. Dashboard avec Statuts Visuels

**Problème identifié :** Pas de visibilité pour le membre sur l'état de sa candidature.

- **Timeline** : "Candidature soumise → Validation → Paiement adhésion → Paiement licence → Membre actif"


#### 3. Gestion des Paiements Séparés

**Problème identifié :** Adhésion et licence FFG payées à des moments différents, difficile à tracker.

**Solution proposée :**
- **Deux checkboxes séparées** : Adhésion payée / Licence payée
- **Historique par année** : Table `payment_history` avec état pour chaque année
- **Calcul automatique du solde** : "Total dû : 148€ | Payé : 70€ | Reste : 78€"

**Impact :** Zéro erreur de tracking vs ~5 erreurs/an avec Google Sheets

---

## 🚀 Fonctionnalités Clés

### 1. Formulaire d'Adhésion Multi-Étapes

**Technologies :** React Context API pour state management multi-step

**Flow UX :**
```
Étape 1 : Sélection Type
[GOLF] [GOLF LOISIR] [GOLF JEUNE]
    ↓
Demander licence FFG ? [Oui] [Non]
    ↓
Si oui : Type de licence [Adulte] [Jeune adulte] [Jeune] [Enfant]
    ↓
Étape 2 : Informations Personnelles
Email, Nom, Prénom, Date naissance, Adresse, Téléphone, Index golf, N° licence FFG
    ↓
Étape 3 : Récapitulatif avec Calcul Total
Type adhésion : GOLF (70€)
Licence FFG : Adulte (78€)
Total : 148€
[Valider l'adhésion]
```

**Validation automatique :**
- Email unique (pas de doublon)
- Date de naissance cohérente avec type de licence (Jeune < 25 ans, Enfant < 13 ans)
- Numéro de licence FFG optionnel mais requis si "Demander licence FFG"

### 2. Dashboard Admin avec Actions Rapides

**Tableau de bord avec :**
- **Liste des candidatures** : Filtres par statut (En attente / Validé / Tous)
- **Actions 1-clic** :
  - ✅ Valider candidature
  - 💰 Marquer adhésion payée
  - 🏌️ Marquer licence payée
  - 🔄 Changer type membre (AGSE ↔ RATTACHE)
  - 📊 Voir détails complets
  - 🗑️ Supprimer (avec confirmation)

**Modals de validation :**
- **ValidationModal** : Valide la candidature + crée l'entrée `payment_history`
- **PaymentModal** : Update les checkboxes paiement + année cible

### 3. Gestion des Rôles (Admin / User)

**Row Level Security (RLS) Supabase :**
- **Admins** :
  - Accès à `/admin/dashboard` (toutes les candidatures)
  - Accès à `/admin/users` (gestion des utilisateurs)
  - Accès aux exports Excel
  - Actions de validation/modification

- **Users** :
  - Accès à `/profile` (leur propre profil)
  - Accès à `/payment-info` (leur statut de paiement)
  - Modification de leurs données personnelles

**Sécurité :**
- Les policies RLS empêchent un user de voir/modifier les données d'autres users
- Les routes admin vérifient `profile.role === 'admin'` via `PrivateRoute`

### 4. Export Excel/CSV pour FFG

**Fonctionnalité :**
- **Export complet** : Toutes colonnes (nom, prénom, date naissance, index, licence FFG, etc.)
- **Export FFG** : Seulement colonnes requises par Fédération Française de Golf
- **Calcul année** : Application créée en Sept+ = année N+1 (cycle scolaire)
- **Filtrage** : Seulement membres validés avec licence FFG demandée

### 5. Cycle de Vie Adhésion (Septembre → Août)

**Logique métier spécifique golf :**

- **Année N (ex: 2024)** : Septembre 2024 → Août 2025
- **Renouvellement** : À partir de septembre, les adhésions sont pour l'année N+1
- **Calcul automatique** :
  ```typescript
  const getTargetYear = (applicationDate: string) => {
    const date = new Date(applicationDate)
    const month = date.getMonth() // 0-11
    const year = date.getFullYear()

    // Septembre (8) à Décembre (11) = année suivante
    return month >= 8 ? year + 1 : year
  }
  ```

**Impact PO :** Cette règle métier spécifique (pas dans les outils SaaS génériques) justifie la solution custom.

---

## 📊 Architecture Technique

### Stack

**Frontend :**
- **React 18** + **TypeScript** + **Vite** (build rapide)
- **Tailwind CSS** (utility-first, design system cohérent)
- **lucide-react** (icônes modernes)
- **xlsx** (export Excel)

**Backend & BDD :**
- **Supabase** (PostgreSQL + Auth + RLS + Storage)
- **Row Level Security** (isolation données par user)
- **Database triggers** : Auto-création profil à l'inscription

**Deployment :**
- **Netlify** (frontend)
- **Supabase Cloud** (backend)

### Ampleur du Projet

- **~6 000 lignes de code** dans `src/`
  - TypeScript (.ts) : 1k lignes
  - TypeScript React (.tsx) : 5k lignes
  - **57 fichiers** TS/TSX

---

## 📈 Résultats & KPIs

### Adoption Anticipée : Success Story

**Objectif initial :** Lancement septembre 2025 (début année scolaire)

**Résultat réel :** Lancement janvier 2025 (**8 mois d'avance**)

**Raison de l'anticipation :**
> "L'application est tellement bien et fonctionnelle qu'on va l'utiliser dès maintenant pour les renouvellements de janvier, pas besoin d'attendre septembre." — Mon père, trésorier AGSE Golf

**Traduction PO :** Le produit a créé suffisamment de valeur pour justifier un changement de process immédiat.


### ROI Financier

**Coût solution SaaS équivalente :** 300€/an (25€/mois)

**Coût solution custom :**
- Développement : 40h × 0€ (dev interne)
- Hébergement Supabase : **0€**
- Hébergement Netlify : **0€**
- **Total : 0€/an**

**Économies annuelles :** **300€/an** = **1 adhésion gratuite offerte** chaque année

**ROI sur 5 ans :** 1 500€ économisés

### Impact Qualitatif

**Avant (Google Forms + Sheets) :**
- ❌ Trésorier passe 2-3h/semaine sur gestion adhésions
- ❌ Membres ne savent pas où en est leur candidature (emails répétés)
- ❌ Erreurs de saisie/oublis fréquents

**Après (AGSE Golf App) :**
- ✅ Trésorier passe 30 minutes/semaine (automatisation)
- ✅ Membres voient leur statut en temps réel (self-service)
- ✅ Zéro erreur (validation formulaire + BDD structurée)

**Citation du stakeholder :**
> "Avant, je redoutais la période d'adhésions en septembre. Maintenant, c'est un plaisir. Tout est clair, automatique, et je ne perds plus mon temps sur des tâches inutiles."

---

## 🎯 Positionnement pour un Recruteur

Ce projet démontre ma capacité à **mener un projet produit de A à Z** avec une approche pragmatique et centrée ROI.

### Compétences Démontrées

- ✅ **Discovery & Requirements** : Entretiens stakeholder, observation terrain
- ✅ **Make vs Buy analysis** : Comparaison rigoureuse solutions existantes vs custom
- ✅ **Priorisation ROI** : Focus sur valeur (économies 300€/an + gain temps)
- ✅ **Force de proposition** : Fonctionnalités non demandées mais à forte valeur (multi-step form, dashboard statuts)
- ✅ **User stories** : Décomposition claire des besoins (admin vs membre)
- ✅ **Validation métrique** : KPIs mesurables (adoption anticipée, temps gagné)

### Compétences Transverses

- ✅ **Pragmatisme** : Choix de la simplicité (6k lignes) vs over-engineering
- ✅ **Sens du ROI** : 0€ vs 300€/an = économie immédiate
- ✅ **User-centric** : Chaque feature répond à un pain point réel
- ✅ **Adaptabilité** : Logique métier spécifique (cycle Sept-Août, types licences FFG)
- ✅ **Double casquette** : Capacité à designer ET implémenter

### Learnings Clés

#### 1. Small is Beautiful

**Insight :** Un produit de 6k lignes peut avoir autant d'impact qu'un produit de 15k lignes, si les fonctionnalités sont exactement adaptées au besoin.

**Application future :** Toujours challenger la complexité. "Do we really need this feature?"

#### 2. ROI > Perfection

**Insight :** Solution custom à 0€ adoptée 8 mois en avance > Solution SaaS à 300€/an "parfaite" mais avec friction d'adoption.

**Application future :** Prioriser time-to-value et coût réel vs fonctionnalités exhaustives.

#### 3. Stakeholder Proximity = Product Success

**Insight :** Avoir le stakeholder (mon père) disponible 24/7 pour feedback a permis des itérations ultra-rapides.

**Application future :** Maximiser la proximité avec les users clés (co-création, embedded PO).

#### 4. Make vs Buy Requires Rigor

**Insight :** La décision "custom vs SaaS" doit être basée sur critères objectifs (coût, pérennité, migration), pas sur envie de coder.

**Application future :** Toujours faire l'analyse comparative complète avant de décider.

---

