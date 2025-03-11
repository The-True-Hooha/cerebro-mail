'use client';

import { motion } from 'motion/react';
import UnderlineToBackground from './ui/text-background-underline';

export default function Footer() {
  const words = 'Get in touch or request a demo/feature? —'.split(' ');

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="mt-auto font-abcDiatype font-light md:font-medium text-[16px] md:text-[18px] w-full pb-40">
      <motion.div
        className="px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {words.map((word, index) => (
            <motion.span key={index} variants={wordVariants} className="mr-1 inline-block text-black">
            {word}
          </motion.span>
        ))}

        <motion.span variants={wordVariants} className="inline-block">
          <UnderlineToBackground
            label="contact us"
            targetTextColor="#faf8ec"
            className="text-hotOrange cursor-pointer"
            onClick={() => window.location.href = "mailto:owogogahhero@outlook.com"}
          />
        </motion.span>
      </motion.div>
    </div>
  );
}
