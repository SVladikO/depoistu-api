const provideApiDocRoute = (app, routes) => {
    const api = routes.map(
        ({name, description, routes}) =>
            ({
                name,
                description,
                routes: routes.map(({method, url, url_example, description, details}) => ({
                    method,
                    details,
                    url,
                    url_example,
                    description
                }))
            })
    );

    app.get('/api', function (req, res) {
        res.json(api);
    })
}

const connectRoutes = (app, routes) => {
    routes.forEach(
        entity => entity.routes.forEach(
            route => app[route.method](route.url, ...route.callbacks)
        )
    );
}

module.exports = {
    connectRoutes,
    provideApiDocRoute,
};