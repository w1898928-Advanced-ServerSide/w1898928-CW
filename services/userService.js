const UserDao = require('../daos/userDao');
const bcryptUtils = require('../utils/bcryptUtils');

class UserService {
  static async registerUser(username, password) {
    const hashedPassword = await bcryptUtils.hashPassword(password);
    return new Promise((resolve, reject) => {
      UserDao.createUser(username, hashedPassword, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async loginUser(username, password) {
    return new Promise((resolve, reject) => {
      UserDao.findUserByUsername(username, async (err, user) => {
        if (err || !user) {
          reject('Invalid username or password');
        } else {
          const isValidPassword = await bcryptUtils.comparePassword(password, user.password);
          if (!isValidPassword) {
            reject('Invalid username or password');
          } else {
            resolve(user);
          }
        }
      });
    });
  }
}

module.exports = UserService;