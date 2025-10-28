"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
  AnimatePresence,
} from "framer-motion";
import { AnimatedMenuIcon } from "./icons";
import { Button } from "../ui/button";
import { Resume } from "@/lib/resume";

//==============================================================================
// 1. CONTEXT, HOOK & PROVIDER (The new <Drawer> component)
//==============================================================================
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

interface DrawerState {
  isDrawerOpen: boolean;
  isDesktop: boolean;
}

type DrawerAction =
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "SET_DESKTOP"; payload: boolean };

const drawerReducer = (
  state: DrawerState,
  action: DrawerAction
): DrawerState => {
  switch (action.type) {
    case "OPEN_DRAWER":
      return state.isDesktop ? state : { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return state.isDesktop ? state : { ...state, isDrawerOpen: false };
    case "SET_DESKTOP":
      return {
        ...state,
        isDesktop: action.payload,
        isDrawerOpen: action.payload,
      };
    default:
      return state;
  }
};

const initialState: DrawerState = { isDrawerOpen: false, isDesktop: false };

interface DrawerContextType {
  state: DrawerState;
  openDrawer: () => void;
  closeDrawer: () => void;
  x: ReturnType<typeof useMotionValue>;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return context;
};

export const Drawer: React.FC<{children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(drawerReducer, initialState);
  const isDesktopQuery = useMediaQuery("(min-width: 1024px)");
  const x = useMotionValue(0);

  useEffect(() => {
    dispatch({ type: "SET_DESKTOP", payload: isDesktopQuery });
  }, [isDesktopQuery]);

  const openDrawer = () => dispatch({ type: "OPEN_DRAWER" });
  const closeDrawer = () => dispatch({ type: "CLOSE_DRAWER" });

  return (
    <DrawerContext.Provider value={{ state, openDrawer, closeDrawer, x }}>
       <DrawerTrigger />
      {children}
    </DrawerContext.Provider>
  );
};


//==============================================================================
// 2. DRAWER CONTENT (The visible panel)
//==============================================================================
export const DrawerContent: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { state: drawerState, closeDrawer } = useDrawer();

  const { isDrawerOpen, isDesktop } = drawerState;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDesktop) {
        closeDrawer();
      }
    };

    if (isDrawerOpen && !isDesktop) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, isDesktop, closeDrawer]);

  const drawerClasses = `
    w-72 max-w-[80vw] bg-sidebar z-0 flex flex-col no-print
    fixed top-0 left-0 h-full shadow-none
    lg:relative lg:shadow-xl}`;
    // ${isDesktop ? "relative shadow-xl" : "fixed top-0 left-0 h-full"}`;

  return (
    <aside className={drawerClasses} aria-hidden={!isDrawerOpen}>
      {children}
    </aside>
  );
};


//==============================================================================
// 3. DRAWER MAIN (The animated main content area)
//==============================================================================
const DRAWER_WIDTH = 288;
const DRAG_BUFFER = 50;

export const DrawerMain: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state: drawerState, closeDrawer, openDrawer, x } = useDrawer();
  const { isDrawerOpen, isDesktop } = drawerState;

  useEffect(() => {
    const targetX = isDesktop ? 0 : isDrawerOpen ? DRAWER_WIDTH : 0;
    animate(x, targetX, { type: "spring", bounce: 0, duration: 0.5 });
  }, [isDrawerOpen, isDesktop, x]);

  const scale = useTransform(x, [0, DRAWER_WIDTH], [1, 0.85]);
  const rotateY = useTransform(x, [0, DRAWER_WIDTH], [0, -30]);
  const borderRadius = useTransform(x, [0, DRAWER_WIDTH], [0, 24]);
  const boxShadow = useTransform(
    x,
    [0, DRAWER_WIDTH],
    ["none", "0 25px 50px -12px rgba(0, 0, 0, 0.25)"]
  );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (isDesktop) return;

    const { offset, velocity } = info;

    if (
      Math.abs(offset.x) < Math.abs(offset.y) &&
      Math.abs(velocity.y) > Math.abs(velocity.x)
    ) {
      animate(x, isDrawerOpen ? DRAWER_WIDTH : 0, {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      });
      return;
    }

    if (offset.x > DRAG_BUFFER || velocity.x > 200) {
      openDrawer();
    } else {
      closeDrawer();
    }
  };

  return (
    <motion.div
      drag={isDesktop ? false : "x"}
      onDragEnd={handleDragEnd}
      dragConstraints={{ left: 0, right: DRAWER_WIDTH }}
      dragElastic={0.05}
      style={{
        x,
        scale,
        rotateY,
        borderRadius,
        boxShadow,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative h-screen print:h-full flex flex-col flex-1 bg-card lg:rounded-none lg:shadow-none overflow-hidden"
    >
       
      {children}
      <AnimatePresence>
        {isDrawerOpen && !isDesktop && (
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            className="absolute inset-0 z-50 cursor-pointer"
            onClick={() => closeDrawer()}
            onKeyPress={(e) => e.key === "Enter" && closeDrawer()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

//==============================================================================
// 4. DRAWER TRIGGER (Button to open the drawer)
//==============================================================================
export const DrawerTrigger: React.FC = () => {
    const { state: drawerState, openDrawer, closeDrawer } = useDrawer();
  const { isDesktop, isDrawerOpen } = drawerState;

  if (isDesktop) return null;

  const toggleDrawer = () => {
    isDrawerOpen ? closeDrawer() : openDrawer();
  };

  return (
    <Button
      onClick={toggleDrawer}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden"
      aria-label="Toggle menu"
    >
      <AnimatedMenuIcon />
    </Button>
  );
};