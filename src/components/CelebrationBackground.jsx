function CelebrationBackground({ score, total }) {
  const percentage = Math.round((score / total) * 100)
  
  if (percentage < 90) {
    return null
  }
  
  return (
    <div className="stars-container">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="star" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}></div>
      ))}
    </div>
  )
}

export default CelebrationBackground
