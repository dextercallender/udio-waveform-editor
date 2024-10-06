// PublisherComponent.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { emit } from './EventsActions';
import { ActionType, EmitAction } from './EventTypes';

const PublisherComponent: React.FC = () => {
    const dispatch = useDispatch<Dispatch<EmitAction>>();

    const handleClick = () => {
        dispatch(emit('myTopic', { message: 'Hello, World!' }));
    };

    return (
        <button onClick={handleClick}>
            Publish
        </button>
    );
};

export default PublisherComponent;