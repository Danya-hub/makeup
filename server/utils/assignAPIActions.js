function assignAPIActions(router, controller) {
    Object.entries(controller).forEach(([method, objActions]) =>
        Object.keys(objActions).forEach((name) => {
            router[method](`/${name}`, ...objActions[name]());
        }));
    
    return router;
}

export default assignAPIActions;