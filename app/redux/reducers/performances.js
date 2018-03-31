const performances = (state = {}, action) => {
    switch (action.type) {
        default:
            console.log('info, event action not handled: ' + action.type);
            return state;
    }
};

export default performances;