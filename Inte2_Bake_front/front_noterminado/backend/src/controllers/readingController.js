const service = require("../services/readingService");

exports.postReading = async (req, res, next) => {
    try {
        const r = await service.create(req.body);
        res.status(201).json(r);
    } catch (err) { next(err) }
};

exports.getReadings = async (req, res, next) => {
    console.log('Query params: ', req.query);
    try {
        const { page, limit, startDate, endDate } = req.query;
        const data = await service.list(+page || 1, +limit || 20, startDate, endDate);
        res.json(data);
    } catch (err) { next(err) }
};

exports.getLatest = async (req, res, next) => {
    try {
        const r = await service.latest();
        res.json(r);
    } catch (err) { next(err) }
};

exports.getReading = async (req, res, next) => {
    try {
        const r = await service.getById(req.params.id);
        if (!r) return res.status(404).json({ error: 'Lectura no encontrada'});
        res.json(r);
    } catch (err) { next(err) }
};

exports.updateReading = async (req, res, next) => {
    try {
        const r = await service.update(req.params.id, req.body);
        if (!r) return res.status(404).json({ error: 'Lectura no encontrada'});
        res.json(r);
    } catch (err) { next(err) }
};

exports.deleteReading = async (req, res, next) => {
    try {
        const deleted = await service.remove(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Lectura no encontrada'});
        res.status(204).end();
    } catch (err) { next(err) }
};
