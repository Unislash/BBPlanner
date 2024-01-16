import * as React from 'react';
import { useRef, useState } from "react";
import {loadFromStorage, saveBuildIdListToStorage} from '../../storage';
import DeleteIcon from '@material-ui/icons/Delete';
import { findIndex, Position } from "./findIndex";
import move from "array-move";
import {BuildEntry} from './BuildEntry';
import {useBuildActions, useBuildIdList} from '../../stores/buildStore';

export const BuildList = (): JSX.Element => {
    const buildIdList = useBuildIdList();
    const {setBuildIdList, removeBuild} = useBuildActions();

    const [isItemDragging, setIsItemDragging] = useState(false)

    // We need to collect an array of height and position data for all of this component's
    // `Item` children, so we can later us that in calculations to decide when a dragging
    // `Item` should swap places with its siblings.
    const positions = useRef<Position[]>([]).current;
    const setPosition = (i: number, offset: Position) => {
        positions[i] = offset
    };

    // Find the ideal index for a dragging item based on its position in the array, and its
    // current drag offset. If it's different to its current index, we swap this item with that
    // sibling.
    const moveItem = (i: number, dragOffset: number) => {
        const targetIndex = findIndex(i, dragOffset, positions);
        if (targetIndex !== i) {
            const newBuildIdList = move(buildIdList, i, targetIndex);
            setBuildIdList(newBuildIdList);
            saveBuildIdListToStorage(newBuildIdList);
        }
    };

    /**
     * We use this to turn off the click handlers if an item is being dragged, so that they don't
     * fire when the drag is completed.
     * I wish I didn't need to wrap this in a timeout, but if I don't it will be set back to false
     * by the motion dragging API before the click handlers fire when the mouse button is released.
     */
    const setIsDragging = (isDragging: boolean) => {
        setTimeout(() => {setIsItemDragging(isDragging)}, 1)
    };

    return (
        <div className="savedBuilds">
            <h3>Saved Builds</h3>
            <div className="buildList">
                {
                    buildIdList.map((buildId, i) => (
                        <BuildEntry
                            key={buildId}
                            className="buildEntry"
                            i={i}
                            setPosition={setPosition}
                            moveItem={moveItem}
                            setIsDragging={setIsDragging}
                        >
                            <span className="buildEntryText" onClick={() => {
                                if (!isItemDragging) {
                                    loadFromStorage(buildId)
                                }
                            }}>{buildId}</span>
                            <div
                                className="deleteBuild"
                                onClick={() => {
                                    if (!isItemDragging) {
                                        removeBuild(buildId);
                                    }
                                }}
                            >
                                <DeleteIcon/>
                            </div>
                        </BuildEntry>
                    ))
                }
            </div>
        </div>
    );
};
