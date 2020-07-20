import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import {Position} from './findIndex';

export interface BuildEntryProps {
    setPosition: (i: number, offset: Position) => void;
    moveItem: (i: number, dragOffset: number) => void;
    setIsDragging: (isDragging: boolean) => void;
    i: number;
    className: string;
}

export const BuildEntry: React.FC<BuildEntryProps> = ({
  setPosition, moveItem, i, children, className, setIsDragging,
}) => {
    const [isDragging, setDragging] = useState(false);

    const setDraggingStates = (isDragging: boolean) => {
        setDragging(isDragging)
        setIsDragging(isDragging);
    };

    // We'll use a `ref` to access the DOM element that the `motion.li` produces.
    // This will allow us to measure its height and position, which will be useful to
    // decide when a dragging element should switch places with its siblings.
    const ref = useRef<HTMLDivElement>(null);

    // By manually creating a reference to `dragOriginY` we can manipulate this value
    // if the user is dragging this DOM element while the drag gesture is active to
    // compensate for any movement as the items are re-positioned.
    const dragOriginY = useMotionValue(0);

    // Update the measured position of the item so we can calculate when we should rearrange.
    useEffect(() => {
        setPosition(i, {
            height: ref.current!.offsetHeight,
            top: ref.current!.offsetTop
        });
    });

    return (
        <motion.div
            className={className}
            ref={ref}
            initial={false}
            // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
            animate={isDragging ? onTop : flat}
            whileTap={{ scale: 1.03 }}
            drag="y"
            dragOriginY={dragOriginY}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={1}
            onDragStart={() => setDraggingStates(true)}
            onDragEnd={() => setDraggingStates(false)}
            onDrag={(_e, { point }) => moveItem(i, point.y)}
            positionTransition={({ delta }: {delta: {x: number; y: number;}}) => {
                if (isDragging) {
                    // If we're dragging, we want to "undo" the items movement within the list
                    // by manipulating its dragOriginY. This will keep the item under the cursor,
                    // even though it's jumping around the DOM.
                    dragOriginY.set(dragOriginY.get() + delta.y);
                }

                // If `positionTransition` is a function and returns `false`, it's telling
                // Motion not to animate from its old position into its new one. If we're
                // dragging, we don't want any animation to occur.
                return !isDragging;
            }}
        >
            {children}
        </motion.div>
    );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
    zIndex: 0,
    transition: { delay: 0.3 }
};
