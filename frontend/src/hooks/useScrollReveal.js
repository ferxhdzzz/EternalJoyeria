import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useScrollReveal
 * A reusable hook that reveals the target element with a smooth fade-in / slide-up
 * animation the first time it enters the viewport. It automatically cleans up the
 * ScrollTrigger instance when the component unmounts.
 *
 * @param {React.RefObject<HTMLElement>} ref ‑ React ref of the DOM node to animate.
 * @param {Object} [options] ‑ Optional GSAP vars to override the default animation.
 */
export default function useScrollReveal(ref, options = {}) {
  useEffect(() => {
    if (!ref?.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const { scrollTrigger: userScrollTrigger = {}, ...rest } = options;

    const tl = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%', // animation starts when element enters low viewport
          end: 'top 35%',   // completes a bit before center
          scrub: true,      // tie animation progress to scroll position
          ...userScrollTrigger,
        },
        ...rest,
      },
    );

    // Cleanup on unmount
    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [ref, options]);
}
