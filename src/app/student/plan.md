### Plan d'Action pour le Tableau de Bord de l'Étudiant

1. **Créer des composants** :
   - **Composant `ExamSubjectsComponent`** : Pour afficher les sujets d'examen.
   - **Composant `SubmissionComponent`** : Pour permettre aux étudiants de soumettre leurs réponses en PDF.
   - **Composant `GradesComponent`** : Pour afficher les notes après correction.
   - **Composant `ChatbotComponent`** : Pour interagir avec un chatbot concernant les sujets ou les corrections.

2. **Mettre à jour le module étudiant** :
   - Déclarer les nouveaux composants dans le `StudentModule` pour qu'ils soient reconnus par Angular.

3. **Configurer le routage** :
   - Mettre à jour le `StudentRoutingModule` pour inclure les routes vers les nouveaux composants, permettant ainsi la navigation entre eux.

4. **Implémenter les services nécessaires** :
   - **Service `SubmissionService`** : Pour gérer les soumissions des étudiants et les notes.
   - **Service `ChatbotService`** : Pour interagir avec le chatbot.

5. **Tests et validation** :
   - Tester chaque fonctionnalité pour s'assurer qu'elle fonctionne comme prévu et qu'il n'y a pas de régressions.

### Étapes Suivantes
- Créer les composants et les services nécessaires.
- Mettre à jour le module et le routage.
- Effectuer des tests pour valider les fonctionnalités.
