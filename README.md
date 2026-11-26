# LearnSphere

**Making learning interactive, engaging, and rewarding.**

LearnSphere is an interactive educational web application designed for learners aged 8–12. It combines structured learning content with educational games and gamified progress tracking to make learning more engaging.

Students can explore Maths and Science lessons, reinforce concepts through interactive activities, play quizzes and matching games, and track their progress through XP, levels, achievements, and learning streaks.

## Features

### 📚 Interactive Learning
- Six educational lessons across Maths and Science.
- Step-by-step explanations and examples.
- Interactive activities integrated into lessons.
- Lesson outcomes and key takeaways.
- Lesson completion tracking.

### 🎮 Educational Games
- **Quiz:** Test understanding through multiple-choice questions, instant feedback, scores, and results.
- **Matching:** Match related concepts through an interactive card-based game.
- Lesson-specific gameplay to reinforce concepts.
- Game instructions and pre-game selection screens.
- Replay functionality and performance tracking.

### 🏆 Gamified Progress
- XP rewards for learning and game completion.
- Level progression.
- Achievements and unlockable milestones.
- Learning streaks.
- Lesson completion tracking.
- Subject-specific progress.
- Game scores and activity history.

### 👤 Learner Profiles
- Personal learner profile.
- Nickname customisation.
- XP and level overview.
- Lesson progress.
- Achievements.
- Streaks and recent activity.

### 🔐 Authentication
- Email and password registration and login.
- Google sign-in.
- Password reset.
- Persistent authentication sessions.
- Logout functionality.
- Guest learning experience.
- Guest progress preservation during account creation and login.

## Subjects & Lessons

### Mathematics
- Fractions: Parts of a Whole
- Multiplication: Patterns and Products
- Shapes: Explore Geometry

### Science
- The Solar System
- Living Things
- Materials Around Us

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, responsive layouts and UI |
| JavaScript | Interactive functionality and application logic |
| Firebase Authentication | User registration, login and identity management |
| Local Storage | Persistent learning progress and local data |
| Git & GitHub | Version control |

## Getting Started

### Prerequisites

- A modern web browser.
- Python 3 installed, or another local development server.
- A Firebase project configured for LearnSphere.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/LearnSphere.git
   ```

2. Navigate into the project directory:

   ```bash
   cd LearnSphere
   ```

3. Configure Firebase using your Firebase project's web configuration.

4. Start a local server:

   ```bash
   python3 -m http.server 8000
   ```

5. Open the application:

   ```text
   http://localhost:8000
   ```

## Firebase Configuration

LearnSphere uses Firebase Authentication for account management.

To configure your own Firebase instance:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Register a web application.
3. Enable Email/Password authentication.
4. Enable Google authentication.
5. Configure authorized domains.
6. Add your Firebase web configuration to the application's configuration file.

Do not commit private credentials, service account keys, or sensitive configuration files.

## Project Structure

```text
LearnSphere/
│
├── index.html
├── subjects.html
├── lessons.html
├── lesson.html
├── games.html
├── game.html
├── account.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── progress.js
│   ├── profile.js
│   ├── auth.js
│   └── ...
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

*The structure above is illustrative and may differ from the current implementation.*

## Design

LearnSphere uses a clean, approachable visual design with subject-specific colour themes:

- **Mathematics:** Blue
- **Science:** Green
- **Branding:** Purple and indigo
- **Rewards:** Yellow and gold

The interface is designed to be responsive across desktop, tablet, and mobile screens.

## Project Goals

LearnSphere aims to make educational learning more engaging by combining clear explanations, active practice, educational games, and visible progress.

Instead of simply reading content, learners can actively interact with concepts, challenge themselves, earn rewards, and build consistent learning habits.

## Future Development

Potential future improvements include:

- Cloud-based progress synchronisation across devices.
- Expanded lesson content and additional subjects.
- More educational games.
- Improved analytics and learning insights.
- Additional accessibility improvements.

## Author

Developed as an educational web development project.

---

**Learn. Play. Progress.**
