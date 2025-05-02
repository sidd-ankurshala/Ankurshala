module.exports = {
    validateHeaders: (req, res, next) => {
        const apiKey = req.header('API-Key');
        if (!apiKey || apiKey !== 'mydentalabs') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    }
}