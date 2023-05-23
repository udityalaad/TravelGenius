/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getHostByIdDAO,
        getNonCurrentHostByFieldDAO,
        AddHostDAO,
        UpdateHostDAO,
        DeleteHostDAO
    } = require("../DAO/HostDAO");
const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");

// remote calls
const { getActiveReservedCalendarsForOrByDifferentEntitiesDAO } = require("../DAO/ReservedCalendarDAO");


/*  **********************************************************
                    Services
    ********************************************************** */
// 1. Get Host By Id
const getHostByIdService = async (userId) => {
    const host = await getHostByIdDAO(userId);
    if (host.length == 0) {
        throw new NotFoundError(`Host with id ${userId} does not exist.`);
    }
    
    return host[0];
}

// 2. Add Host
const AddHostService = async (host) => {
    await duplicateCheck(host, -1);
    
    const result = await AddHostDAO(host);
    return result;
}

// 3. Update Host
const UpdateHostService = async (host) => {
    await duplicateCheck(host, host.userId);
    await getHostByIdService(host.userId);
    await UpdateHostDAO(host);
}

// 4. Delete Host
const DeleteHostService = async (userId) => {
    await getHostByIdService(userId);

    const activeReservations = await getActiveReservedCalendarsForOrByDifferentEntitiesDAO('hostId', userId);
    if (activeReservations.length > 0) {
        throw new ItemAlreadyExistsError(`There are active reservations for Host with Id ${userId}. Please clear those first.`);
    }

    await DeleteHostDAO(userId);
}


// Common Functions
const duplicateCheck = async (host, userId) => {
    var res = await getNonCurrentHostByFieldDAO(userId, 'userEmail', host.userEmail);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another host with email ${host.userEmail} already exist.`);
    }

    res = await getNonCurrentHostByFieldDAO(userId, 'hostThumbnailUrl', host.hostThumbnailUrl);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another host with hostThumbnailUrl ${host.hostThumbnailUrl} already exist.`);
    }

    res = await getNonCurrentHostByFieldDAO(userId, 'hostPictureUrl', host.hostPictureUrl);
    if (res.length != 0) {
        throw new ItemAlreadyExistsError(`Another host with hostPictureUrl ${host.hostPictureUrl} already exist.`);
    }
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getHostByIdService,
    AddHostService,
    UpdateHostService,
    DeleteHostService
}

