// src/Components/AnimatedPage.jsx
import { motion } from "framer-motion";

// These are the animation settings (a simple fade-in and slide-up)
const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }} // Controls the speed
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;