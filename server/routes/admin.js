const express =
require('express');

const router =
express.Router();

const {
getPendingUsers,
updateVerificationStatus
}
=
require(
'../controllers/adminController'
);


// get pending requests
router.get(
'/pending',
getPendingUsers
);


// approve or reject
router.put(
'/approve/:id',
updateVerificationStatus
);


module.exports =
router;