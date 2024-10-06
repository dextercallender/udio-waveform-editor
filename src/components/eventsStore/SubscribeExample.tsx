// SubscriberComponent.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { listen, unlisten } from './EventsActions';
import { ListenAction, UnlistenAction } from './EventTypes';

const SubscriberComponent: React.FC = () => {
    const dispatch = useDispatch<Dispatch<ListenAction | UnlistenAction>>();

    useEffect(() => {
        const callback = (data: any) => {
            console.log('Received data:', data);
        };

        dispatch(listen('myTopic', callback));

        return () => {
            dispatch(unlisten('myTopic', callback));
        };
    }, [dispatch]);

    return <div>Subscriber Component</div>;
};

export default SubscriberComponent;