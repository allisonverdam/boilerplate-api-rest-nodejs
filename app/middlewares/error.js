export default (app) => {
    app.use((req, res, next) => {
        res.status(404).json({
            message: "Resource not found."
        })
    });


    return app;

}