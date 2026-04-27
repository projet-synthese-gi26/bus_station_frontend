C'est une étape cruciale. Une mauvaise manipulation git peut écraser du travail ou créer des conflits difficiles à résoudre.

Voici la procédure **standard et propre** pour déployer ton code de ta branche de développement (`atabong`) vers l'intégration (`merge`) puis la production (`main`).

### Le Flux de Travail (Workflow)

`atabong` (Dev) ➔ `merge` (Test/Intégration) ➔ `main` (Production)

---

### Étape 1 : Sauvegarder et sécuriser ta branche (`atabong`)

Avant de penser à fusionner, il faut que ta branche actuelle soit propre et sauvegardée sur le serveur distant (GitHub/GitLab).

1.  **Vérifie que tu es sur ta branche :**

    ```bash
    git checkout atabong
    ```

2.  **Ajoute tes modifications :**

    ```bash
    git add .
    ```

3.  **Commit ton travail (avec un message clair) :**

    ```bash
    git commit -m "Feat: Ajout dynamique Gares Routières et Agences via JSON Server"
    ```

4.  **Envoie (Push) sur le serveur :**
    ```bash
    git push origin atabong
    ```

---

### Étape 2 : Fusionner vers la branche `merge`

C'est ici que tu testes si ton code s'intègre bien avec le travail des autres.

1.  **Bascule sur la branche `merge` :**

    ```bash
    git checkout merge
    ```

2.  **⚠️ TRÈS IMPORTANT : Récupère les dernières modifications serveur !**
    _Pourquoi ?_ Si un collègue a poussé du code sur `merge` il y a 5 minutes, tu dois l'avoir avant de fusionner ton travail, sinon tu vas créer des conflits ou écraser son travail.

    ```bash
    git pull origin merge
    ```

3.  **Fusionne ta branche `atabong` dans `merge` :**

    ```bash
    git merge atabong
    ```

    - **Scénario A : "Fast-forward" ou "Merge made by strategy..."** (Tout va bien)
      Le terminal ne signale pas d'erreur. Tu peux passer au point 4.

    - **Scénario B : CONFLITS (CONFLICT)**
      Si git te dit `CONFLICT (content): Merge conflict in...`, **arrête-toi**.
      - Ouvre les fichiers indiqués en rouge.
      - Tu verras des zones avec `<<<<<<< HEAD` (code actuel sur merge) et `>>>>>>> atabong` (ton code).
      - Choisis le code à garder, supprime les balises bizarres.
      - Sauvegarde les fichiers.
      - Fais `git add .` pour valider la résolution.
      - Fais `git commit` (sans message, git en mettra un par défaut).

4.  **Envoie la branche `merge` mise à jour sur le serveur :**
    ```bash
    git push origin merge
    ```

---

### Étape 3 : Déployer vers `main` (Production)

Une fois que tout est validé sur `merge`, on envoie sur `main`.

**🚨 ATTENTION :** Comme nous avons configuré ton code pour utiliser `localhost:3001` (le JSON server), si tu pousses tel quel sur `main` et que le site est déployé en ligne (Vercel, Netlify...), **ça ne marchera pas** car le serveur en ligne n'a pas accès à ton `localhost`.

**Si tu veux pousser sur `main` maintenant, tu as deux options :**

1.  **Option Dev :** Tu pousses tel quel (seulement si `main` est utilisé pour des démos locales).
2.  **Option Prod :** Tu remets les URLs de production dans `src/lib/services/gare-service.ts` et `agency-public-service.ts` avant de faire le merge final.

**La commande pour fusionner :**

1.  **Bascule sur `main` :**

    ```bash
    git checkout main
    ```

2.  **Mets à jour `main` (Toujours !) :**

    ```bash
    git pull origin main
    ```

3.  **Fusionne `merge` dans `main` :**

    ```bash
    git merge merge
    ```

4.  **Envoie sur le serveur :**

    ```bash
    git push origin main
    ```

5.  **Reviens sur ta branche de travail pour la suite :**
    ```bash
    git checkout atabong
    ```

---

### Résumé des Commandes (Copie rapide)

**1. Sauver `atabong`**

```bash
git checkout atabong
git add .
git commit -m "Mise a jour Gares et Agences"
git push origin atabong
```

**2. Mettre à jour `merge`**

```bash
git checkout merge
git pull origin merge
git merge atabong
# (Si conflit : régler -> git add . -> git commit)
git push origin merge
```

**3. Mettre à jour `main`**

```bash
git checkout main
git pull origin main
git merge merge
git push origin main
git checkout atabong
```

### Méthode Alternative (La plus "Pro") : Les Pull Requests

Si tu travailles sur GitHub ou GitLab, la méthode recommandée pour éviter les erreurs manuelles est :

1.  Fais **uniquement l'Étape 1** (Push `atabong`).
2.  Va sur l'interface web de GitHub/GitLab.
3.  Crée une **Pull Request (PR)** de `atabong` vers `merge`.
4.  L'interface te dira s'il y a des conflits et te permettra de fusionner en cliquant sur un bouton.
5.  Répète l'opération pour une PR de `merge` vers `main`.

C'est plus sûr car cela permet de relire le code avant de l'envoyer.
