// module.exports = (req, res, next) => {
//     console.log('req.user:', req.user); // Debugging line
//     if (!req.user) {
//         return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }
//     next();
// };