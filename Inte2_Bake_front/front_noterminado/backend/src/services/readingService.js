const { Op } = require('sequelize');
const Reading = require("../models/Reading");

exports.create = data => {
    return Reading.create(data);
};

exports.list = async (page = 1, limit = 20, startDate, endDate) => {
    const offset = (page - 1) * limit;

    let where = {};
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        console.log('Filtrando entre: ', start.toISOString(), end.toISOString());

        where.timestamp = {
            [Op.between]: [start, end]
        };
    }

    const { rows: docs, count: total } = await Reading.findAndCountAll({
        where,
        order: [['timestamp', 'DESC']],
        limit,
        offset
    });

    const pages = Math.ceil(total / limit);
    return { docs, total, page, pages };
};

exports.latest = () => {
    return Reading.findOne({ order: [['timestamp', 'DESC']] });
};

exports.getById = id => {
    return Reading.findByPk(id);
};

exports.update = async (id, data) => {
    const reading = await Reading.findByPk(id);
    if (!reading) return null;
    return reading.update(data);
};

exports.remove = id => {
    return Reading.destroy({ where: { id_lectura: id }});
};
