# xQuizer

<div align="center">
  <img src="./public/day17logo.png" alt="xQuizer Logo" width="200"/>
  
  ### Interactive Quiz Application for HCI & UX/UI Design
  
  A comprehensive quiz platform built with React for testing knowledge in Human-Computer Interaction, UX Laws, and Interaction Design concepts.
  
  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)
  [![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.24-FF0055?logo=framer)](https://www.framer.com/motion/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

---

## 📚 About

**xQuizer** is an interactive quiz application designed to help students and professionals master key concepts in:

- **Human-Computer Interaction (HCI)** - Accessibility, usability, and acceptability principles
- **UX/UI Design** - Laws of UX, design patterns, and best practices
- **Interaction Design** - PACT framework, Norman's gulfs, affordances, and feedback
- **Literature Review** - Benyon's textbook chapters and design fundamentals

Built by **Neuye** as a comprehensive learning tool with features including detailed explanations, progress tracking, randomized quizzes, and performance statistics.

---

## ✨ Features

### 🎯 Core Functionality
- **15 Specialized Quizzes** covering different HCI topics and chapters
- **464 Total Questions** with detailed explanations
- **Multiple Quiz Types:**
  - Chapter-based quizzes (Chapters 2, 3, 5, 6, 7, 8, 10)
  - Full question list (209 questions)
  - Randomizer quiz (30 random questions)
  - UX Laws & Literature quizzes
  - Find-the-incorrect quizzes

### 📊 Progress Tracking
- **Statistics Dashboard** showing performance across all quizzes
- **LocalStorage Persistence** - your progress is saved automatically
- **Attempt History** - track improvement over time
- **Best Score Tracking** - see your highest achievements
- **Completion Metrics** - monitor questions completed vs. total

### 🎨 User Experience
- **Smooth Animations** powered by Framer Motion
- **Responsive Design** - works on desktop, tablet, and mobile
- **Interactive UI** with hover effects and visual feedback
- **Answer Randomization** prevents pattern memorization
- **Detailed Explanations** with bullet points for better learning
- **Keyboard Navigation** for accessibility

### 🧠 Educational Features
- **Short & Long Explanations** for every question
- **Real-World Examples** demonstrating concepts
- **Visual Learning** with UX law illustrations
- **Section References** linking to textbook chapters
- **Concept Reinforcement** through varied question types

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dvnnyle/xQuizer.git
   cd xQuizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
xQuizer/
├── public/
│   └── day17logo.png          # Application logo
├── src/
│   ├── assets/                # Images and visual resources
│   │   └── uxImg/            # UX law illustrations
│   ├── chapterList/          # Chapter-based quizzes
│   │   ├── chapter2.jsx
│   │   ├── chapter3.jsx
│   │   ├── chapter5.jsx
│   │   ├── chapter6.jsx
│   │   ├── chapter7.jsx
│   │   ├── chapter8.jsx
│   │   ├── chapter10.jsx
│   │   ├── fullQuestionList.jsx
│   │   └── randomizerQuiz.jsx
│   ├── dataBank/             # Question datasets (JSON)
│   │   ├── chapter2.json
│   │   ├── chapter3.json
│   │   ├── chapter5.json
│   │   ├── chapter6.json
│   │   ├── chapter7.json
│   │   ├── chapter8.json
│   │   ├── chapter10.json
│   │   └── dataSub/          # Additional quiz data
│   ├── litterature/          # Literature review quizzes
│   │   ├── uxLaws.jsx
│   │   └── benyon12lit.jsx
│   ├── moreQuizes/           # Specialized quiz types
│   │   ├── uxQuiz1.jsx
│   │   ├── uxQuiz2.jsx
│   │   ├── benyon12Quiz.jsx
│   │   ├── quizFindIncorrect.jsx
│   │   └── quizFindIncorrect2.jsx
│   ├── pages/
│   │   ├── Home.jsx          # Main landing page
│   │   └── Statistics.jsx    # Performance dashboard
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎓 Quiz Categories

### Chapter Quizzes
- **Chapter 2** - Introduction to HCI (30 questions)
- **Chapter 3** - Design Fundamentals (30 questions)
- **Chapter 5** - Accessibility, Usability, Acceptability (30 questions)
- **Chapter 6** - Interaction Design Principles (30 questions)
- **Chapter 7** - User Research & Evaluation (30 questions)
- **Chapter 8** - Design Patterns (30 questions)
- **Chapter 10** - Advanced Topics (30 questions)

### Specialized Quizzes
- **Full Question List** - All chapter questions combined (209 questions)
- **Randomizer** - Random selection of 30 questions
- **Benyon Chapter 12** - Literature review (20 questions)
- **UX Laws Quiz 1 & 2** - Design laws and principles
- **Find Incorrect 1 & 2** - Identify incorrect statements

---

## 🛠️ Technologies Used

- **[React 19.2.0](https://reactjs.org/)** - Frontend framework
- **[Vite 7.2.4](https://vitejs.dev/)** - Build tool & dev server
- **[Framer Motion 12.23.24](https://www.framer.com/motion/)** - Animation library
- **[React Router 7.9.6](https://reactrouter.com/)** - Client-side routing
- **LocalStorage API** - Progress persistence
- **CSS3** - Styling and responsive design

---

## 📈 Statistics & Tracking

The Statistics page provides comprehensive insights:

- **Total Questions**: 464 across all quizzes
- **Completed Questions**: Track your progress
- **Correct Answers**: Overall accuracy
- **Per-Quiz Metrics**: 
  - Last score
  - Best score
  - Total attempts
  - Completion status

---

## 🎨 Design Principles

This application follows key UX principles it teaches:

- **Visibility** - Clear navigation and quiz status
- **Feedback** - Immediate response to user actions
- **Consistency** - Uniform design patterns throughout
- **Learnability** - Intuitive interface for first-time users
- **Efficiency** - Quick access to quizzes and statistics
- **Accessibility** - Keyboard navigation and screen reader support

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve xQuizer:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Neuye**
- GitHub: [@dvnnyle](https://github.com/dvnnyle)
- Project: [xQuizer](https://github.com/dvnnyle/xQuizer)

---

## 🙏 Acknowledgments

- Based on HCI and Interaction Design course materials
- UX Laws illustrations from various design resources
- Inspired by best practices in quiz application design
- Built with modern web technologies for optimal performance

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

<div align="center">
  <p>Made with ❤️ by Neuye</p>
  <p>Happy Learning! 🎓</p>
</div>
