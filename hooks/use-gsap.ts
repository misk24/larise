import gsap from "gsap";
import { RefObject, useEffect, useRef } from "react"

export function useGsapContext(
  scope: RefObject<HTMLElement | null>, 
  animate: () => void, 
  deps: any[] = []
) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(animate, scope);
    return () => ctx.revert();
  }, deps);
}

export function useGsapReveal(
  scope: RefObject<HTMLElement | null>, 
  options: gsap.TweenVars & { start?: string } = {}
) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from(scope.current!.children, {
        opacity: 0,
        scale: 0.9,
        duration: 2,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: options.start ?? "top 75%",
        },
        ...options
      });
    }, [scope]);

    return () => ctx.revert();
  }, []);
}

export function useGsapRevealUp(
  scope: RefObject<HTMLElement | null>, 
  options: gsap.TweenVars & { start?: string } = {}
) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from(scope.current!.children, {
        opacity: 0,
        y: 24,
        duration: 2,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: options.start ?? "top 75%",
        },
        ...options
      });
    }, scope);

    return () => ctx.revert();
  }, []);
}

export function useGsapRevealDown(
  scope: RefObject<HTMLElement | null>, 
  options: gsap.TweenVars & { start?: string } = {}
) {
  useEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from(scope.current!.children, {
        opacity: 0,
        y: -12,
        duration: 2,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: options.start ?? "top 75%",
        },
        ...options
      });
    }, scope);

    return () => ctx.revert();
  }, []);
}

export function useGsapScrollStagger(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  options: gsap.TweenVars & { start?: string } = {}
) {
  useEffect(() => {
    if (!scope.current) return;

    const ctx = gsap.context(() => {
      gsap.from(scope.current!.querySelectorAll(selector), {
        opacity: 0,
        y: 24,
        duration: 2,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: options.start ?? "top 75%",
        },
        ...options,
      });
    }, scope);

    return () => ctx.revert();
  }, []);
}

export function useGsapToggleStagger(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  isOpen: boolean,
  visible: boolean,
  skipCloseRef: React.MutableRefObject<boolean>,
  onClose: () => void
) {
  const wasOpen = useRef(isOpen);
  
  useEffect(() => {
    if (!scope.current) {
      wasOpen.current = isOpen;
      return;
    }

    const items = scope.current.querySelectorAll(selector);
    if (!items.length) {
      wasOpen.current = isOpen;
      return;
    }

    if (isOpen && visible) {
      gsap.fromTo(
        items, 
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y:0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }

    if (wasOpen.current && !isOpen && visible) {
      if (skipCloseRef.current) {
        skipCloseRef.current = false;
        onClose();
      } else {
        gsap.to(items, {
          opacity: 0,
          y: -24,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.in",
          onComplete: onClose,
        });
      }
    }

    wasOpen.current = isOpen;
  }, [isOpen, visible]);
}

export function useGsapParallax(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  distance = 40
) {
  useEffect(() => {
    if (!scope.current) return;

    const ctx = gsap.context(() => {
      gsap.to(scope.current!.querySelectorAll(selector), {
        y: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, scope);

    return () => ctx.revert();
  }, [distance]);
}