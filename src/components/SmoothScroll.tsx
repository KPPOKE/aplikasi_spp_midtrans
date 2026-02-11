import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll component — initializes Lenis smooth scrolling on desktop only.
 * On mobile (< 640px), native scrolling is preserved for better touch experience.
 */
export function SmoothScroll() {
    useEffect(() => {
        // Only enable on desktop
        const isDesktop = window.innerWidth >= 640;
        if (!isDesktop) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 0, // Disable on touch to keep native feel
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Handle resize — destroy on mobile, keep on desktop
        const handleResize = () => {
            if (window.innerWidth < 640) {
                lenis.destroy();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            lenis.destroy();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return null;
}
